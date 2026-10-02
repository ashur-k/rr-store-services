from app.core.authentication import authenticate
from fastapi import APIRouter, Depends

router = APIRouter()


@router.get("/health")
async def health_check(current_user: dict = Depends(authenticate)):
    return {"status": "ok"}