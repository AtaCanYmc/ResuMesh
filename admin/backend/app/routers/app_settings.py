from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.app_settings import AppSettings
from app.schemas.app_settings import AppSettingsResponse, AppSettingsUpdate
from app.services.auth_service import SupabaseUser, get_current_admin

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("/", response_model=AppSettingsResponse)
def get_settings(
    db: Session = Depends(get_db), admin: SupabaseUser = Depends(get_current_admin)
):
    settings = db.query(AppSettings).first()
    if not settings:
        settings = AppSettings(
            show_projects=True,
            show_certificates=True,
            show_videos=True,
            show_experiences=True,
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.patch("/", response_model=AppSettingsResponse)
def update_settings(
    payload: AppSettingsUpdate,
    db: Session = Depends(get_db),
    admin: SupabaseUser = Depends(get_current_admin),
):
    settings = db.query(AppSettings).first()
    if not settings:
        settings = AppSettings(
            show_projects=True,
            show_certificates=True,
            show_videos=True,
            show_experiences=True,
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)

    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)

    db.commit()
    db.refresh(settings)
    return settings
