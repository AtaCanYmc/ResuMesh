from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.dependencies import get_skill_repo
from app.db.repositories import ISkillRepository
from app.schemas.skill import SkillResponse

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("/", response_model=List[SkillResponse])
def get_skills(
    skip: int = 0,
    limit: int = 100,
    skill_repo: ISkillRepository = Depends(get_skill_repo),
):
    return skill_repo.get_skills(skip=skip, limit=limit)


@router.get("/{skill_id}", response_model=SkillResponse)
def get_skill(
    skill_id: str,
    skill_repo: ISkillRepository = Depends(get_skill_repo),
):
    skill = skill_repo.get_skill_by_id(skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill
