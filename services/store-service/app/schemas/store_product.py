from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class StoreProductCreate(BaseModel):
    product_id: UUID
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    stock: int = Field(default=0, ge=0)


class StoreProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    store_id: UUID
    product_id: UUID
    price: Decimal
    stock: int
    status: str
    created_at: datetime
    updated_at: datetime