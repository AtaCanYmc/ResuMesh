"""settings_store.py — Helper layer for the key-value app_settings table.

All access to application settings goes through this module so that the
storage format (key/value rows) is hidden from routers and business logic.

Usage
-----
    from app.services.settings_store import get_setting, set_setting, get_all_settings

    # Read a single setting (with an optional default)
    provider = get_setting(db, "llm_provider", default="mock")

    # Write a single setting
    set_setting(db, "llm_provider", "openai")

    # Read all settings as a plain dict {key: value}
    all_settings = get_all_settings(db)
"""

from typing import Any, Dict

from sqlalchemy.orm import Session

from app.models.app_settings import AppSetting

# ---------------------------------------------------------------------------
# Default values for every known setting key.
# Used when a row does not yet exist in the DB.
# ---------------------------------------------------------------------------
DEFAULT_SECTIONS: Dict[str, bool] = {
    "educations": True,
    "articles": True,
    "projects": True,
    "certificates": True,
    "videos": True,
    "experiences": True,
    "skills": True,
    "posts": True,
}

DEFAULT_SOCIALS: list[Dict[str, Any]] = [
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

DEFAULT_MARQUEE: list[str] = [
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

DEFAULT_EN: Dict[str, Any] = {
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

DEFAULT_TR: Dict[str, Any] = {
    "hero": {
        "name": "Ata Can",
        "fullName": "Ata Can Yaymacı",
        "avatarSubtitle": "Dijital deneyimler tasarlıyorum",
        "avatarImage": "/images/profile_pic.jpeg",
        "title": "Yapay Zeka İş Akışları ve Finansal Teknolojiler arasında köprü kuruyorum.",
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

DEFAULT_FOOTER: Dict[str, Any] = {"email": "atacanymc@gmail.com"}

DEFAULTS: Dict[str, Any] = {
    "sections": DEFAULT_SECTIONS,
    "socials": DEFAULT_SOCIALS,
    "footer": DEFAULT_FOOTER,
    "marquee": DEFAULT_MARQUEE,
    "en": DEFAULT_EN,
    "tr": DEFAULT_TR,
}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def get_setting(db: Session, key: str, default: Any = None) -> Any:
    """Return the value for *key*, or *default* if the row doesn't exist."""
    row = db.query(AppSetting).filter(AppSetting.key == key).first()
    if row is None:
        return DEFAULTS.get(key, default)
    return row.value


def set_setting(
    db: Session, key: str, value: Any, *, commit: bool = True
) -> AppSetting:
    """Upsert a single key-value pair.

    If *commit* is False the caller is responsible for committing the session
    (useful when batching multiple updates in one transaction).
    """
    row = db.query(AppSetting).filter(AppSetting.key == key).first()
    if row is None:
        row = AppSetting(key=key, value=value)
        db.add(row)
    else:
        row.value = value
    if commit:
        db.commit()
        db.refresh(row)
    return row


def get_all_settings(db: Session) -> Dict[str, Any]:
    """Return all settings as a flat {key: value} dict.

    Missing keys are filled in from DEFAULTS so callers always get a complete
    configuration even on a fresh database.
    """
    rows = db.query(AppSetting).all()
    stored = {row.key: row.value for row in rows}
    # Merge: stored values take precedence over defaults
    result = {**DEFAULTS, **stored}
    return result


def ensure_defaults(db: Session) -> None:
    """Insert any missing default settings into the database.

    Safe to call multiple times (idempotent); only inserts rows that don't
    already exist.
    """
    existing_keys = {row.key for row in db.query(AppSetting.key).all()}
    new_rows = [
        AppSetting(key=key, value=value)
        for key, value in DEFAULTS.items()
        if key not in existing_keys
    ]
    if new_rows:
        db.bulk_save_objects(new_rows)
        db.commit()
