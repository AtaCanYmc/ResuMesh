from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.base import IExperienceRepository
from app.db.dependencies import get_experience_repo
from app.schemas.experience import ExperienceCreate, ExperienceResponse

router = APIRouter(prefix="/experiences", tags=["experiences"])


@router.post("/", response_model=ExperienceResponse)
async def create_experience(
    experience: ExperienceCreate,
    provider: IExperienceRepository = Depends(get_experience_repo),
):
    try:
        result = await provider.create_experience(experience)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[ExperienceResponse])
async def get_experiences(
    provider: IExperienceRepository = Depends(get_experience_repo),
):
    try:
        experiences = await provider.get_all_experiences()
        return experiences
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
