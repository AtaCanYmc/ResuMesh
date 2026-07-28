"""settings_store.py — Read-only helper for the key-value app_settings table.

The public backend only reads settings; writes happen via the admin backend.
"""

from typing import Any, Dict

from sqlalchemy.orm import Session

from app.models.app_settings import AppSetting

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


def get_setting(db: Session, key: str, default: Any = None) -> Any:
    row = db.query(AppSetting).filter(AppSetting.key == key).first()
    if row is None:
        return DEFAULTS.get(key, default)
    return row.value


def get_all_settings(db: Session) -> Dict[str, Any]:
    rows = db.query(AppSetting).all()
    stored = {row.key: row.value for row in rows}
    return {**DEFAULTS, **stored}
