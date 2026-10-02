from uuid import UUID

from app.models.store import Store
from app.repositories.store import StoreRepository
from app.schemas.store import StoreCreate
from sqlalchemy.ext.asyncio import AsyncSession


class StoreService:
    def __init__(self, db: AsyncSession):
        self.repository = StoreRepository(db)

    async def create_store(
        self,
        store_data: StoreCreate,
        owner_id: UUID,
    ) -> Store:
        return await self.repository.create(
            store_data=store_data,
            owner_id=owner_id,
        )