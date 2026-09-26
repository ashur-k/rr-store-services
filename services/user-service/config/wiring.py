from config.container import Container
from core_apps.users import views


def wire_container(container: Container)-> None:
    container.wire(   
        packages=[views],
    )