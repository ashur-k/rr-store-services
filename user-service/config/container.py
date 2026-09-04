from dependency_injector import containers, providers


# TODO revisit how I want to architect PDI container
class Container(containers.DeclarativeContainer):
    config = providers.Configuration()
