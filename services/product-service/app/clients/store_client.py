import httpx
from fastapi import HTTPException, status

from app.core.config import settings


async def user_owns_store(store_id: str, access_token: str) -> bool:
    url = f"{settings.store_service_url}/my-stores/{store_id}/ownership"

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                url,
                headers={"Authorization": f"Bearer {access_token}"},
            )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Store Service is unavailable",
        ) from exc

    if response.status_code in (401, 403):
        raise HTTPException(
            status_code=response.status_code,
            detail="Store ownership check was not authorised",
        )

    if response.status_code != status.HTTP_200_OK:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Store ownership check failed",
        )

    return response.json().get("owns_store", False) is True


async def get_store_id_by_slug(store_slug: str, access_token: str) -> str:
    url = f"{settings.store_service_url}/slug/{store_slug}"

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                url,
                headers={"Authorization": f"Bearer {access_token}"},
            )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Store Service is unavailable",
        ) from exc

    if response.status_code == status.HTTP_404_NOT_FOUND:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Store not found",
        )

    if response.status_code in (401, 403):
        raise HTTPException(
            status_code=response.status_code,
            detail="Store lookup was not authorised",
        )

    if response.status_code != status.HTTP_200_OK:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Store lookup failed",
        )

    return response.json()["id"]
