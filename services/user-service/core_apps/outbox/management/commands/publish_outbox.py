import time

from django.core.management.base import BaseCommand

from config.container import Container
from core_apps.outbox.services.publisher import OutboxPublisher


class Command(BaseCommand):
    help = "Publish pending outbox events"

    def handle(self, *args, **options):
        container = Container()
        publisher: OutboxPublisher = container.outbox_publisher()

        self.stdout.write("Outbox worker started")

        try:
            while True:
                publisher.publish_pending()
                time.sleep(5)
        except KeyboardInterrupt:
            self.stdout.write("Outbox worker stopped")
        finally:
            connection = publisher.event_publisher.rabbitmq.connection

            if connection and connection.is_open:
                connection.close()
