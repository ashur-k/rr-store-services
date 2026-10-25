from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.models.color import Color
from app.models.product import Product
from app.repositories.product import ProductRepository
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    def __init__(self, db: AsyncSession) -> None:
        self.repository = ProductRepository(db)

    async def create_product(
        self,
        product_data: ProductCreate,
        store_id: UUID,
    ) -> Product:
        if product_data.category_id is not None:
            category = await self.repository.get_category_by_id(
                product_data.category_id
            )
            if category is None:
                raise ValueError("Category not found")

        return await self.repository.create(product_data)

    async def update_product(
        self,
        product_id: UUID,
        product_data: ProductUpdate,
    ) -> Product | None:
        product = await self.repository.get_by_id(product_id)

        if product is None:
            return None

        if product_data.category_id is not None:
            category = await self.repository.get_category_by_id(
                product_data.category_id
            )
            if category is None:
                raise ValueError("Category not found")

        return await self.repository.update(product, product_data)

    async def get_product(self, product_id: UUID) -> Product | None:
        return await self.repository.get_by_id(product_id)

    async def get_all_products(self) -> list[Product]:
        return await self.repository.get_all()

    async def get_products_by_store(self, store_id: UUID) -> list[Product]:
        return await self.repository.get_by_store(store_id)

    async def get_all_categories(self) -> list[Category]:
        return await self.repository.get_all_categories()

    async def get_all_colors(self) -> list[Color]:
        return await self.repository.get_all_colors()

    async def delete_product(
        self,
        product_id: UUID,
    ) -> bool:
        product = await self.repository.get_by_id(product_id)

        if product is None:
            return False

        await self.repository.delete(product)
        return True
