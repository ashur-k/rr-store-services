import json
import logging

from redis.asyncio import Redis
from redis.exceptions import RedisError

logger = logging.getLogger(__name__)


class CacheService:
    """Reusable JSON cache that fails open when Redis is unavailable."""

    def __init__(self, redis: Redis) -> None:
        self.redis = redis

    async def get_json(self, key: str):
        try:
            value = await self.redis.get(key)

            if value is None:
                return None

            return json.loads(value)

        except RedisError, OSError, TimeoutError:
            logger.warning(
                "Redis cache read failed; bypassing cache",
                exc_info=True,
            )
            return None
        except json.JSONDecodeError:
            logger.warning("Invalid JSON in Redis cache for key %s", key)
            return None

    async def set_json(
        self,
        key: str,
        value: object,
        ttl_seconds: int = 30,
    ) -> None:
        serialized = json.dumps(value)

        try:
            await self.redis.set(key, serialized, ex=ttl_seconds)
        except RedisError, OSError, TimeoutError:
            logger.warning(
                "Redis cache write failed; continuing without cache",
                exc_info=True,
            )

    async def delete(self, *keys: str) -> int:
        """Delete specific cache keys; return the number removed."""
        if not keys:
            return 0

        try:
            return await self.redis.delete(*keys)
        except RedisError, OSError, TimeoutError:
            logger.warning(
                "Redis cache deletion failed",
                exc_info=True,
            )
            return 0

    async def clear_namespace(self, namespace: str) -> int:
        """Delete keys in one application namespace without flushing Redis."""
        if not namespace or not namespace.endswith(":"):
            raise ValueError("Namespace must be non-empty and end with ':'")

        deleted = 0

        try:
            async for key in self.redis.scan_iter(match=f"{namespace}*"):
                deleted += await self.redis.delete(key)
        except RedisError, OSError, TimeoutError:
            logger.warning(
                "Redis cache namespace clearing failed for %s",
                namespace,
                exc_info=True,
            )

        return deleted
