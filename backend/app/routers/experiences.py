from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.dependencies import get_experience_repo
from app.db.repositories import IExperienceRepository
from app.schemas.experience import ExperienceResponse

router = APIRouter(prefix="/experiences", tags=["experiences"])


@router.get("/", response_model=List[ExperienceResponse])
async def get_experiences(
    skip: int = 0,
    limit: int = 100,
    provider: IExperienceRepository = Depends(get_experience_repo),
):
    try:
        experiences = await provider.get_all_experiences(skip=skip, limit=limit)
        return experiences
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
