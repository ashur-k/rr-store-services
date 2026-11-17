import logging
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")

logger = logging.getLogger(__name__)

django_application = get_asgi_application()


async def application(scope, receive, send):
    if scope["type"] != "lifespan":
        await django_application(scope, receive, send)
        return

    from config.startup import (
        close_application_resources,
        container,
        initialize_application,
    )

    while True:
        message = await receive()

        if message["type"] == "lifespan.startup":
            try:
                await initialize_application()
                logger.info("Application dependencies initialized successfully")

            except Exception:
                logger.exception("Failed to initialize application dependencies")

                await send(
                    {
                        "type": "lifespan.startup.failed",
                        "message": "Application initialization failed",
                    }
                )
                return

            try:
                redis_client = await container.redis_client()
                await redis_client.ping()
                logger.info("Redis connection successful")
            except Exception:
                logger.warning(
                    "Redis is unavailable; continuing without cache",
                    exc_info=True,
                )

            await send({"type": "lifespan.startup.complete"})

        elif message["type"] == "lifespan.shutdown":
            try:
                await close_application_resources()
                logger.info("Application resources closed successfully")

            except Exception:
                logger.exception("Application resource cleanup failed")

            await send({"type": "lifespan.shutdown.complete"})
            return
