from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import (
    Category,
    Color,
    Product,
    ProductImage,
    ProductVariant,
    VariantImage,
)
from app.schemas.product import ProductCreate, ProductUpdate


class ProductRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    def _product_query(self):
        return select(Product).options(
            selectinload(Product.category),
            selectinload(Product.images),
            selectinload(Product.variants).selectinload(ProductVariant.images),
            selectinload(Product.variants).selectinload(ProductVariant.color),
        )

    async def create(self, product_data: ProductCreate) -> Product:
        product = Product(
            store_id=product_data.store_id,
            category_id=product_data.category_id,
            name=product_data.name,
            description=product_data.description,
            has_variants=product_data.has_variants,
            rate=product_data.rate,
            new_edition=product_data.new_edition,
            discount_30_percent=product_data.discount_30_percent,
            price=product_data.price,
            stock=product_data.stock,
        )

        for image_data in product_data.images:
            product.images.append(
                ProductImage(
                    image_url=image_data.image_url,
                    display_order=image_data.display_order,
                )
            )

        if product_data.has_variants:
            for variant_data in product_data.variants:
                variant = ProductVariant(
                    sku=variant_data.sku,
                    color_id=variant_data.color_id,
                    price=variant_data.price,
                    stock=variant_data.stock,
                    attributes=variant_data.attributes,
                )

                for image_data in variant_data.images:
                    variant.images.append(
                        VariantImage(
                            image_url=image_data.image_url,
                            display_order=image_data.display_order,
                        )
                    )

                product.variants.append(variant)

        self.db.add(product)
        await self.db.commit()

        return await self.get_by_id(product.id)

    async def update(
        self,
        product: Product,
        product_data: ProductUpdate,
    ) -> Product:
        product.name = product_data.name
        product.description = product_data.description
        product.category_id = product_data.category_id
        product.has_variants = product_data.has_variants
        product.rate = product_data.rate
        product.new_edition = product_data.new_edition
        product.discount_30_percent = product_data.discount_30_percent
        product.price = product_data.price
        product.stock = product_data.stock

        # Replace product images.
        product.images.clear()
        for image_data in product_data.images:
            product.images.append(
                ProductImage(
                    image_url=image_data.image_url,
                    display_order=image_data.display_order,
                )
            )

        # Replace variants and their images.
        product.variants.clear()
        await self.db.flush()

        if product_data.has_variants:
            for variant_data in product_data.variants:
                variant = ProductVariant(
                    sku=variant_data.sku,
                    color_id=variant_data.color_id,
                    price=variant_data.price,
                    stock=variant_data.stock,
                    attributes=variant_data.attributes,
                )

                for image_data in variant_data.images:
                    variant.images.append(
                        VariantImage(
                            image_url=image_data.image_url,
                            display_order=image_data.display_order,
                        )
                    )

                product.variants.append(variant)

        await self.db.commit()
        return await self.get_by_id(product.id)

    async def get_by_id(self, product_id: UUID) -> Product | None:
        query = self._product_query().where(Product.id == product_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_store(self, store_id: UUID) -> list[Product]:
        query = (
            self._product_query()
            .where(Product.store_id == store_id)
            .order_by(Product.created_at.desc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_all_categories(self) -> list[Category]:
        query = select(Category).order_by(Category.name)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_all_colors(self) -> list[Color]:
        query = select(Color).order_by(Color.name)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_all(self) -> list[Product]:
        query = self._product_query().order_by(Product.created_at.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_category_by_id(self, category_id: UUID) -> Category | None:
        return await self.db.get(Category, category_id)

    async def delete(self, product: Product) -> None:
        await self.db.delete(product)
        await self.db.commit()
