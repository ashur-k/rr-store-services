from django.conf import settings


class UserProfileService:
    """Application service for retrieving a user's profile."""

    def get_profile(self, user, claims):
        realm_roles = claims.get("realm_access", {}).get("roles", [])

        client_roles = (
            claims.get("resource_access", {})
            .get(settings.OIDC_RP_CLIENT_ID, {})
            .get("roles", [])
        )

        return {
            "sub": claims.get("sub", ""),
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "realm_roles": realm_roles,
            "client_roles": client_roles,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        }