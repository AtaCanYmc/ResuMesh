from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.education import Education
from app.schemas.education import EducationCreate, EducationResponse, EducationUpdate
from app.services.auth_service import get_current_admin
from app.services.telemetry_service import get_telemetry_data, telemetry

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


@router.post("/", response_model=EducationResponse)
def create_education(
    education: EducationCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
    telemetry_ctx: dict = Depends(get_telemetry_data),
):
    db_education = Education(**education.model_dump())
    db.add(db_education)
    db.commit()
    db.refresh(db_education)
    telemetry_ctx["background_tasks"].add_task(
        telemetry.capture_event,
        distinct_id=telemetry_ctx["ip"],
        event_name="education_created",
        properties={
            "education_id": db_education.id,
            "school": db_education.school,
            "degree": db_education.degree,
            "ip": telemetry_ctx["ip"],
            "user_agent": telemetry_ctx["ua"],
        },
    )
    return db_education


@router.put("/{education_id}", response_model=EducationResponse)
def update_education(
    education_id: str,
    education: EducationUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
    telemetry_ctx: dict = Depends(get_telemetry_data),
):
    db_education = db.query(Education).filter(Education.id == education_id).first()
    if not db_education:
        raise HTTPException(status_code=404, detail="Education not found")

    update_data = education.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_education, key, value)

    db.commit()
    db.refresh(db_education)
    telemetry_ctx["background_tasks"].add_task(
        telemetry.capture_event,
        distinct_id=telemetry_ctx["ip"],
        event_name="education_updated",
        properties={
            "education_id": education_id,
            "school": db_education.school,
            "degree": db_education.degree,
            "ip": telemetry_ctx["ip"],
            "user_agent": telemetry_ctx["ua"],
        },
    )
    return db_education


@router.delete("/{education_id}")
def delete_education(
    education_id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
    telemetry_ctx: dict = Depends(get_telemetry_data),
):
    db_education = db.query(Education).filter(Education.id == education_id).first()
    if not db_education:
        raise HTTPException(status_code=404, detail="Education not found")
    db.delete(db_education)
    db.commit()
    telemetry_ctx["background_tasks"].add_task(
        telemetry.capture_event,
        distinct_id=telemetry_ctx["ip"],
        event_name="education_deleted",
        properties={
            "education_id": education_id,
            "school": db_education.school,
            "degree": db_education.degree,
            "ip": telemetry_ctx["ip"],
            "user_agent": telemetry_ctx["ua"],
        },
    )
    return {"message": "Education deleted successfully"}
