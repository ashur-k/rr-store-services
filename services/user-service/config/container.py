from dependency_injector import containers, providers
from django.conf import settings

from config.rabbitmq import RabbitMQConnection
from core_apps.common.clients import StoreServiceClient
from core_apps.common.events import EventDispatcher, UserCreated
from core_apps.outbox.handlers import UserCreatedOutboxHandler
from core_apps.outbox.services.publisher import OutboxPublisher
from core_apps.outbox.services.rabbitmq_publisher import RabbitMQEventPublisher
from core_apps.users.clients import KeycloakClient
from core_apps.users.repositories import ProfileRepository, UserRepository
from core_apps.users.selectors import UserSelector
from core_apps.users.services import KeycloakLogoutService, UserProfileService, UserService


def create_event_dispatcher(
    user_created_handler: UserCreatedOutboxHandler,
) -> EventDispatcher:
    dispatcher = EventDispatcher()
    dispatcher.register(UserCreated, user_created_handler)
    return dispatcher


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

    user_created_outbox_handler = providers.Factory(
        UserCreatedOutboxHandler,
    )

    event_dispatcher = providers.Singleton(
        create_event_dispatcher,
        user_created_handler=user_created_outbox_handler,
    )

    store_service_client = providers.Singleton(
        StoreServiceClient,
        base_url=settings.STORE_SERVICE_URL,
        client_id=settings.STORE_SERVICE_M2M_CLIENT_ID,
        client_secret=settings.STORE_SERVICE_M2M_CLIENT_SECRET,
    )

    user_service = providers.Factory(
        UserService,
        keycloak_client=keycloak_client,
        user_selector=user_selector,
        user_repository=user_repository,
        profile_repository=profile_repository,
        event_dispatcher=event_dispatcher,
        store_service_client=store_service_client,
    )

    rabbitmq_connection = providers.Singleton(
        RabbitMQConnection,
    )

    rabbitmq_event_publisher = providers.Singleton(
        RabbitMQEventPublisher,
        rabbitmq=rabbitmq_connection,
    )

    outbox_publisher = providers.Factory(
        OutboxPublisher,
        event_publisher=rabbitmq_event_publisher,
    )

    store_service_client = providers.Singleton(
        StoreServiceClient,
        base_url=settings.STORE_SERVICE_URL,
        client_id=settings.STORE_SERVICE_M2M_CLIENT_ID,
        client_secret=settings.STORE_SERVICE_M2M_CLIENT_SECRET,
    )
