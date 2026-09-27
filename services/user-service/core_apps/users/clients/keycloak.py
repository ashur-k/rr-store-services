from keycloak import KeycloakAdmin
from keycloak.exceptions import (
    KeycloakAuthenticationError,
    KeycloakConnectionError,
    KeycloakDeleteError,
    KeycloakGetError,
    KeycloakPostError,
    KeycloakPutError,
)

from config.keycloak import KEYCLOAK
from core_apps.common.exceptions import KeycloakError

from ..schemas import KeycloakUserCreate, KeycloakUserUpdate


class KeycloakClient:
    """Client for interacting with the Keycloak Admin API."""

    def __init__(self) -> None:
        self._client = KeycloakAdmin(
            server_url=KEYCLOAK.server_url,
            realm_name=KEYCLOAK.realm,
            client_id=KEYCLOAK.admin_client_id,
            client_secret_key=KEYCLOAK.admin_client_secret,
        )

    def get_users(self) -> list[dict]:
        """Return users from Keycloak."""
        try:
            return self._client.get_users()
        except (KeycloakAuthenticationError, KeycloakConnectionError, KeycloakGetError) as exc:
            raise KeycloakError("Failed to retrieve users from Keycloak.") from exc

    def get_user(self, user_id: str) -> dict:
        """Return a user from Keycloak."""

        try:
            return self._client.get_user(user_id)
        except (KeycloakAuthenticationError, KeycloakConnectionError, KeycloakGetError) as exc:
            raise KeycloakError("Failed to retrieve user from Keycloak.") from exc

    def create_user(self, data: KeycloakUserCreate) -> str:
        """Create a user in Keycloak and return their Keycloak ID."""

        try:
            return self._client.create_user(
                {
                    "username": data.email,
                    "email": data.email,
                    "firstName": data.first_name,
                    "lastName": data.last_name,
                    "enabled": True,
                    "credentials": [
                        {
                            "type": "password",
                            "value": data.password,
                            "temporary": False,
                        }
                    ],
                }
            )
        except (KeycloakAuthenticationError, KeycloakConnectionError, KeycloakPostError) as exc:
            raise KeycloakError("Failed to create user in Keycloak.") from exc

    def update_user(self, user_id: str, data: KeycloakUserUpdate) -> None:
        """Update a user in Keycloak."""

        payload = data.model_dump(exclude_none=True)

        if "first_name" in payload:
            payload["firstName"] = payload.pop("first_name")

        if "last_name" in payload:
            payload["lastName"] = payload.pop("last_name")

        try:
            self._client.update_user(user_id, payload)
        except (KeycloakAuthenticationError, KeycloakConnectionError, KeycloakPutError) as exc:
            raise KeycloakError("Failed to update user in Keycloak.") from exc

    def delete_user(self, user_id: str) -> None:
        """Delete a user from Keycloak."""

        try:
            self._client.delete_user(user_id)
        except (KeycloakAuthenticationError, KeycloakConnectionError, KeycloakDeleteError) as exc:
            raise KeycloakError("Failed to delete user from Keycloak."
) from exc