from fastapi import APIRouter, Depends

from app.core.authentication import authenticate

router = APIRouter()


@router.get("/health")
async def health_check(current_user: dict = Depends(authenticate)):
    return {"status": "ok"}