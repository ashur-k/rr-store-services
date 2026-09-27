from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class KeycloakSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    server_url: str = Field(alias="KC_SERVER_URL")
    browser_server_url: str = Field(alias="KC_BROWSER_SERVER_URL")
    realm: str = Field(alias="KC_REALM")

    client_id: str = Field(alias="OIDC_RP_CLIENT_ID")
    client_secret: str = Field(alias="OIDC_RP_CLIENT_SECRET")

    admin_client_id: str = Field(alias="KC_ADMIN_CLIENT_ID")
    admin_client_secret: str = Field(alias="KC_ADMIN_CLIENT_SECRET")

    sign_algorithm: str = "RS256"

    @property
    def internal_base(self) -> str:
        return f"{self.server_url}/realms/{self.realm}"
    
    @property
    def public_base(self) -> str:
        return f"{self.browser_server_url}/realms/{self.realm}"

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