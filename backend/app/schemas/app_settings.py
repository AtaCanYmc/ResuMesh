from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class AppSettingsBase(BaseModel):
    sections: Optional[List[Dict[str, Any]]] = None
    socials: Optional[List[Dict[str, Any]]] = None
    footer: Optional[Dict[str, Any]] = None
    marquee: Optional[List[str]] = None
    en: Optional[Dict[str, Any]] = None
    tr: Optional[Dict[str, Any]] = None


class AppSettingsCreate(AppSettingsBase):
    pass


class AppSettingsUpdate(BaseModel):
    sections: Optional[List[Dict[str, Any]]] = None
    socials: Optional[List[Dict[str, Any]]] = None
    footer: Optional[Dict[str, Any]] = None
    marquee: Optional[List[str]] = None
    en: Optional[Dict[str, Any]] = None
    tr: Optional[Dict[str, Any]] = None


class AppSettingsResponse(AppSettingsBase):
    id: int

    class Config:
        from_attributes = True
