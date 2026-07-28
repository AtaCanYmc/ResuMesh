import logging

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.config.settings import settings as app_settings
from app.llm.factory import reset_llm_client
from app.models.app_settings import AppSettings
from app.schemas.app_settings import (
    AppSettingsResponse,
    AppSettingsUpdate,
    LLMSettingsResponse,
)
from app.services.auth_service import SupabaseUser, get_current_admin

logger = logging.getLogger("settings")
router = APIRouter(prefix="/settings", tags=["Settings"])

DEFAULT_SOCIALS = [
    {
        "id": "github",
        "platform": "github",
        "url": "https://github.com/AtaCanYmc",
        "label": "GitHub",
    },
    {
        "id": "linkedin",
        "platform": "linkedin",
        "url": "https://www.linkedin.com/in/ata-can-yaymacı/",
        "label": "LinkedIn",
    },
    {
        "id": "devto",
        "platform": "devto",
        "url": "https://dev.to/atacanymc",
        "label": "Dev.to",
    },
    {
        "id": "medium",
        "platform": "medium",
        "url": "https://medium.com/@atacanymc",
        "label": "Medium",
    },
]
DEFAULT_FOOTER = {"email": "atacanymc@gmail.com"}
DEFAULT_MARQUEE = [
    "React.js",
    "Vite.js",
    "Java",
    "SpringBoot",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "PL/SQL",
    "C#",
    ".NET",
    "Supabase",
    "Firebase",
    "MongoDB",
    "Docker",
    "Node.js",
    "Next.js",
    "GraphQL",
]
DEFAULT_EN = {
    "hero": {
        "name": "Ata Can",
        "fullName": "Ata Can Yaymacı",
        "avatarSubtitle": "Crafting digital experiences",
        "avatarImage": "/images/profile_pic.jpeg",
        "title": "I bridge the gap between AI Workflows and Financial Technologies.",
        "description": (
            "With a Computer Engineering background from Dokuz Eylul University, "
            "I specialize in scalable backend architectures and automation processes. "
            "I transform complex data into meaningful insights "
            "using modern web technologies."
        ),
        "resumeLink": "/resumes/resume.pdf",
    },
    "metrics": [
        {
            "id": 1,
            "icon": "code",
            "value": "25+",
            "label": "Active Projects",
            "color": "blue",
        },
        {
            "id": 2,
            "icon": "book",
            "value": "40+",
            "label": "Technical Articles",
            "color": "indigo",
        },
        {
            "id": 3,
            "icon": "star",
            "value": "4+",
            "label": "Years Experience",
            "color": "purple",
        },
    ],
}
DEFAULT_TR = {
    "hero": {
        "name": "Ata Can",
        "fullName": "Ata Can Yaymacı",
        "avatarSubtitle": "Dijital deneyimler tasarlıyorum",
        "avatarImage": "/images/profile_pic.jpeg",
        "title": (
            "Yapay Zeka İş Akışları ve Finansal Teknolojiler "
            "arasında köprü kuruyorum."
        ),
        "description": (
            "Dokuz Eylül Üniversitesi Bilgisayar Mühendisliği geçmişimle, "
            "ölçeklenebilir backend mimarileri ve otomasyon süreçleri "
            "üzerine çalışıyorum. Modern web teknolojileriyle karmaşık verileri "
            "anlamlı içgörülere dönüştürüyorum."
        ),
        "resumeLink": "/resumes/resume.pdf",
    },
    "metrics": [
        {
            "id": 1,
            "icon": "code",
            "value": "25+",
            "label": "Aktif Proje",
            "color": "blue",
        },
        {
            "id": 2,
            "icon": "book",
            "value": "40+",
            "label": "Teknik Makale",
            "color": "indigo",
        },
        {
            "id": 3,
            "icon": "star",
            "value": "4+",
            "label": "Yıl Deneyim",
            "color": "purple",
        },
    ],
}


def _mask_key(key: str | None) -> str:
    """Return '***' if a non-empty key is stored, otherwise empty string."""
    if key and key.strip():
        return "***"
    return ""


def _build_llm_response(settings: AppSettings) -> LLMSettingsResponse:
    """Build the masked LLM config response from a DB settings object."""
    return LLMSettingsResponse(
        llm_provider=settings.llm_provider or "mock",
        openai_api_key=_mask_key(settings.openai_api_key),
        openai_model=settings.openai_model or "gpt-4o",
        groq_api_key=_mask_key(settings.groq_api_key),
        groq_model=settings.groq_model or "llama-3.3-70b-versatile",
        ollama_base_url=settings.ollama_base_url or "http://localhost:11434",
        ollama_model=settings.ollama_model or "llama3",
    )


def _build_response(settings: AppSettings) -> dict:
    """Build the full settings response dict, injecting masked llm_config."""
    return {
        "id": settings.id,
        "show_projects": settings.show_projects,
        "show_certificates": settings.show_certificates,
        "show_videos": settings.show_videos,
        "show_experiences": settings.show_experiences,
        "socials": settings.socials,
        "footer": settings.footer,
        "marquee": settings.marquee,
        "en": settings.en,
        "tr": settings.tr,
        "llm_config": _build_llm_response(settings),
    }


def _get_or_create_settings(db: Session) -> AppSettings:
    settings = db.query(AppSettings).first()
    if not settings:
        settings = AppSettings(
            show_projects=True,
            show_certificates=True,
            show_videos=True,
            show_experiences=True,
            socials=DEFAULT_SOCIALS,
            footer=DEFAULT_FOOTER,
            marquee=DEFAULT_MARQUEE,
            en=DEFAULT_EN,
            tr=DEFAULT_TR,
            llm_provider="mock",
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def trigger_redeploy_webhook():
    webhook_url = app_settings.DEPLOY_WEBHOOK_URL
    if not webhook_url:
        return

    logger.info(f"Triggering deploy webhook to {webhook_url} ...")
    try:
        response = httpx.post(webhook_url, timeout=10.0)
        logger.info(f"Deploy webhook response status code: {response.status_code}")
    except Exception as e:
        logger.error(f"Failed to trigger deploy webhook: {e}")


@router.get("/", response_model=AppSettingsResponse)
def get_settings(
    db: Session = Depends(get_db), admin: SupabaseUser = Depends(get_current_admin)
):
    settings = _get_or_create_settings(db)
    return _build_response(settings)


@router.patch("/", response_model=AppSettingsResponse)
def update_settings(
    payload: AppSettingsUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin: SupabaseUser = Depends(get_current_admin),
):
    settings = _get_or_create_settings(db)

    update_data = payload.dict(exclude_unset=True)

    # LLM fields that affect the cached client — collect before applying
    llm_fields = {
        "llm_provider",
        "openai_api_key",
        "openai_model",
        "groq_api_key",
        "groq_model",
        "ollama_base_url",
        "ollama_model",
    }
    llm_changed = bool(update_data.keys() & llm_fields)

    # Special handling: if the frontend sends "***" for a key field it means
    # "no change" (keep the existing stored key). Skip those fields.
    sentinel_fields = {"openai_api_key", "groq_api_key"}
    for field in sentinel_fields:
        if field in update_data and update_data[field] == "***":
            del update_data[field]

    for field, value in update_data.items():
        setattr(settings, field, value)

    db.commit()
    db.refresh(settings)

    # Reset the cached LLM client so the new provider/key is picked up immediately
    if llm_changed:
        reset_llm_client()
        logger.info("LLM client cache reset due to settings update.")

    if app_settings.DEPLOY_WEBHOOK_URL:
        background_tasks.add_task(trigger_redeploy_webhook)

    return _build_response(settings)
