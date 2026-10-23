import asyncio
import logging

from django.db import transaction

from core_apps.common.clients import StoreServiceClient
from core_apps.common.events import EventDispatcher
from core_apps.common.exceptions import (
    KeycloakUserNotFoundError,
    StoreServiceUnavailableError,
    UserAlreadyExistsError,
    UserOwnsStoresError,
)
from core_apps.common.utils.password import generate_temporary_password
from core_apps.users.schemas.store_owner import CreateStoreUser, KeycloakStoreUserCreate

from ..clients import KeycloakClient
from ..models import User
from ..repositories import ProfileRepository, UserRepository
from ..schemas import (
    CreateUser,
    KeycloakUserCreate,
    KeycloakUserUpdate,
    UpdateUser,
)
from ..selectors import UserSelector

logger = logging.getLogger(__name__)


class UserService:
    """Application services for user management."""

    def __init__(
        self,
        keycloak_client: KeycloakClient,
        user_selector: UserSelector,
        user_repository: UserRepository,
        profile_repository: ProfileRepository,
        event_dispatcher: EventDispatcher,
        store_service_client: StoreServiceClient,
    ) -> None:
        self.keycloak_client = keycloak_client
        self.user_selector = user_selector
        self.user_repository = user_repository
        self.profile_repository = profile_repository
        self.event_dispatcher = event_dispatcher
        self.store_service_client = store_service_client

    def get_users(self) -> list[User]:
        """Return all Django users."""

        return self.user_selector.get_all()

    def get_user_by_id(self, user_id: int) -> User:
        """Return a Django user."""
        return self.user_selector.get_by_id(user_id)

    def create_user(self, data: CreateUser) -> User:
        """Create a user in Keycloak and Django."""

        if self.user_selector.exists_by_email(data.email):
            raise UserAlreadyExistsError("A user with this email already exists.")

        keycloak_data = KeycloakUserCreate(
            email=data.email,
            first_name=data.first_name,
            last_name=data.last_name,
            password=data.password,
        )

        kc_id = self.keycloak_client.create_user(keycloak_data)

        try:
            with transaction.atomic():
                user = self.user_repository.create(
                    kc_id=kc_id,
                    email=data.email,
                )

                self.profile_repository.create(
                    user=user,
                )

        except Exception:
            logger.exception("Failed to create user in Keycloak and Django", extra={"email": data.email})
            self.keycloak_client.delete_user(kc_id)
            raise

        logger.info(
            f"User created successfully in Keycloak and Django :: {data.email}",
        )
        return user

    def create_store_user(self, data: CreateStoreUser) -> User:
        """Create a store user in Keycloak and Django."""

        if self.user_selector.exists_by_email(data.email):
            raise UserAlreadyExistsError("A user with this email already exists.")

        temporary_password = generate_temporary_password()

        keycloak_data = KeycloakStoreUserCreate(
            email=data.email,
            first_name=data.first_name,
            last_name=data.last_name,
            password=temporary_password,
        )

        kc_id = self.keycloak_client.create_store_user(keycloak_data)

        try:
            self.keycloak_client.assign_realm_role(
                kc_id,
                "store_owner",
            )

            with transaction.atomic():
                user = self.user_repository.create(
                    kc_id=kc_id,
                    email=data.email,
                )

                self.profile_repository.create(
                    user=user,
                )

        except Exception:
            logger.exception(
                "Failed to create store owner in Keycloak and Django",
                extra={"email": data.email},
            )
            self.keycloak_client.delete_user(kc_id)
            raise

        logger.info(
            "Store owner created successfully in Keycloak and Django :: %s",
            data.email,
        )

        return user

    def update_user(self, user_id: int, data: UpdateUser) -> User:
        """Update a user in Keycloak and Django."""

        user = self.user_selector.get_by_id(user_id)

        if data.email is not None and data.email != user.email:
            if self.user_selector.exists_by_email(data.email):
                raise UserAlreadyExistsError("A user with this email already exists.")

        keycloak_data = KeycloakUserUpdate(email=data.email, first_name=data.first_name, last_name=data.last_name)

        if keycloak_data.model_dump(exclude_none=True):
            self.keycloak_client.update_user(str(user.kc_id), keycloak_data)

        if data.email is not None:
            user = self.user_repository.update_email(user, data.email)

        return user

    def delete_user(self, user_id: int) -> None:
        """Delete a user from Keycloak and Django."""

        user = self.user_selector.get_by_id(user_id)

        try:
            has_stores = self.store_service_client.owner_has_stores(str(user.kc_id))
        except Exception as exc:
            logger.exception("Failed to verify store ownership. Refusing to delete user.")
            raise StoreServiceUnavailableError("Could not verify store ownership. User was not deleted.") from exc

        if has_stores:
            raise UserOwnsStoresError("Cannot delete a user who owns stores.")

        try:
            self.keycloak_client.delete_user(str(user.kc_id))
        except KeycloakUserNotFoundError:
            pass

        self.user_repository.delete(user)

    def get_store_users(self) -> list[dict]:
        """Return users with the store_owner realm role."""

        users = self.keycloak_client.get_users_by_realm_role("store_owner")
        kc_ids = [user["id"] for user in users]
        local_users_by_kc_id = self.user_selector.get_by_kc_ids(kc_ids)

        return [
            {
                "id": local_users_by_kc_id[user["id"]].id,
                "kc_id": user["id"],
                "username": user["username"],
                "email": user.get("email"),
            }
            for user in users
            if user["id"] in local_users_by_kc_id
        ]

    async def aget_store_users(self) -> list[dict]:
        """Return users with the store_owner realm role asynchronously."""
        users = await self.keycloak_client.aget_users_by_realm_role("store_owner")
        kc_ids = [user["id"] for user in users]
        local_users_by_kc_id = await self.user_selector.aget_by_kc_ids(kc_ids)

        return [
            {
                "id": local_users_by_kc_id[user["id"]].id,
                "kc_id": user["id"],
                "username": user["username"],
                "email": user.get("email"),
            }
            for user in users
            if user["id"] in local_users_by_kc_id
        ]

    async def aget_stores_with_owners(self) -> list[dict]:
        """Return stores combined with their owner details."""

        stores, users = await asyncio.gather(
            self.store_service_client.get_all_stores_async(),
            self.keycloak_client.aget_users_by_realm_role("store_owner"),
        )

        kc_ids = [user["id"] for user in users]
        local_users_by_kc_id = await self.user_selector.aget_by_kc_ids(kc_ids)

        users_by_kc_id = {
            user["id"]: {
                "id": local_users_by_kc_id[user["id"]].id,
                "kc_id": user["id"],
                "username": user["username"],
                "email": user.get("email"),
                "full_name": " ".join(
                    part
                    for part in [
                        user.get("firstName"),
                        user.get("lastName"),
                    ]
                    if part
                ),
            }
            for user in users
            if user["id"] in local_users_by_kc_id
        }

        return [
            {
                "store_id": store["id"],
                "store_name": store["name"],
                "store_description": store.get("description"),
                "store_user_id": owner["id"] if (owner := users_by_kc_id.get(str(store["owner_id"]))) else None,
                "store_user_kc_id": owner["kc_id"] if owner else None,
                "store_user_full_name": owner["full_name"] if owner else None,
                "store_user_username": owner["username"] if owner else None,
                "store_user_email": owner["email"] if owner else None,
            }
            for store in stores
        ]
