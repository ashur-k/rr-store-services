from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.authentication import (
    authenticate,
    require_admin,
    require_store_ownership_check,
)
from app.schemas.store import StoreCreate, StoreResponse
from app.services.store import StoreService
from database import get_db

router = APIRouter()


@router.get(
    "/all/",
    response_model=list[StoreResponse],
    status_code=status.HTTP_200_OK,
)
async def get_stores(
    current_user: dict = Depends(require_store_ownership_check),
    db: AsyncSession = Depends(get_db),
):
    service = StoreService(db)

    return await service.get_all_stores()


@router.post(
    "/",
    response_model=StoreResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_store(
    store_data: StoreCreate,
    current_user: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = StoreService(db)

    return await service.create_store(store_data=store_data)


@router.get("/", response_model=list[StoreResponse])
async def get_my_stores(
    current_user: dict = Depends(authenticate), db: AsyncSession = Depends(get_db)
):
    service = StoreService(db)

    owner_id = UUID(current_user["sub"])

    return await service.get_my_stores(
        owner_id=owner_id,
    )


@router.get("/owners/{owner_id}/exists")
async def owner_has_stores(
    owner_id: UUID,
    current_user: dict = Depends(require_store_ownership_check),
    db: AsyncSession = Depends(get_db),
):
    service = StoreService(db)

    return {"has_stores": await service.owner_has_stores(owner_id)}


@router.delete("/{store_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_store(
    store_id: UUID,
    current_user: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    service = StoreService(db)

    deleted = await service.delete_store(store_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found",
        )
