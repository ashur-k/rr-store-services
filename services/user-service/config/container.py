from dependency_injector import containers, providers

from core_apps.users.services import KeycloakLogoutService, UserProfileService


# TODO revisit how I want to architect PDI container
class Container(containers.DeclarativeContainer):
    config = providers.Configuration()

    keycloak_logout_service = providers.Factory(
        KeycloakLogoutService,
    )

    user_profile_service = providers.Factory(
        UserProfileService,
    )