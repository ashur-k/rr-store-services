from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class KeycloakSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    internal_base: str = Field(alias="KC_BASE")
    public_base: str = Field(alias="KC_BROWSER_BASE")

    client_id: str = Field(alias="OIDC_RP_CLIENT_ID")
    client_secret: str = Field(alias="OIDC_RP_CLIENT_SECRET")

    sign_algorithm: str = "RS256"
    

    @property
    def authorization_endpoint(self) -> str:
        return f"{self.public_base}/protocol/openid-connect/auth"

    @property
    def token_endpoint(self) -> str:
        return f"{self.internal_base}/protocol/openid-connect/token"

    @property
    def user_endpoint(self) -> str:
        return f"{self.internal_base}/protocol/openid-connect/userinfo"

    @property
    def jwks_endpoint(self) -> str:
        return f"{self.internal_base}/protocol/openid-connect/certs"

    @property
    def logout_endpoint(self) -> str:
        return f"{self.public_base}/protocol/openid-connect/logout"


KEYCLOAK = KeycloakSettings()