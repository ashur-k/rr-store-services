import pika

from app.core.config import settings


class RabbitMQConnection:
    def __init__(self) -> None:
        credentials = pika.PlainCredentials(
            username=settings.rabbitmq_username,
            password=settings.rabbitmq_password,
        )

        parameters = pika.ConnectionParameters(
            host=settings.rabbitmq_host,
            port=settings.rabbitmq_port,
            virtual_host=settings.rabbitmq_vhost,
            credentials=credentials,
            heartbeat=60,
            blocked_connection_timeout=30,
            connection_attempts=3,
            retry_delay=2,
        )

        self.connection = pika.BlockingConnection(parameters)
        self.channel = self.connection.channel()

        self.channel.exchange_declare(
            exchange=settings.rabbitmq_exchange,
            exchange_type="topic",
            durable=True,
        )

        self.channel.exchange_declare(
            exchange="rr-store.dead-letter",
            exchange_type="direct",
            durable=True,
        )

        self.channel.queue_declare(
            queue="store-service.dead-letter",
            durable=True,
        )

        self.channel.queue_bind(
            exchange="rr-store.dead-letter",
            queue="store-service.dead-letter",
            routing_key="user.created",
        )

        self.channel.confirm_delivery()
