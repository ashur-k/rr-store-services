from unittest.mock import Mock

from django.test import TestCase

from ...services import UserProfileService


class UserProfileServiceTests(TestCase):

    def test_get_profile_returns_user_and_keycloak_data(self):
        user = Mock(
            email="ashur@example.com",
            username="ashur@example.com",
            first_name="Ashur",
            last_name="Ashur",
            is_staff=False,
            is_superuser=False,
        )

        claims = {
            "sub": "12345",
            "realm_access": {
                "roles": ["customer", "staff"],
            },
            "resource_access": {
                "user-service": {
                    "roles": ["profile:read"],
                },
            },
        }

        service = UserProfileService()

        result = service.get_profile(
            user=user,
            claims=claims,
        )

        self.assertEqual(result["sub"], "12345")
        self.assertEqual(result["email"], "ashur@example.com")
        self.assertEqual(result["first_name"], "Ashur")
        self.assertEqual(
            result["realm_roles"],
            ["customer", "staff"],
        )
        self.assertEqual(
            result["client_roles"],
            ["profile:read"],
        )