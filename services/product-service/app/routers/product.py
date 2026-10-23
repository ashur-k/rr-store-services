from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.clients.store_client import get_store_id_by_slug, user_owns_store
from app.core.authentication import require_store_owner
from app.core.database import get_db
from app.schemas.product import CategoryResponse, ProductCreate, ProductResponse
from app.services.product import ProductService

security = HTTPBearer()
router = APIRouter(prefix="/products", tags=["Products"])


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    current_user: dict = Depends(require_store_owner),
    db: AsyncSession = Depends(get_db),
) -> ProductResponse:
    owns_store = await user_owns_store(
        store_id=str(product_data.store_id),
        access_token=credentials.credentials,
    )

    if not owns_store:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this store",
        )

    service = ProductService(db)

    try:
        return await service.create_product(product_data)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


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


# @router.get("/store/{store_id}", response_model=list[ProductResponse])
# async def get_store_products_id(
#     store_id: UUID,
#     credentials: HTTPAuthorizationCredentials = Depends(security),
#     current_user: dict = Depends(require_store_owner),
#     db: AsyncSession = Depends(get_db),
# ) -> list[ProductResponse]:
#     owns_store = await user_owns_store(
#         store_id=str(store_id),
#         access_token=credentials.credentials,
#     )

#     if not owns_store:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="You do not own this store",
#         )

#     service = ProductService(db)
#     return await service.get_products_by_store(store_id)


@router.get("/store/{store_slug}", response_model=list[ProductResponse])
async def get_store_products_by_slug(
    store_slug: str,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    current_user: dict = Depends(require_store_owner),
    db: AsyncSession = Depends(get_db),
) -> list[ProductResponse]:
    store_id = await get_store_id_by_slug(
        store_slug=store_slug,
        access_token=credentials.credentials,
    )

    owns_store = await user_owns_store(
        store_id=store_id,
        access_token=credentials.credentials,
    )

    if not owns_store:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this store",
        )

    service = ProductService(db)
    return await service.get_products_by_store(UUID(store_id))


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
