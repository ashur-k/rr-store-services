from uuid import UUID, uuid4

from pydantic import BaseModel, EmailStr


class UserCreated(BaseModel):
    """Event published when a user is created."""

    event_id: UUID
    user_id: int
    kc_id: UUID
    email: EmailStr
    roles: list[str]
    store_name: str
    store_slug: str

    @classmethod
    def create(
        cls,
        *,
        user_id: int,
        kc_id: UUID,
        email: str,
        roles: list[str],
        store_name: str,
        store_slug: str,
    ) -> "UserCreated":
        return cls(
            event_id=uuid4(),
            user_id=user_id,
            kc_id=kc_id,
            email=email,
            roles=roles,
            store_name=store_name,
            store_slug=store_slug,
        )
