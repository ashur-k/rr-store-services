import functools
from collections.abc import Callable
from typing import Any

from core_apps.common.cache import CacheService


def cached(
    *,
    key: str,
    ttl_seconds: int = 30,
) -> Callable:
    """Cache the JSON-serializable result of an async service method."""

    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def wrapper(self: Any, *args: Any, **kwargs: Any) -> Any:
            cache_service: CacheService = self.cache_service

            value = await cache_service.get_json(key)
            if value is not None:
                return value

            result = await func(self, *args, **kwargs)

            await cache_service.set_json(
                key,
                result,
                ttl_seconds=ttl_seconds,
            )
            return result

        return wrapper

    return decorator
