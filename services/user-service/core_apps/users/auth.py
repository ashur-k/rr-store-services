import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from jwt import PyJWKClient
from mozilla_django_oidc.auth import OIDCAuthenticationBackend
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from config.keycloak import KEYCLOAK

User = get_user_model()


class KeycloakOIDCAuthenticationBackend(OIDCAuthenticationBackend):
    """
    Custom OIDC backend that maps Keycloak claims to Django user fields.
    """

    def authenticate(self, request, **kwargs):
        user = super().authenticate(request, **kwargs)

        if user:
            sid = request.GET.get("session_state")

            if sid:
                request.session["keycloak_sid"] = sid

        return user

    def create_user(self, claims):
        """Create a Django user from Keycloak claims."""
        email = claims.get("email")
        sub = claims.get("sub")

        user = User.objects.create_user(
            username=email,
            kc_id=sub,
            email=email,
        )
        self._sync_user_from_claims(user, claims)
        return user

    def update_user(self, user, claims):
        """Update an existing Django user from Keycloak claims."""
        self._sync_user_from_claims(user, claims)
        return user

    def _sync_user_from_claims(self, user, claims):
        """Map Keycloak claims to Django user fields."""
        user.first_name = claims.get("given_name", "")
        user.last_name = claims.get("family_name", "")
        user.email = claims.get("email", "")

        # Map Keycloak roles to Django staff/superuser flags
        realm_roles = claims.get("realm_access", {}).get("roles", [])
        client_roles = (
            claims.get("resource_access", {})
            .get(settings.OIDC_RP_CLIENT_ID, {})
            .get("roles", [])
        )
        all_roles = set(realm_roles + client_roles)

        user.is_staff = "staff" in all_roles or "admin" in all_roles
        user.is_superuser = "admin" in all_roles

        user.save()

    def filter_users_by_claims(self, claims):
        """Find an existing user by Keycloak subject ID."""
        kc_id = claims.get("sub")
        if kc_id:
            return User.objects.filter(kc_id=kc_id)
        return self.UserModel.objects.none()


class KeycloakJWTAuthentication(BaseAuthentication):
    """
    DRF authentication class that validates Keycloak JWT access tokens.

    Use this for API-to-API communication where the client sends a
    Bearer token directly, without going through the OIDC login flow.
    """

    def __init__(self):
        self._jwks_client = None

    @property
    def jwks_client(self):
        if self._jwks_client is None:
            self._jwks_client = PyJWKClient(
                KEYCLOAK.jwks_endpoint,
                cache_keys=True,
                lifespan=3600,
            )
        return self._jwks_client

    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth_header.startswith("Bearer "):
            return None  # Let other auth classes handle it

        token = auth_header[7:]  # Strip "Bearer "

        try:
            signing_key = self.jwks_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=[KEYCLOAK.sign_algorithm],
                audience="account",
                issuer=KEYCLOAK.public_base,
                options={
                    "verify_exp": True,
                    "verify_aud": True,
                    "verify_iss": True,
                },
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed(f"Invalid token: {str(e)}")

        # Find or create the Django user
        user = self._get_or_create_user(payload)
        user.keycloak_claims = payload  # Attach claims to user object
        return (user, payload)

    def _get_or_create_user(self, payload):
        """Find or create a Django user from JWT claims."""
        kc_id = payload["sub"]

        try:
            user = User.objects.get(kc_id=kc_id)
        except User.DoesNotExist:
            if not settings.OIDC_CREATE_USER:
                raise AuthenticationFailed("User does not exist")
            user = User.objects.create(
                kc_id=kc_id,
                email=payload.get("email", ""),
                first_name=payload.get("given_name", ""),
                last_name=payload.get("family_name", ""),
            )

        self._sync_user_from_claims(user, payload)

        return user

    def _sync_user_from_claims(self, user, claims):
        """Synchronize Django user fields from Keycloak claims."""
        user.first_name = claims.get("given_name", "")
        user.last_name = claims.get("family_name", "")
        user.email = claims.get("email", "")

        realm_roles = claims.get("realm_access", {}).get("roles", [])
        client_roles = (
            claims.get("resource_access", {})
            .get(settings.OIDC_RP_CLIENT_ID, {})
            .get("roles", [])
        )
        all_roles = set(realm_roles + client_roles)

        user.is_staff = "staff" in all_roles or "admin" in all_roles
        user.is_superuser = "admin" in all_roles

        user.save(
            update_fields=[
                "first_name",
                "last_name",
                "email",
                "is_staff",
                "is_superuser",
            ]
        )
