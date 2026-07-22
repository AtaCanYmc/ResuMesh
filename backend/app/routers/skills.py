from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.skill import Skill
from app.schemas.skill import SkillResponse

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("/", response_model=List[SkillResponse])
def get_skills(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return (
        db.query(Skill)
        .order_by(Skill.category, Skill.name)
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{skill_id}", response_model=SkillResponse)
def get_skill(skill_id: str, db: Session = Depends(get_db)):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill
