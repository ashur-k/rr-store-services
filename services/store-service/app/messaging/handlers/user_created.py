from uuid import UUID

from pydantic import BaseModel, EmailStr

from app.schemas.store import StoreCreate
from app.services.store import StoreService
from database import SessionLocal


class UserCreatedEvent(BaseModel):
    event_id: UUID
    user_id: int
    kc_id: UUID
    email: EmailStr
    roles: list[str]
    store_name: str
    store_slug: str


class UserCreatedHandler:
    async def handle(self, event: UserCreatedEvent) -> None:
        async with SessionLocal() as db:
            store_service = StoreService(db)

            await store_service.create_store(
                store_data=StoreCreate(
                    name=event.store_name,
                    slug=event.store_slug,
                    owner_id=event.kc_id,
                ),
            )
