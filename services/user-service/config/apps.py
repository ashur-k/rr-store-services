from django.apps import AppConfig


class ConfigAppConfig(AppConfig):
    name = "config"

    def ready(self):
        from config.container import Container
        from config.wiring import wire_container

        self.container = Container()
        wire_container(self.container)