from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = (
        "postgresql+asyncpg://admin:postgres@postgres:5432/store-service"
    )

    kc_server_url: str = "http://keycloak:8080"
    kc_browser_server_url: str = "http://localhost:8081"
    kc_realm: str = "rr-store"
    kc_audience: str = "account"

    kc_m2m_audience: str = "store-service"
    kc_m2m_client_id: str = "user-service-store-check"

    rabbitmq_host: str
    rabbitmq_port: int
    rabbitmq_username: str
    rabbitmq_password: str
    rabbitmq_vhost: str = "/"
    rabbitmq_exchange: str = "rr-store.events"

    @property
    def kc_jwks_url(self) -> str:
        return (
            f"{self.kc_server_url}/realms/{self.kc_realm}/protocol/openid-connect/certs"
        )


settings = Settings()
