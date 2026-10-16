from unittest.mock import Mock
from uuid import uuid4

from django.test import TestCase

from ..models import OutboxEvent
from ..services.publisher import OutboxPublisher
from ..services.rabbitmq_publisher import RabbitMQEventPublisher


class OutboxPublisherTests(TestCase):
    def test_publishes_pending_event_and_marks_it_published(self):
        event = OutboxEvent.objects.create(
            id=uuid4(),
            event_type="UserCreated",
            payload={
                "user_id": 3,
                "email": "test@example.com",
            },
        )

        event_publisher = Mock()
        publisher = OutboxPublisher(event_publisher)

        publisher.publish_pending()

        event_publisher.publish.assert_called_once_with(
            event_type="UserCreated",
            payload={
                "user_id": 3,
                "email": "test@example.com",
            },
        )

        event.refresh_from_db()

        self.assertIsNotNone(event.published_at)

    def test_does_not_mark_event_published_when_publish_fails(self):
        event = OutboxEvent.objects.create(
            id=uuid4(),
            event_type="UserCreated",
            payload={
                "user_id": 3,
                "email": "test@example.com",
            },
        )

        event_publisher = Mock()
        event_publisher.publish.side_effect = Exception("Broker unavailable")

        publisher = OutboxPublisher(event_publisher)

        with self.assertRaises(Exception):
            publisher.publish_pending()

        event.refresh_from_db()

        self.assertIsNone(event.published_at)

    def test_rabbitmq_publisher_publishes_event(self):
        rabbitmq = Mock()
        publisher = RabbitMQEventPublisher(rabbitmq)

        publisher.publish(
            event_type="user.created",
            payload={"user_id": 3},
        )

        rabbitmq.channel.basic_publish.assert_called_once()
