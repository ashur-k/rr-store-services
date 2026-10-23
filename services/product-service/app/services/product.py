from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product
from app.repositories.product import ProductRepository
from app.schemas.product import ProductCreate


class ProductService:
    def __init__(self, db: AsyncSession) -> None:
        self.repository = ProductRepository(db)

    async def create_product(self, product_data: ProductCreate) -> Product:
        return await self.repository.create(product_data)

    async def get_product(self, product_id: UUID) -> Product | None:
        return await self.repository.get_by_id(product_id)

    async def get_all_products(self) -> list[Product]:
        return await self.repository.get_all()
