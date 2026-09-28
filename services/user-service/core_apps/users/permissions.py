from django.conf import settings
from rest_framework.permissions import BasePermission


class HasKeycloakRole(BasePermission):
    """Permission class that checks for specific Keycloak roles."""

    required_roles = []

    def has_permission(self, request, view):
        claims = getattr(request.user, "keycloak_claims", None)

        if claims is None:
            if request.auth and isinstance(request.auth, dict):
                claims = request.auth
            else:
                return False

        realm_roles = claims.get("realm_access", {}).get("roles", [])

        client_roles = (
            claims.get("resource_access", {})
            .get(settings.OIDC_RP_CLIENT_ID, {})
            .get("roles", [])
        )

        all_roles = set(realm_roles + client_roles)

        return all(role in all_roles for role in self.required_roles)


class IsKeycloakStaff(HasKeycloakRole):
    """Requires the 'staff' role from Keycloak."""

    required_roles = ["staff"]


class IsKeycloakAdmin(HasKeycloakRole):
    """Requires the 'admin' role from Keycloak."""

    required_roles = ["admin"]


class IsKeycloakAdminOrStaff(BasePermission):
    """Requires either the 'admin' or 'staff' Keycloak role."""

    allowed_roles = {"admin", "staff"}

    def has_permission(self, request, view):
        claims = getattr(request.user, "keycloak_claims", None)

        if claims is None:
            if request.auth and isinstance(request.auth, dict):
                claims = request.auth
            else:
                return False

        realm_roles = claims.get("realm_access", {}).get("roles", [])

        client_roles = (
            claims.get("resource_access", {})
            .get(settings.OIDC_RP_CLIENT_ID, {})
            .get("roles", [])
        )

        all_roles = set(realm_roles + client_roles)

        return bool(all_roles & self.allowed_roles)


class IsSelfOrAdminStaff(BasePermission):
    """Allows users to access themselves, or admin/staff to access anyone."""

    allowed_roles = {"admin", "staff"}

    def has_permission(self, request, view):
        claims = getattr(request.user, "keycloak_claims", None)

        if claims is None:
            if request.auth and isinstance(request.auth, dict):
                claims = request.auth
            else:
                return False

        realm_roles = claims.get("realm_access", {}).get("roles", [])

        client_roles = (
            claims.get("resource_access", {})
            .get(settings.OIDC_RP_CLIENT_ID, {})
            .get("roles", [])
        )

        all_roles = set(realm_roles + client_roles)

        if all_roles & self.allowed_roles:
            return True

        user_id = view.kwargs.get("user_id")

        return str(request.user.id) == str(user_id)


def keycloak_role_required(*roles):
    """ Factory function to create permission classes for specific roles.

    Usage:
        permission_classes = [keycloak_role_required("editor", "publisher")]
    """
    class DynamicRolePermission(HasKeycloakRole):
        required_roles = list(roles)
    DynamicRolePermission.__name__ = f"Requires_{'_'.join(roles)}"
    return DynamicRolePermission
