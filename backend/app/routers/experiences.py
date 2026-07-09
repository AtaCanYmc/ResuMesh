from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.base import IExperienceRepository
from app.db.dependencies import get_experience_repo
from app.schemas.experience import (
    ExperienceCreate,
    ExperienceResponse,
    ExperienceUpdate,
)

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


@router.put("/{experience_id}", response_model=ExperienceResponse)
async def update_experience(
    experience_id: str,
    experience: ExperienceUpdate,
    provider: IExperienceRepository = Depends(get_experience_repo),
):
    updated = await provider.update_experience(experience_id, experience)
    if not updated:
        raise HTTPException(status_code=404, detail="Experience not found")
    return updated


@router.delete("/{experience_id}")
async def delete_experience(
    experience_id: str, provider: IExperienceRepository = Depends(get_experience_repo)
):
    deleted = await provider.delete_experience(experience_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"status": "success"}
