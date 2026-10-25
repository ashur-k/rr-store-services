from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.authentication import require_store_ownership
from app.core.database import get_db
from app.schemas.product import (
    CategoryResponse,
    ColorResponse,
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)
from app.services.product import ProductService

security = HTTPBearer()
router = APIRouter(tags=["Products"])


@router.get("/", response_model=list[ProductResponse])
async def get_all_products(
    db: AsyncSession = Depends(get_db),
) -> list[ProductResponse]:
    service = ProductService(db)
    return await service.get_all_products()


@router.get("/categories/", response_model=list[CategoryResponse])
async def get_all_categories(
    db: AsyncSession = Depends(get_db),
) -> list[CategoryResponse]:
    service = ProductService(db)
    return await service.get_all_categories()


@router.post(
    "/store/{store_id}",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_product(
    store_id: UUID,
    product_data: ProductCreate,
    current_user: dict = Depends(require_store_ownership),
    db: AsyncSession = Depends(get_db),
) -> ProductResponse:
    service = ProductService(db)

    try:
        return await service.create_product(
            product_data=product_data,
            store_id=store_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.put(
    "/store/{store_id}/{product_id}",
    response_model=ProductResponse,
)
async def update_product(
    store_id: UUID,
    product_id: UUID,
    product_data: ProductUpdate,
    current_user: dict = Depends(require_store_ownership),
    db: AsyncSession = Depends(get_db),
) -> ProductResponse:
    service = ProductService(db)

    product = await service.get_product(product_id)

    if product is None or product.store_id != store_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    try:
        updated_product = await service.update_product(
            product_id=product_id,
            product_data=product_data,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    if updated_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return updated_product


@router.delete(
    "/store/{store_id}/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
async def delete_product(
    store_id: UUID,
    product_id: UUID,
    current_user: dict = Depends(require_store_ownership),
    db: AsyncSession = Depends(get_db),
) -> Response:
    service = ProductService(db)

    product = await service.get_product(product_id)

    if product is None or product.store_id != store_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    await service.delete_product(product_id)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/store/{store_id}", response_model=list[ProductResponse])
async def get_products_by_store_id(
    store_id: UUID,
    current_user: dict = Depends(require_store_ownership),
    db: AsyncSession = Depends(get_db),
) -> list[ProductResponse]:

    service = ProductService(db)
    return await service.get_products_by_store(store_id)


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> ProductResponse:
    service = ProductService(db)
    product = await service.get_product(product_id)

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product


@router.get("/colors/", response_model=list[ColorResponse])
async def get_all_colors(
    db: AsyncSession = Depends(get_db),
) -> list[ColorResponse]:
    service = ProductService(db)
    return await service.get_all_colors()
