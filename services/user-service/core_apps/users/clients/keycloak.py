import logging

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
from core_apps.common.exceptions import (
    KeycloakError,
    KeycloakUserNotFoundError,
)
from core_apps.users.schemas.store_owner import KeycloakStoreUserCreate

from ..schemas import KeycloakUserCreate, KeycloakUserUpdate

logger = logging.getLogger(__name__)


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
            logger.exception("Keycloak create_user request failed")
            raise KeycloakError("Failed to create user in Keycloak.") from exc

    def create_store_user(self, data: KeycloakStoreUserCreate) -> str:
        """Create a store user in Keycloak with a temporary password."""

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
                            "temporary": True,
                        }
                    ],
                }
            )
        except (
            KeycloakAuthenticationError,
            KeycloakConnectionError,
            KeycloakPostError,
        ) as exc:
            raise KeycloakError("Failed to create store owner in Keycloak.") from exc

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
        except KeycloakDeleteError as exc:
            if exc.response_code == 404:
                raise KeycloakUserNotFoundError(f"User {user_id} was not found in Keycloak.") from exc
            raise KeycloakError("Failed to delete user from Keycloak.") from exc
        except (KeycloakAuthenticationError, KeycloakConnectionError) as exc:
            raise KeycloakError("Failed to delete user from Keycloak.") from exc

    def assign_realm_role(self, user_id: str, role_name: str) -> None:
        """Assign a realm role to a Keycloak user."""

        try:
            role = self._client.get_realm_role(role_name)

            self._client.assign_realm_roles(
                user_id=user_id,
                roles=[role],
            )
        except (
            KeycloakAuthenticationError,
            KeycloakConnectionError,
            KeycloakGetError,
            KeycloakPostError,
        ) as exc:
            raise KeycloakError(f"Failed to assign realm role '{role_name}' to user.") from exc

    def get_users_by_realm_role(self, role_name: str) -> list[dict]:
        """Return users assigned to a realm role in Keycloak."""

        try:
            role = self._client.get_realm_role(role_name)

            return self._client.get_realm_role_members(role_name=role["name"])
        except (
            KeycloakAuthenticationError,
            KeycloakConnectionError,
            KeycloakGetError,
        ) as exc:
            raise KeycloakError(f"Failed to retrieve users with realm role '{role_name}'.") from exc
