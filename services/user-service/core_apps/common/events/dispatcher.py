from typing import Protocol

from .user_created import UserCreated


class EventHandler(Protocol):
    def handle(self, event: UserCreated) -> None: ...


class EventDispatcher:
    """Dispatch application events to registered handlers."""

    def __init__(
        self,
        handlers: list[tuple[type, EventHandler]] | None = None,
    ) -> None:
        self._handlers: dict[type, list[EventHandler]] = {}

        for event_type, handler in handlers or []:
            self.register(event_type, handler)

    def register(
        self,
        event_type: type,
        handler: EventHandler,
    ) -> None:
        self._handlers.setdefault(event_type, []).append(handler)

    def dispatch(self, event: object) -> None:
        for handler in self._handlers.get(type(event), []):
            handler.handle(event)
