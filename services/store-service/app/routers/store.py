from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.authentication import authenticate
from app.schemas.store import StoreCreate, StoreResponse
from app.services.store import StoreService
from database import get_db

router = APIRouter()


@router.post("/", response_model=StoreResponse)
async def create_store(
    store_data: StoreCreate,
    current_user: dict = Depends(authenticate),
    db: AsyncSession = Depends(get_db),
):
    owner_id = UUID(current_user["sub"])

    service = StoreService(db)

    return await service.create_store(
        store_data=store_data,
        owner_id=owner_id,
    )