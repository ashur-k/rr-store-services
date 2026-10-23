from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.models.product import Product
from app.repositories.product import ProductRepository
from app.schemas.product import ProductCreate


class ProductService:
    def __init__(self, db: AsyncSession) -> None:
        self.repository = ProductRepository(db)

    async def create_product(self, product_data: ProductCreate) -> Product:
        if product_data.category_id is not None:
            category = await self.repository.get_category_by_id(
                product_data.category_id
            )
            if category is None:
                raise ValueError("Category not found")

        return await self.repository.create(product_data)

    async def get_product(self, product_id: UUID) -> Product | None:
        return await self.repository.get_by_id(product_id)

    async def get_all_products(self) -> list[Product]:
        return await self.repository.get_all()

    async def get_products_by_store(self, store_id: UUID) -> list[Product]:
        return await self.repository.get_by_store(store_id)

    async def get_all_categories(self) -> list[Category]:
        return await self.repository.get_all_categories()
