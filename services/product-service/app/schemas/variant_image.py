from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class VariantImageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    image_url: str
    display_order: int
    created_at: datetime
