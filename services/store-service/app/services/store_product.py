from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.store_product import StoreProduct
from app.repositories.store_product import StoreProductRepository
from app.schemas.store_product import StoreProductCreate


class StoreProductService:
    def __init__(self, db: AsyncSession):
        self.repository = StoreProductRepository(db)

    async def create_store_product(
        self,
        store_product_data: StoreProductCreate,
        store_id: UUID,
    ) -> StoreProduct:
        return await self.repository.create(
            store_product_data=store_product_data,
            store_id=store_id,
        )

    async def get_store_product(
        self, store_product_id: UUID, store_id: UUID
    ) -> StoreProduct | None:
        return await self.repository.get_by_id_and_store(
            store_product_id=store_product_id,
            store_id=store_id,
        )

    async def get_store_products(
        self,
        store_id: UUID,
    ) -> list[StoreProduct]:
        return await self.repository.get_by_store(
            store_id=store_id,
        )
