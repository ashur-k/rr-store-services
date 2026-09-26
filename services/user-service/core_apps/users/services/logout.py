from urllib.parse import urlencode

import jwt
from django.conf import settings
from django.contrib.sessions.models import Session
from jwt import PyJWKClient
from rest_framework.exceptions import AuthenticationFailed

from config.keycloak import KEYCLOAK
from core_apps.users.models import OIDCSession


class KeycloakLogoutService:
    def __init__(self):
        self._jwks_client = PyJWKClient(
            settings.OIDC_OP_JWKS_ENDPOINT,
            cache_keys=True,
            lifespan=3600,
        )

    @staticmethod
    def build_provider_logout_url(request):

        logout_url = KEYCLOAK.logout_endpoint
        id_token = request.session.get("oidc_id_token")

        if id_token:
            params = {
                "id_token_hint": id_token,
                "post_logout_redirect_uri": request.build_absolute_uri("/"),
            }

            logout_url += "?" + urlencode(params)

        return logout_url

    def validate_logout_token(self, token):
        try:
            signing_key = self._jwks_client.get_signing_key_from_jwt(token)

            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience=settings.OIDC_RP_CLIENT_ID,
                issuer=KEYCLOAK.public_base,
                options={
                    "verify_exp": True,
                    "verify_aud": True,
                    "verify_iss": True,
                },
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Logout token has expired")
        except jwt.InvalidTokenError as exc:
            raise AuthenticationFailed(
                f"Invalid logout token: {exc}"
            )

        self._validate_logout_event(payload)

        return payload

    @staticmethod
    def _validate_logout_event(payload):
        events = payload.get("events", {})

        logout_event = (
            "http://schemas.openid.net/event/backchannel-logout"
        )

        if logout_event not in events:
            raise AuthenticationFailed(
                "Invalid logout token: missing backchannel logout event"
            )

        if not payload.get("sid") and not payload.get("sub"):
            raise AuthenticationFailed(
                "Invalid logout token: missing sid or sub"
            )

    def logout_session(self, keycloak_sid):
        try:
            oidc_session = OIDCSession.objects.get(
                keycloak_sid=keycloak_sid
            )
        except OIDCSession.DoesNotExist:
            return False

        Session.objects.filter(
            session_key=oidc_session.django_session_key
        ).delete()

        oidc_session.delete()

        return True


def build_provider_logout_url(request):
    return KeycloakLogoutService.build_provider_logout_url(request)