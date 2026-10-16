from typing import Protocol

from django.utils import timezone

from core_apps.outbox.models import OutboxEvent


class EventPublisher(Protocol):
    """Interface for publishing events to a message broker."""

    def publish(
        self,
        *,
        event_type: str,
        payload: dict,
    ) -> None: ...


class OutboxPublisher:
    """Publish pending outbox events."""

    def __init__(self, event_publisher: EventPublisher) -> None:
        self.event_publisher = event_publisher

    def publish_pending(self) -> None:
        events = OutboxEvent.objects.filter(
            published_at__isnull=True,
        )

        for event in events:
            self.event_publisher.publish(
                event_type=event.event_type,
                payload=event.payload,
            )

            event.published_at = timezone.now()
            event.save(update_fields=["published_at"])
