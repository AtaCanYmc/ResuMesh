from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.dependencies import get_education_repo
from app.db.repositories import IEducationRepository
from app.schemas.education import EducationResponse

router = APIRouter(prefix="/educations", tags=["Educations"])


@router.get("/", response_model=List[EducationResponse])
def get_educations(
    skip: int = 0,
    limit: int = 100,
    education_repo: IEducationRepository = Depends(get_education_repo),
):
    return education_repo.get_educations(skip=skip, limit=limit)


@router.get("/{education_id}", response_model=EducationResponse)
def get_education(
    education_id: str,
    education_repo: IEducationRepository = Depends(get_education_repo),
):
    education = education_repo.get_education_by_id(education_id)
    if not education:
        raise HTTPException(status_code=404, detail="Education not found")
    return education
