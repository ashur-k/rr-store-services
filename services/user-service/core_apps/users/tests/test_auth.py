from unittest.mock import Mock, patch
from uuid import uuid4

import jwt
from django.test import TestCase
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.test import APIRequestFactory

from core_apps.users.auth import KeycloakJWTAuthentication
from core_apps.users.models import User

from ..auth import KeycloakOIDCAuthenticationBackend


class KeycloakJWTAuthenticationTests(TestCase):

    def test_authenticate_finds_existing_user_by_kc_id(self):
        kc_id = uuid4()

        user = User.objects.create_user(
            username="test@example.com",
            kc_id=kc_id,
            email="test@example.com",
        )

        payload = {
            "sub": str(kc_id),
            "email": "test@example.com",
            "given_name": "Test",
            "family_name": "User",
            "realm_access": {
                "roles": [],
            },
        }

        request = APIRequestFactory().get(
            "/users/me/",
            HTTP_AUTHORIZATION="Bearer fake-token",
        )

        authentication = KeycloakJWTAuthentication()

        signing_key = Mock()
        signing_key.key = "fake-key"

        with (
            patch.object(
                authentication.jwks_client,
                "get_signing_key_from_jwt",
                return_value=signing_key,
            ),
            patch(
                "core_apps.users.auth.jwt.decode",
                return_value=payload,
            ),
        ):
            authenticated_user, token = authentication.authenticate(request)

        self.assertEqual(authenticated_user.pk, user.pk)
        self.assertEqual(authenticated_user.kc_id, kc_id)
        self.assertEqual(authenticated_user.email, "test@example.com")
        self.assertEqual(token, payload)


    def test_authenticate_syncs_user_roles_from_keycloak(self):
        kc_id = uuid4()

        user = User.objects.create_user(
            username="test@example.com",
            email="test@example.com",
            kc_id=kc_id,
            is_staff=False,
            is_superuser=False,
        )

        payload = {
            "sub": str(kc_id),
            "email": "test@example.com",
            "given_name": "Test",
            "family_name": "User",
            "realm_access": {
                "roles": ["admin"],
            },
        }

        request = APIRequestFactory().get(
            "/users/me/",
            HTTP_AUTHORIZATION="Bearer fake-token",
        )

        authentication = KeycloakJWTAuthentication()

        signing_key = Mock()
        signing_key.key = "fake-key"

        with (
            patch.object(
                authentication.jwks_client,
                "get_signing_key_from_jwt",
                return_value=signing_key,
            ),
            patch(
                "core_apps.users.auth.jwt.decode",
                return_value=payload,
            ),
        ):
            authenticated_user, _ = authentication.authenticate(request)

        authenticated_user.refresh_from_db()

        self.assertTrue(authenticated_user.is_staff)
        self.assertTrue(authenticated_user.is_superuser)

    def test_authenticate_rejects_expired_token(self):
        request = APIRequestFactory().get(
            "/users/me/",
            HTTP_AUTHORIZATION="Bearer expired-token",
        )

        authentication = KeycloakJWTAuthentication()

        signing_key = Mock()
        signing_key.key = "fake-key"

        with (
            patch.object(
                authentication.jwks_client,
                "get_signing_key_from_jwt",
                return_value=signing_key,
            ),
            patch(
                "core_apps.users.auth.jwt.decode",
                side_effect=jwt.ExpiredSignatureError,
            ),
        ):
            with self.assertRaisesMessage(
                AuthenticationFailed,
                "Token has expired",
            ):
                authentication.authenticate(request)

    def test_authenticate_rejects_invalid_token(self):
        request = APIRequestFactory().get(
            "/users/me/",
            HTTP_AUTHORIZATION="Bearer invalid-token",
        )

        authentication = KeycloakJWTAuthentication()

        signing_key = Mock()
        signing_key.key = "fake-key"

        with (
            patch.object(
                authentication.jwks_client,
                "get_signing_key_from_jwt",
                return_value=signing_key,
            ),
            patch(
                "core_apps.users.auth.jwt.decode",
                side_effect=jwt.InvalidTokenError("Invalid token"),
            ),
        ):
            with self.assertRaisesMessage(
                AuthenticationFailed,
                "Invalid token: Invalid token",
            ):
                authentication.authenticate(request)


class KeycloakOIDCAuthenticationBackendTests(TestCase):

    def test_create_user_from_keycloak_claims(self):
        claims = {
            "sub": str(uuid4()),
            "email": "oidc@example.com",
            "given_name": "OIDC",
            "family_name": "User",
            "realm_access": {
                "roles": [],
            },
        }

        backend = KeycloakOIDCAuthenticationBackend()

        user = backend.create_user(claims)

        self.assertEqual(user.kc_id, claims["sub"])
        self.assertEqual(user.email, "oidc@example.com")
        self.assertEqual(user.first_name, "OIDC")
        self.assertEqual(user.last_name, "User")

