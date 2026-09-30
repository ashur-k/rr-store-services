import logging
from unittest.mock import Mock, patch

from django.test import TestCase

from core_apps.common.exceptions import (
    KeycloakUserNotFoundError,
    UserAlreadyExistsError,
)

from ...repositories import ProfileRepository, UserRepository
from ...schemas import CreateUser, KeycloakUserCreate, KeycloakUserUpdate, UpdateUser
from ...selectors import UserSelector
from ...services import UserService


class UserServiceTestCase(TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        logging.disable(logging.CRITICAL)

    @classmethod
    def tearDownClass(cls):
        logging.disable(logging.NOTSET)
        super().tearDownClass()

    def setUp(self):
        self.keycloak_client = Mock()
        self.user_selector = Mock(spec=UserSelector)
        self.user_repository = Mock(spec=UserRepository)
        self.profile_repository = Mock(spec=ProfileRepository)

        self.service = UserService(
            keycloak_client=self.keycloak_client,
            user_selector=self.user_selector,
            user_repository=self.user_repository,
            profile_repository=self.profile_repository,
        )

        self.email = "test@example.com"
        self.fn = "John"
        self.ln = "Doe"
        self.pwd = "password123"

    def test_get_users(self):
        self.service.get_users()
        self.user_selector.get_all.assert_called_once()

    def test_get_user_by_id(self):
        user_id = 1
        self.service.get_user_by_id(user_id)
        self.user_selector.get_by_id.assert_called_once_with(user_id)

    def test_create_user_raises_error_when_email_already_exists(self):
        data = CreateUser(email=self.email, first_name=self.fn, last_name=self.ln, password=self.pwd)
        
        self.user_selector.exists_by_email.return_value = True
        
        with self.assertRaises(UserAlreadyExistsError):
            self.service.create_user(data)

    def test_create_user_deletes_keycloak_user_when_django_creation_fails(self):
        data = CreateUser(email=self.email, first_name=self.fn, last_name=self.ln, password=self.pwd)

        kc_id = "kc-id"

        self.user_selector.exists_by_email.return_value = False
        self.keycloak_client.create_user.return_value = kc_id
        self.user_repository.create.side_effect = Exception()

        with self.assertRaises(Exception):
            self.service.create_user(data)

        self.keycloak_client.delete_user.assert_called_once_with(kc_id)
    
    def test_create_user_calls_keycloak(self):
        data = CreateUser(email=self.email, first_name=self.fn, last_name=self.ln, password=self.pwd)

        self.user_selector.exists_by_email.return_value = False
        self.keycloak_client.create_user.return_value = "kc-id"

        self.service.create_user(data)

        self.keycloak_client.create_user.assert_called_once_with(
            KeycloakUserCreate(email=self.email, first_name=self.fn, last_name=self.ln, password=self.pwd)
        )

    def test_create_user_creates_user_and_profile(self):
        data = CreateUser(email=self.email, first_name=self.fn, last_name=self.ln, password=self.pwd)

        kc_id = "kc-id"
        user = Mock()

        self.user_selector.exists_by_email.return_value = False
        self.keycloak_client.create_user.return_value = kc_id
        self.user_repository.create.return_value = user

        result = self.service.create_user(data)

        self.user_repository.create.assert_called_once_with(
            kc_id=kc_id,
            email=data.email,
        )

        self.profile_repository.create.assert_called_once_with(
            user=user,
        )

        self.assertIs(result, user)

    def test_update_user_raises_error_when_email_already_exists(self):
        user_id = 1
        user = Mock()
        user.email = self.email

        data = UpdateUser(email="another@example.com")

        self.user_selector.get_by_id.return_value = user
        self.user_selector.exists_by_email.return_value = True

        with self.assertRaises(UserAlreadyExistsError):
            self.service.update_user(user_id, data)

    def test_update_user_calls_keycloak(self):
        user = Mock()
        user.email = self.email
        user.kc_id = "kc-id"

        data = UpdateUser(email="new@example.com")

        self.user_selector.get_by_id.return_value = user
        self.user_selector.exists_by_email.return_value = False

        self.service.update_user(1, data)

        self.keycloak_client.update_user.assert_called_once_with(
            "kc-id",
            KeycloakUserUpdate(
                email="new@example.com", first_name=None, last_name=None
            ),
        )

    def test_delete_user_deletes_local_user_when_keycloak_user_not_found(self):
        user_id = 1
        user = Mock()
        user.kc_id = "kc-id"

        self.user_selector.get_by_id.return_value = user
        self.keycloak_client.delete_user.side_effect = KeycloakUserNotFoundError()

        self.service.delete_user(user_id)

        self.keycloak_client.delete_user.assert_called_once_with("kc-id")
        self.user_repository.delete.assert_called_once_with(user)

    def test_delete_user_calls_keycloak(self):
        user_id = 1
        user = Mock()
        user.kc_id = "kc-id"

        self.user_selector.get_by_id.return_value = user

        self.service.delete_user(user_id)

        self.user_selector.get_by_id.assert_called_once_with(user_id)
        self.keycloak_client.delete_user.assert_called_once_with("kc-id")