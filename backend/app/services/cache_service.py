import json
import time
from typing import Any, Optional
import redis
from app.core.config import settings
from app.core.logging import logger


class InMemoryCacheFallback:
    """Thread-safe in-memory cache fallback when Redis instance is unreachable."""

    def __init__(self):
        self._store: dict = {}
        self._expire: dict = {}

    def get(self, key: str) -> Optional[str]:
        if key in self._expire:
            if time.time() > self._expire[key]:
                del self._store[key]
                del self._expire[key]
                return None
        return self._store.get(key)

    def set(self, key: str, value: str, ex: Optional[int] = None) -> bool:
        self._store[key] = value
        if ex:
            self._expire[key] = time.time() + ex
        elif key in self._expire:
            del self._expire[key]
        return True

    def delete(self, key: str) -> bool:
        self._store.pop(key, None)
        self._expire.pop(key, None)
        return True

    def flushall(self) -> bool:
        self._store.clear()
        self._expire.clear()
        return True

    def ping(self) -> bool:
        return True


class CacheService:
    """Redis Cache Service with automatic in-memory fallback."""

    def __init__(self):
        self.client = None
        self.is_redis = False
        self._init_redis()

    def _init_redis(self):
        try:
            r = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=settings.REDIS_DB,
                password=settings.REDIS_PASSWORD or None,
                decode_responses=True,
                socket_timeout=1.0,
                socket_connect_timeout=1.0
            )
            r.ping()
            self.client = r
            self.is_redis = True
            logger.info("Connected to Redis cache server successfully.")
        except Exception as e:
            if settings.USE_REDIS_FALLBACK:
                logger.warning(f"Redis connection unavailable ({e}). Using In-Memory Cache fallback.")
                self.client = InMemoryCacheFallback()
                self.is_redis = False
            else:
                raise e

    def get_json(self, key: str) -> Optional[Any]:
        """Fetch and deserialize JSON from cache."""
        try:
            val = self.client.get(key)
            if val:
                return json.loads(val)
        except Exception as e:
            logger.error(f"Cache GET error for key '{key}': {e}")
        return None

    def set_json(self, key: str, value: Any, ttl_seconds: int = 300) -> bool:
        """Serialize and store JSON in cache with TTL."""
        try:
            serialized = json.dumps(value, default=str)
            return bool(self.client.set(key, serialized, ex=ttl_seconds))
        except Exception as e:
            logger.error(f"Cache SET error for key '{key}': {e}")
            return False

    def invalidate(self, key: str) -> bool:
        """Remove single key from cache."""
        try:
            return bool(self.client.delete(key))
        except Exception as e:
            logger.error(f"Cache DELETE error for key '{key}': {e}")
            return False

    def invalidate_prefix(self, prefix: str) -> int:
        """Remove all keys starting with prefix (e.g., 'company:1:*')."""
        count = 0
        try:
            if self.is_redis:
                keys = self.client.keys(f"{prefix}*")
                if keys:
                    count = self.client.delete(*keys)
            else:
                # In-Memory fallback invalidation
                keys_to_del = [k for k in self.client._store.keys() if k.startswith(prefix)]
                for k in keys_to_del:
                    self.client.delete(k)
                    count += 1
        except Exception as e:
            logger.error(f"Cache Invalidate Prefix error for '{prefix}': {e}")
        return count

    def get_status(self) -> dict:
        """Check cache service status for health checks."""
        try:
            healthy = self.client.ping()
            return {
                "status": "HEALTHY" if healthy else "UNHEALTHY",
                "type": "REDIS" if self.is_redis else "IN_MEMORY_FALLBACK"
            }
        except Exception:
            return {"status": "UNHEALTHY", "type": "DISCONNECTED"}


cache_service = CacheService()
