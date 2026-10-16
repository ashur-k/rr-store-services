from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.authentication import authenticate
from app.core.store_access import get_owned_store
from app.schemas.store_product import (
    StoreProductCreate,
    StoreProductResponse,
)
from app.services.store_product import StoreProductService
from database import get_db

router = APIRouter()


@router.post("/{slug}/products", response_model=StoreProductResponse)
async def create_store_product(
    slug: str,
    store_product_data: StoreProductCreate,
    current_user: dict = Depends(authenticate),
    db: AsyncSession = Depends(get_db),
):
    owner_id = UUID(current_user["sub"])

    store = await get_owned_store(
        slug=slug,
        owner_id=owner_id,
        db=db,
    )

    service = StoreProductService(db)

    return await service.create_store_product(
        store_product_data=store_product_data,
        store_id=store.id,
    )


@router.get("/{slug}/products", response_model=list[StoreProductResponse])
async def get_store_products(
    slug: str,
    current_user: dict = Depends(authenticate),
    db: AsyncSession = Depends(get_db),
):
    owner_id = UUID(current_user["sub"])

    store = await get_owned_store(
        slug=slug,
        owner_id=owner_id,
        db=db,
    )

    service = StoreProductService(db)

    return await service.get_store_products(
        store_id=store.id,
    )


@router.get(
    "/{slug}/products/{store_product_id}",
    response_model=StoreProductResponse,
)
async def get_store_product(
    slug: str,
    store_product_id: UUID,
    current_user: dict = Depends(authenticate),
    db: AsyncSession = Depends(get_db),
):
    owner_id = UUID(current_user["sub"])

    store = await get_owned_store(
        slug=slug,
        owner_id=owner_id,
        db=db,
    )

    service = StoreProductService(db)

    store_product = await service.get_store_product(
        store_product_id=store_product_id,
        store_id=store.id,
    )

    return store_product
