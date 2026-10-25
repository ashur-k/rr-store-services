from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.schemas.product_image import ProductImageResponse
from app.schemas.variant_image import VariantImageResponse


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str


class ColorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    hex_code: str


class ProductImageCreate(BaseModel):
    image_url: str = Field(min_length=1, max_length=2048)
    display_order: int = Field(default=0, ge=0)


class VariantImageCreate(BaseModel):
    image_url: str = Field(min_length=1, max_length=2048)
    display_order: int = Field(default=0, ge=0)


class ProductVariantCreate(BaseModel):
    sku: str = Field(min_length=1, max_length=100)
    price: Decimal = Field(ge=0, max_digits=10, decimal_places=2)
    stock: int = Field(default=0, ge=0)
    color_id: UUID
    attributes: dict[str, object] = Field(default_factory=dict)
    images: list[VariantImageCreate] = Field(default_factory=list)


class ProductCreate(BaseModel):
    store_id: UUID
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    has_variants: bool = False
    price: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    stock: int | None = Field(default=None, ge=0)
    images: list[ProductImageCreate] = Field(default_factory=list)
    variants: list[ProductVariantCreate] = Field(default_factory=list)
    category_id: UUID | None = None
    rate: int = 1
    new_edition: bool = False
    discount_30_percent: bool = False

    @model_validator(mode="after")
    def validate_product_type(self):
        if self.has_variants:
            if not self.variants:
                raise ValueError(
                    "A product with variants must have at least one variant."
                )
            if self.price is not None or self.stock is not None:
                raise ValueError(
                    "Products with variants must define price and stock "
                    "on each variant, not on the product."
                )
        else:
            if self.price is None or self.stock is None:
                raise ValueError("A simple product must have both price and stock.")
            if self.variants:
                raise ValueError("A simple product cannot contain variants.")

        return self


class ProductVariantResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    sku: str
    price: Decimal
    stock: int
    attributes: dict[str, object]
    color: ColorResponse | None = None
    created_at: datetime
    updated_at: datetime
    images: list[VariantImageResponse] = Field(default_factory=list)


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    store_id: UUID
    category_id: UUID | None
    category: CategoryResponse | None = None
    name: str
    description: str | None
    has_variants: bool
    rate: int
    new_edition: bool
    discount_30_percent: bool
    price: Decimal | None
    stock: int | None
    created_at: datetime
    updated_at: datetime
    images: list[ProductImageResponse] = Field(default_factory=list)
    variants: list[ProductVariantResponse] = Field(default_factory=list)


class ProductUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    has_variants: bool = False
    price: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    stock: int | None = Field(default=None, ge=0)
    images: list[ProductImageCreate] = Field(default_factory=list)
    variants: list[ProductVariantCreate] = Field(default_factory=list)
    category_id: UUID | None = None
    rate: int = 1
    new_edition: bool = False
    discount_30_percent: bool = False

    @model_validator(mode="after")
    def validate_product_type(self):
        if self.has_variants:
            if not self.variants:
                raise ValueError(
                    "A product with variants must have at least one variant."
                )
            if self.price is not None or self.stock is not None:
                raise ValueError(
                    "Products with variants must define price and stock "
                    "on each variant, not on the product."
                )
        else:
            if self.price is None or self.stock is None:
                raise ValueError("A simple product must have both price and stock.")
            if self.variants:
                raise ValueError("A simple product cannot contain variants.")

        return self
