from typing import Annotated
from uuid import UUID

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.clients.store_client import user_owns_store
from app.core.config import settings

security = HTTPBearer()
jwks_client = jwt.PyJWKClient(settings.kc_jwks_url)


async def authenticate(
    credentials: Annotated[
        HTTPAuthorizationCredentials,
        Depends(security),
    ],
) -> dict:
    token = credentials.credentials

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=(f"{settings.kc_browser_server_url}/realms/{settings.kc_realm}"),
            audience=settings.kc_audience,
        )

    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token",
        ) from exc

    return payload


async def require_store_ownership(
    store_id: UUID,
    credentials: Annotated[
        HTTPAuthorizationCredentials,
        Depends(security),
    ],
    current_user: Annotated[dict, Depends(authenticate)],
) -> dict:
    roles = current_user.get("realm_access", {}).get("roles", [])

    if "store_owner" not in roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Store owner role required",
        )

    owns_store = await user_owns_store(
        store_id=str(store_id),
        access_token=credentials.credentials,
    )

    if not owns_store:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this store",
        )

    return current_user
