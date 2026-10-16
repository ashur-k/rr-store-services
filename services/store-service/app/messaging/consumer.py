import asyncio
import json

import pika

from app.container import Container
from app.core.config import settings
from app.messaging.handlers.user_created import (
    UserCreatedEvent,
    UserCreatedHandler,
)
from app.services.store import StoreNameAlreadyExistsError


def consume() -> None:
    container = Container()
    rabbitmq = container.rabbitmq_connection()

    channel = rabbitmq.channel

    queue_name = "store-service.events"

    channel.queue_declare(
        queue=queue_name,
        durable=True,
    )

    channel.queue_bind(
        exchange=settings.rabbitmq_exchange,
        queue=queue_name,
        routing_key="user.created",
    )

    channel.basic_qos(prefetch_count=1)

    event_loop = asyncio.new_event_loop()
    user_created_handler = UserCreatedHandler()

    def handle_message(ch, method, properties, body):
        try:
            event = UserCreatedEvent.model_validate(json.loads(body))

            if method.routing_key == "user.created":
                event_loop.run_until_complete(user_created_handler.handle(event))

        except StoreNameAlreadyExistsError as exc:
            print(
                f"Permanent failure: {exc}. Sending message to dead-letter queue.",
                flush=True,
            )

            ch.basic_publish(
                exchange="rr-store.dead-letter",
                routing_key=method.routing_key,
                body=body,
                properties=pika.BasicProperties(
                    delivery_mode=2,
                    content_type="application/json",
                    headers={"x-error-reason": str(exc)},
                ),
                mandatory=True,
            )

            ch.basic_ack(delivery_tag=method.delivery_tag)

            print("Message sent to dead-letter queue.", flush=True)

        except Exception:
            print(
                f"Message processing failed: {method.routing_key}",
                flush=True,
            )
            raise

        else:
            ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(
        queue=queue_name,
        on_message_callback=handle_message,
    )

    print("Store Service consumer started", flush=True)

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print("Store Service consumer stopped", flush=True)
    finally:
        rabbitmq.connection.close()


if __name__ == "__main__":
    consume()
