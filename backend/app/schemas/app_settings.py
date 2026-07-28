from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class AppSettingsBase(BaseModel):
    show_projects: bool = True
    show_certificates: bool = True
    show_videos: bool = True
    show_experiences: bool = True

    # Content columns
    socials: Optional[List[Dict[str, Any]]] = None
    footer: Optional[Dict[str, Any]] = None
    marquee: Optional[List[str]] = None
    en: Optional[Dict[str, Any]] = None
    tr: Optional[Dict[str, Any]] = None


class AppSettingsCreate(AppSettingsBase):
    pass


class AppSettingsUpdate(BaseModel):
    show_projects: Optional[bool] = None
    show_certificates: Optional[bool] = None
    show_videos: Optional[bool] = None
    show_experiences: Optional[bool] = None

    socials: Optional[List[Dict[str, Any]]] = None
    footer: Optional[Dict[str, Any]] = None
    marquee: Optional[List[str]] = None
    en: Optional[Dict[str, Any]] = None
    tr: Optional[Dict[str, Any]] = None


class AppSettingsResponse(AppSettingsBase):
    id: int

    class Config:
        from_attributes = True
