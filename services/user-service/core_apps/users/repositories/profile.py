from core_apps.profiles.models import Profile
from core_apps.users.models import User


class ProfileRepository:
    """Persistence operations for profiles."""

    @staticmethod
    def create(*, user: User) -> Profile:
        return Profile.objects.create(user=user)

    @staticmethod
    def delete(profile: Profile) -> None:
        profile.delete()