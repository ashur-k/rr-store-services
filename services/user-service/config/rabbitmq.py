import pika
from django.conf import settings


class RabbitMQConnection:
    """Manage the application's RabbitMQ connection."""

    def __init__(self) -> None:
        config = settings.RABBITMQ

        credentials = pika.PlainCredentials(
            username=config["USERNAME"],
            password=config["PASSWORD"],
        )

        parameters = pika.ConnectionParameters(
            host=config["HOST"],
            port=config["PORT"],
            virtual_host=config["VHOST"],
            credentials=credentials,
            heartbeat=60,
            blocked_connection_timeout=30,
            connection_attempts=3,
            retry_delay=2,
        )

        self.connection = pika.BlockingConnection(parameters)
        self.channel = self.connection.channel()

        self.channel.exchange_declare(
            exchange=config["EXCHANGE"],
            exchange_type="topic",
            durable=True,
        )

        self.channel.confirm_delivery()
