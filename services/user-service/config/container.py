from dependency_injector import containers, providers

from core_apps.users.clients import KeycloakClient
from core_apps.users.repositories import ProfileRepository, UserRepository
from core_apps.users.selectors import UserSelector
from core_apps.users.services import KeycloakLogoutService, UserProfileService, UserService


# TODO revisit how I want to architect PDI container
class Container(containers.DeclarativeContainer):
    config = providers.Configuration()

    keycloak_logout_service = providers.Factory(
        KeycloakLogoutService,
    )

    user_profile_service = providers.Factory(
        UserProfileService,
    )

    keycloak_client = providers.Singleton(
        KeycloakClient,
    )

    user_selector = providers.Factory(
            UserSelector,
        )
    
    user_repository = providers.Factory(
        UserRepository,
    )

    profile_repository = providers.Factory(
        ProfileRepository,
    )

    user_service = providers.Factory(
        UserService,
        keycloak_client=keycloak_client,
        user_selector=user_selector,
        user_repository=user_repository,
        profile_repository=profile_repository,
    )
