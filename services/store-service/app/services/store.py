from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.store import Store
from app.repositories.store import StoreRepository
from app.schemas.store import StoreCreate


class StoreNameAlreadyExistsError(Exception):
    """Raised when a store name is already in use."""


class StoreService:
    def __init__(self, db: AsyncSession):
        self.repository = StoreRepository(db)

    async def get_all_stores(self):
        return await self.repository.get_all_stores()

    async def get_my_stores(self, owner_id: UUID) -> list[Store]:
        return await self.repository.get_by_owner(
            owner_id=owner_id,
        )

    async def get_store_by_id(
        store_id: UUID,
        owner_id: UUID,
        db: AsyncSession,
    ):
        repository = StoreRepository(db)

        store = await repository.get_by_id(store_id)

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

    async def create_store(self, store_data: StoreCreate) -> Store:
        try:
            return await self.repository.create(store_data=store_data)
        except IntegrityError as exc:
            constraint_name = getattr(
                getattr(exc.orig, "__cause__", None),
                "constraint_name",
                None,
            )

            if constraint_name == "stores_name_key":
                raise StoreNameAlreadyExistsError(
                    f"Store name '{store_data.name}' already exists."
                ) from exc

            raise

    async def owner_has_stores(self, owner_id: UUID) -> bool:
        return await self.repository.owner_has_stores(owner_id)

    async def store_belongs_to_owner(
        self,
        store_id: UUID,
        owner_id: UUID,
    ) -> bool:
        return await self.repository.store_belongs_to_owner(
            store_id=store_id,
            owner_id=owner_id,
        )

    async def delete_store(self, store_id: UUID) -> bool:
        return await self.repository.delete(store_id)
