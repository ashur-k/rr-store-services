from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.store import StoreRepository


async def get_owned_store(
    slug: str,
    owner_id: UUID,
    db: AsyncSession,
):
    repository = StoreRepository(db)

    store = await repository.get_by_slug(slug)

    if store is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found",
        )

    if store.owner_id != owner_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this store",
        )

    return store