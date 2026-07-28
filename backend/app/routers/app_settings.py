from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.app_settings import AppSettings
from app.schemas.app_settings import AppSettingsResponse

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("/", response_model=AppSettingsResponse)
def get_settings(response: Response, db: Session = Depends(get_db)):
    # Cache settings at CDN level for 1 hour with 1 minute stale-while-revalidate window
    response.headers["Cache-Control"] = (
        "public, max-age=3600, stale-while-revalidate=60"
    )
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
