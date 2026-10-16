from fastapi import APIRouter, Depends

from app.core.authentication import require_store_owner
from app.routers.health import router as health_router
from app.routers.store import router as stores_router
from app.routers.store_product import router as store_products_router

api_router = APIRouter()

api_router.include_router(health_router)

# Store routes have their own authentication dependencies.
api_router.include_router(stores_router)

# Product routes retain their existing router-wide protection.
api_router.include_router(
    store_products_router,
    dependencies=[Depends(require_store_owner)],
)
