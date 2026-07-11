from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.education import Education
from app.schemas.education import EducationCreate, EducationResponse, EducationUpdate

router = APIRouter(prefix="/educations", tags=["Educations"])


@router.get("/", response_model=List[EducationResponse])
def get_educations(db: Session = Depends(get_db)):
    return db.query(Education).order_by(Education.start_date.desc()).all()


@router.get("/{education_id}", response_model=EducationResponse)
def get_education(education_id: str, db: Session = Depends(get_db)):
    education = db.query(Education).filter(Education.id == education_id).first()
    if not education:
        raise HTTPException(status_code=404, detail="Education not found")
    return education


@router.post("/", response_model=EducationResponse)
def create_education(education: EducationCreate, db: Session = Depends(get_db)):
    db_education = Education(**education.model_dump())
    db.add(db_education)
    db.commit()
    db.refresh(db_education)
    return db_education


@router.put("/{education_id}", response_model=EducationResponse)
def update_education(
    education_id: str, education: EducationUpdate, db: Session = Depends(get_db)
):
    db_education = db.query(Education).filter(Education.id == education_id).first()
    if not db_education:
        raise HTTPException(status_code=404, detail="Education not found")

    update_data = education.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_education, key, value)

    db.commit()
    db.refresh(db_education)
    return db_education


@router.delete("/{education_id}")
def delete_education(education_id: str, db: Session = Depends(get_db)):
    db_education = db.query(Education).filter(Education.id == education_id).first()
    if not db_education:
        raise HTTPException(status_code=404, detail="Education not found")
    db.delete(db_education)
    db.commit()
    return {"message": "Education deleted successfully"}
