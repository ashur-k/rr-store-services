from .container import Container
from .wiring import wire_container

container = Container()


def initialize_container():
    wire_container(container)


async def initialize_application():
    initialize_container()
    await container.init_resources()


async def close_application_resources():
    await container.shutdown_resources()
