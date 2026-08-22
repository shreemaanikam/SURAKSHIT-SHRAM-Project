import time
from typing import Dict, Tuple
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint


class PrototypeRateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiter with route-specific limits and periodic memory eviction."""

    def __init__(self, app, max_requests: int = 120, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        # IP Store maps: ip_address -> { path_category: (count, window_start_time) }
        self.ip_store: Dict[str, Dict[str, Tuple[int, float]]] = {}
        self.last_cleanup = time.time()

    def _cleanup_expired_records(self, now: float):
        """Evict stale IP records older than window_seconds to prevent memory leaks."""
        if now - self.last_cleanup < 120:  # Cleanup every 2 minutes
            return
        self.last_cleanup = now
        stale_ips = []
        for ip, categories in self.ip_store.items():
            active_categories = {
                cat: val for cat, val in categories.items()
                if now - val[1] < self.window_seconds
            }
            if active_categories:
                self.ip_store[ip] = active_categories
            else:
                stale_ips.append(ip)
        for ip in stale_ips:
            self.ip_store.pop(ip, None)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Exclude health check, docs, and OpenAPI schema
        if request.url.path in ("/api/v1/health", "/docs", "/redoc", "/api/v1/openapi.json"):
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        self._cleanup_expired_records(now)

        # Route-specific limit: Strict limit for login (10 req/min), default for other APIs (120 req/min)
        if request.url.path.endswith("/auth/login"):
            category = "login"
            limit = 10
        else:
            category = "general"
            limit = self.max_requests

        if client_ip not in self.ip_store:
            self.ip_store[client_ip] = {}

        ip_categories = self.ip_store[client_ip]

        if category in ip_categories:
            count, start_time = ip_categories[category]
            if now - start_time < self.window_seconds:
                if count >= limit:
                    request_id = getattr(request.state, "request_id", "unknown")
                    return JSONResponse(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        content={
                            "error": {
                                "code": "TOO_MANY_REQUESTS",
                                "message": f"Rate limit exceeded for endpoint. Limit: {limit} requests per minute.",
                                "details": None,
                                "request_id": request_id
                            }
                        }
                    )
                ip_categories[category] = (count + 1, start_time)
            else:
                ip_categories[category] = (1, now)
        else:
            ip_categories[category] = (1, now)

        return await call_next(request)
