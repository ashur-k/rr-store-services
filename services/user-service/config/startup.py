from .container import Container
from .wiring import wire_container

container = Container()


def initialize_container():
    wire_container(container)