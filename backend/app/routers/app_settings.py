from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.app_settings import AppSettingsResponse
from app.services.settings_store import get_all_settings

router = APIRouter(prefix="/settings", tags=["Settings"])


def _build_response(raw: dict) -> dict:
    """Convert the flat KV dict to the structured API response."""
    return {
        "id": 1,  # Kept for schema compatibility (not meaningful in KV model)
        "sections": raw.get("sections"),
        "socials": raw.get("socials"),
        "footer": raw.get("footer"),
        "marquee": raw.get("marquee"),
        "en": raw.get("en"),
        "tr": raw.get("tr"),
    }


@router.get("/", response_model=AppSettingsResponse)
def get_settings(response: Response, db: Session = Depends(get_db)):
    # Cache settings at CDN level for 1 hour with 1-minute stale-while-revalidate
    response.headers["Cache-Control"] = (
        "public, max-age=3600, stale-while-revalidate=60"
    )
    raw = get_all_settings(db)
    return _build_response(raw)
