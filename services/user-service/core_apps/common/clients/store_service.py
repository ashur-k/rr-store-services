import httpx
from django.conf import settings

from config.keycloak import KEYCLOAK


class StoreServiceClient:
    """Client for communicating with the store-service."""

    def __init__(
        self,
        base_url: str | None = None,
        client_id: str | None = None,
        client_secret: str | None = None,
    ) -> None:
        self.base_url = (base_url or settings.STORE_SERVICE_URL).rstrip("/")
        self.client_id = client_id or settings.STORE_SERVICE_M2M_CLIENT_ID
        self.client_secret = client_secret or settings.STORE_SERVICE_M2M_CLIENT_SECRET

    def _get_access_token(self) -> str:
        """Request a service-account access token from Keycloak."""
        token_url = f"{KEYCLOAK.server_url.rstrip('/')}/realms/{KEYCLOAK.realm}/protocol/openid-connect/token"

        response = httpx.post(
            token_url,
            data={
                "grant_type": "client_credentials",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
            },
            timeout=5.0,
        )
        response.raise_for_status()

        return response.json()["access_token"]

    def owner_has_stores(self, owner_id: str) -> bool:
        """Check whether an owner has stores; raise if the check fails."""
        token = self._get_access_token()

        response = httpx.get(
            f"{self.base_url}/owners/{owner_id}/exists",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5.0,
        )
        response.raise_for_status()

        return response.json()["has_stores"]
