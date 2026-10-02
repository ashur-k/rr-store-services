from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = (
        "postgresql+asyncpg://admin:postgres@postgres:5432/store-service"
    )

    kc_server_url: str = "http://keycloak:8080"
    kc_browser_server_url: str = "http://localhost:8081"
    kc_realm: str = "rr-store"
    kc_audience: str = "account"

    @property
    def kc_jwks_url(self) -> str:
        return (
            f"{self.kc_server_url}/realms/{self.kc_realm}"
            "/protocol/openid-connect/certs"
        )


settings = Settings()