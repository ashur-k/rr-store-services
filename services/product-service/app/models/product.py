from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.product_image import ProductImage
    from app.models.product_variant import ProductVariant


class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    store_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, index=True
    )

    category_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    category: Mapped[Category | None] = relationship(
        back_populates="products",
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)

    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    has_variants: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    rate: Mapped[int] = mapped_column(
        Integer, nullable=False, default=1, server_default="1"
    )

    new_edition: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )

    discount_30_percent: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )

    price: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)

    stock: Mapped[int | None] = mapped_column(Integer, nullable=True)

    images: Mapped[list[ProductImage]] = relationship(
        back_populates="product", cascade="all, delete-orphan", passive_deletes=True
    )

    variants: Mapped[list[ProductVariant]] = relationship(
        back_populates="product", cascade="all, delete-orphan", passive_deletes=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
