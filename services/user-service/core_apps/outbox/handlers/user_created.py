from core_apps.common.events import UserCreated

from ..models import OutboxEvent


class UserCreatedOutboxHandler:
    """Store UserCreated events in the transactional outbox."""

    def handle(self, event: UserCreated) -> None:
        OutboxEvent.objects.create(
            id=event.event_id,
            event_type="user.created",
            payload=event.model_dump(mode="json"),
        )
