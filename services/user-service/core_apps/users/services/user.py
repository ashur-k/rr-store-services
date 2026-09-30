import logging

from django.db import transaction

from core_apps.common.exceptions import KeycloakUserNotFoundError, UserAlreadyExistsError

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
    ) -> None:
        self.keycloak_client = keycloak_client
        self.user_selector = user_selector
        self.user_repository = user_repository
        self.profile_repository = profile_repository

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
            logger.exception("Failed to create user in Keycloak and Django", extra={"email":data.email})
            self.keycloak_client.delete_user(kc_id)
            raise

        logger.info(f"User created successfully in Keycloak and Django :: {data.email}",)
        return user

    def update_user(self, user_id: int, data: UpdateUser) -> User:
        """Update a user in Keycloak and Django."""

        user = self.user_selector.get_by_id(user_id)

        if data.email is not None and data.email != user.email:
            if self.user_selector.exists_by_email(data.email):
                raise UserAlreadyExistsError(
                    "A user with this email already exists."
                )

        keycloak_data = KeycloakUserUpdate(
            email=data.email, first_name=data.first_name, last_name=data.last_name
        )

        if keycloak_data.model_dump(exclude_none=True):
            self.keycloak_client.update_user(str(user.kc_id), keycloak_data)

        if data.email is not None:
            user = self.user_repository.update_email(user, data.email)

        return user

    def delete_user(self, user_id: int) -> None:
        """Delete a user from Keycloak and Django."""

        user = self.user_selector.get_by_id(user_id)        

        try:
            self.keycloak_client.delete_user(str(user.kc_id))
        except KeycloakUserNotFoundError:
            pass

        self.user_repository.delete(user)