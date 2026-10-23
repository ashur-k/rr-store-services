from uuid import UUID

from core_apps.common.exceptions import UserNotFoundError

from ..models import User


class UserSelector:
    """Read-only queries for users."""

    @staticmethod
    def exists_by_email(email: str) -> bool:
        return User.objects.filter(email=email).exists()

    @staticmethod
    def get_by_id(user_id: int) -> User:
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist as exc:
            raise UserNotFoundError(f"User with id '{user_id}' does not exist.") from exc

    def get_by_kc_ids(self, kc_ids: list[str]) -> dict[str, User]:
        """Return local users indexed by their Keycloak IDs."""

        users = User.objects.filter(kc_id__in=kc_ids)

        return {str(user.kc_id): user for user in users}

    @staticmethod
    async def aget_by_kc_ids(kc_ids: list[str]) -> dict[str, User]:
        """Return local users indexed by their Keycloak IDs asynchronously."""
        if not kc_ids:
            return {}

        users_by_kc_id = {}

        async for user in User.objects.filter(kc_id__in=kc_ids).aiterator():
            users_by_kc_id[str(user.kc_id)] = user

        return users_by_kc_id

    @staticmethod
    def get_by_kc_id(kc_id: UUID) -> User:
        try:
            return User.objects.get(kc_id=kc_id)
        except User.DoesNotExist as exc:
            raise UserNotFoundError(f"User with Keycloak id '{kc_id}' does not exist.") from exc

    @staticmethod
    def get_all() -> list[User]:
        return list(User.objects.all())
