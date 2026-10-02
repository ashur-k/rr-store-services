import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

security = HTTPBearer()

jwks_client = jwt.PyJWKClient(settings.kc_jwks_url)


async def authenticate(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    token = credentials.credentials

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=f"{settings.kc_browser_server_url}/realms/{settings.kc_realm}",
            audience=settings.kc_audience,
        )
    except jwt.PyJWTError as exc:
        print(f"JWT verification error: {type(exc).__name__}: {exc}")

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token",
        ) from exc

    return payload