from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.store_product import StoreProduct
from app.schemas.store_product import StoreProductCreate


class StoreProductRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id_and_store(
        self,
        store_product_id: UUID,
        store_id: UUID,
    ) -> StoreProduct | None:
        result = await self.db.execute(
            select(StoreProduct).where(
                StoreProduct.id == store_product_id,
                StoreProduct.store_id == store_id,
            )
        )
        return result.scalar_one_or_none()

    async def create(
        self,
        store_product_data: StoreProductCreate,
        store_id: UUID,
    ) -> StoreProduct:
        store_product = StoreProduct(
            store_id=store_id,
            product_id=store_product_data.product_id,
            price=store_product_data.price,
            stock=store_product_data.stock,
        )

        self.db.add(store_product)
        await self.db.commit()
        await self.db.refresh(store_product)

        return store_product

    async def get_by_id(
        self,
        store_product_id: UUID,
    ) -> StoreProduct | None:
        result = await self.db.execute(
            select(StoreProduct).where(StoreProduct.id == store_product_id)
        )

        return result.scalar_one_or_none()

    async def get_by_store(
        self,
        store_id: UUID,
    ) -> list[StoreProduct]:
        result = await self.db.execute(
            select(StoreProduct).where(StoreProduct.store_id == store_id)
        )

        return list(result.scalars().all())
