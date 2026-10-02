from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.store import Store
from app.schemas.store import StoreCreate


class StoreRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        store_data: StoreCreate,
        owner_id: UUID,
    ) -> Store:
        store = Store(
            owner_id=owner_id,
            name=store_data.name,
            description=store_data.description,
        )

        self.db.add(store)
        await self.db.commit()
        await self.db.refresh(store)

        return store