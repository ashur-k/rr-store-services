import json

import pika
from django.conf import settings

from config.rabbitmq import RabbitMQConnection


class RabbitMQEventPublisher:
    """Publish application events to RabbitMQ."""

    def __init__(self, rabbitmq: RabbitMQConnection) -> None:
        self.rabbitmq = rabbitmq

    def publish(
        self,
        *,
        event_type: str,
        payload: dict,
    ) -> None:
        self.rabbitmq.channel.basic_publish(
            exchange=settings.RABBITMQ["EXCHANGE"],
            routing_key=event_type,
            body=json.dumps(payload),
            properties=pika.BasicProperties(
                delivery_mode=pika.DeliveryMode.Persistent,
            ),
        )
