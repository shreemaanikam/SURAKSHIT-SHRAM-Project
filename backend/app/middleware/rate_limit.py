import time
from typing import Dict, Tuple
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint


class PrototypeRateLimitMiddleware(BaseHTTPMiddleware):
    """In-memory prototype rate limiter preventing abuse (100 requests / minute / IP)."""

    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.ip_store: Dict[str, Tuple[int, float]] = {}

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Exclude health check and docs from rate limit
        if request.url.path in ("/api/v1/health", "/docs", "/redoc", "/openapi.json"):
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        if client_ip in self.ip_store:
            count, start_time = self.ip_store[client_ip]
            if now - start_time < self.window_seconds:
                if count >= self.max_requests:
                    request_id = getattr(request.state, "request_id", "unknown")
                    return JSONResponse(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        content={
                            "error": {
                                "code": "TOO_MANY_REQUESTS",
                                "message": "Rate limit exceeded. Please try again later.",
                                "details": f"Limit: {self.max_requests} requests per {self.window_seconds}s.",
                                "request_id": request_id
                            }
                        }
                    )
                self.ip_store[client_ip] = (count + 1, start_time)
            else:
                self.ip_store[client_ip] = (1, now)
        else:
            self.ip_store[client_ip] = (1, now)

        return await call_next(request)
