from rest_framework.permissions import BasePermission


class HasKeycloakRole(BasePermission):
    """ Permission class that checks for specific Keycloak roles
        in the JWT claims attached to the request user.
    """

    required_roles = []

    def has_permission(self, request, view):
        claims = getattr(request.user, "keycloak_claims", None)
        if claims is None:
            # Fall back to checking auth tuple
            if request.auth and isinstance(request.auth, dict):
                claims = request.auth
            else:
                return False

        realm_roles = claims.get("realm_access", {}).get("roles", [])
        client_id = getattr(
            __import__("django.conf", fromlist=["settings"]).settings,
            "OIDC_RP_CLIENT_ID",
            "",
        )
        client_roles = (
            claims.get("resource_access", {})
            .get(client_id, {})
            .get("roles", [])
        )
        all_roles = set(realm_roles + client_roles)

        return all(role in all_roles for role in self.required_roles)


class IsKeycloakStaff(HasKeycloakRole):
    """ Requires the 'staff' role from Keycloak. """
    required_roles = ["staff"]


class IsKeycloakAdmin(HasKeycloakRole):
    """ Requires the 'admin' role from Keycloak. """
    required_roles = ["admin"]


def keycloak_role_required(*roles):
    """ Factory function to create permission classes for specific roles.

    Usage:
        permission_classes = [keycloak_role_required("editor", "publisher")]
    """
    class DynamicRolePermission(HasKeycloakRole):
        required_roles = list(roles)
    DynamicRolePermission.__name__ = f"Requires_{'_'.join(roles)}"
    return DynamicRolePermission