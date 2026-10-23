from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.clients.store_client import user_owns_store
from app.core.authentication import require_store_owner
from app.core.database import get_db
from app.schemas.product import ProductCreate, ProductResponse
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
    return await service.create_product(product_data)


@router.get("/", response_model=list[ProductResponse])
async def get_all_products(
    db: AsyncSession = Depends(get_db),
) -> list[ProductResponse]:
    service = ProductService(db)
    return await service.get_all_products()


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
