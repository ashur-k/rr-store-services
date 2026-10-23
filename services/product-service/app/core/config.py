from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    database_url: str = (
        "postgresql+asyncpg://admin:postgres@postgres:5432/product-service"
    )

    kc_server_url: str = "http://keycloak:8080"
    kc_browser_server_url: str = "http://localhost:8081"
    kc_realm: str = "rr-store"
    kc_audience: str = "account"

    store_service_url: str = "http://store-service:8000"

    @property
    def kc_jwks_url(self) -> str:
        return (
            f"{self.kc_server_url}/realms/{self.kc_realm}/protocol/openid-connect/certs"
        )


settings = Settings()
