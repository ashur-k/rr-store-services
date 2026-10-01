from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = (
        "postgresql+asyncpg://admin:postgres@postgres:5432/store-service"
    )


settings = Settings()