from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.education import Education
from app.schemas.education import EducationResponse

router = APIRouter(prefix="/educations", tags=["Educations"])


@router.get("/", response_model=List[EducationResponse])
def get_educations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return (
        db.query(Education)
        .order_by(Education.start_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{education_id}", response_model=EducationResponse)
def get_education(education_id: str, db: Session = Depends(get_db)):
    education = db.query(Education).filter(Education.id == education_id).first()
    if not education:
        raise HTTPException(status_code=404, detail="Education not found")
    return education
