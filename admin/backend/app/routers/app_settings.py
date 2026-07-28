import logging

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.config.settings import settings as app_settings
from app.models.app_settings import AppSettings
from app.schemas.app_settings import AppSettingsResponse, AppSettingsUpdate
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
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.patch("/", response_model=AppSettingsResponse)
def update_settings(
    payload: AppSettingsUpdate,
    background_tasks: BackgroundTasks,
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
            socials=DEFAULT_SOCIALS,
            footer=DEFAULT_FOOTER,
            marquee=DEFAULT_MARQUEE,
            en=DEFAULT_EN,
            tr=DEFAULT_TR,
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)

    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)

    db.commit()
    db.refresh(settings)

    if app_settings.DEPLOY_WEBHOOK_URL:
        background_tasks.add_task(trigger_redeploy_webhook)

    return settings
