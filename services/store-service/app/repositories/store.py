from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.store import Store
from app.schemas.store import StoreCreate


class StoreRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_stores(self):
        result = await self.db.execute(select(Store))
        return result.scalars().all()

    async def get_by_owner(self, owner_id: UUID) -> list[Store]:
        result = await self.db.execute(select(Store).where(Store.owner_id == owner_id))

        return list(result.scalars().all())

    async def get_by_slug(
        self,
        slug: str,
    ) -> Store | None:
        result = await self.db.execute(select(Store).where(Store.slug == slug))

        return result.scalar_one_or_none()

    async def create(self, store_data: StoreCreate) -> Store:
        store = Store(
            owner_id=store_data.owner_id,
            name=store_data.name,
            slug=store_data.slug,
            description=store_data.description,
        )

        self.db.add(store)
        try:
            await self.db.commit()
            await self.db.refresh(store)
        except IntegrityError as exc:
            print(f"Original database error: {exc.orig!r}", flush=True)
            await self.db.rollback()
            raise

        return store

    async def get_by_id(
        self,
        store_id: UUID,
    ) -> Store | None:
        result = await self.db.execute(select(Store).where(Store.id == store_id))

        return result.scalar_one_or_none()

    async def owner_has_stores(self, owner_id: UUID) -> bool:
        result = await self.db.execute(
            select(Store.id).where(Store.owner_id == owner_id).limit(1)
        )

        return result.scalar_one_or_none() is not None

    async def delete(self, store_id: UUID) -> bool:
        statement = delete(Store).where(Store.id == store_id).returning(Store.id)

        result = await self.db.execute(statement)
        deleted_id = result.scalar_one_or_none()

        if deleted_id is None:
            return False

        await self.db.commit()
        return True
