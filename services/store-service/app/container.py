from dependency_injector import containers, providers

from app.messaging.rabbitmq import RabbitMQConnection


class Container(containers.DeclarativeContainer):
    rabbitmq_connection = providers.Singleton(
        RabbitMQConnection,
    )
