from uuid import uuid4

from django.test import TestCase

from core_apps.common.events import UserCreated
from core_apps.outbox.models import OutboxEvent

from ..handlers import UserCreatedOutboxHandler


class UserCreatedOutboxHandlerTests(TestCase):
    def test_creates_outbox_event(self):
        event = UserCreated.create(
            user_id=3,
            kc_id=uuid4(),
            email="storeowner-test@example.com",
            roles=["store_owner"],
            store_name="Test Store",
            store_slug="test-store",
        )

        handler = UserCreatedOutboxHandler()

        handler.handle(event)

        outbox_event = OutboxEvent.objects.get(id=event.event_id)

        self.assertEqual(outbox_event.event_type, "user.created")
        self.assertEqual(outbox_event.payload["user_id"], event.user_id)
        self.assertEqual(outbox_event.payload["kc_id"], str(event.kc_id))
        self.assertEqual(outbox_event.payload["email"], event.email)
        self.assertEqual(outbox_event.payload["roles"], ["store_owner"])
