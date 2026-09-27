from core_apps.users.models import User


class UserRepository:
    """Persistence operations for users."""

    @staticmethod
    def create(*, kc_id, email: str) -> User:
        return User.objects.create(
            kc_id=kc_id,
            username=email,
            email=email,
        )

    @staticmethod
    def update_email(user: User, email: str) -> User:
        user.email = email
        user.username = email

        user.save(update_fields=("email", "username"),)

        return user

    @staticmethod
    def delete(user: User) -> None:
        user.delete()