from django.test import SimpleTestCase

from core_apps.common.events import EventDispatcher, UserCreated


class TestHandler:
    def __init__(self) -> None:
        self.received = None

    def handle(self, event: UserCreated) -> None:
        self.received = event


class EventDispatcherTests(SimpleTestCase):
    def test_dispatches_event_to_registered_handler(self):
        dispatcher = EventDispatcher()
        handler = TestHandler()

        event = UserCreated.create(
            user_id=3,
            kc_id="896bc424-c3f6-4e6c-bdb7-c3364d4bf443",
            email="storeowner-test@example.com",
            roles=["store_owner"],
            store_name="Test Store",
            store_slug="test-store",
        )

        dispatcher.register(UserCreated, handler)
        dispatcher.dispatch(event)

        self.assertEqual(handler.received, event)
