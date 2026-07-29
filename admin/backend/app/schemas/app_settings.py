from pydantic import BaseModel
from typing import Any, Dict, List, Optional, Union


class AppSettingsBase(BaseModel):
    sections: Optional[Union[Dict[str, Any], List[Dict[str, Any]]]] = None
    socials: Optional[List[Dict[str, Any]]] = None
    footer: Optional[Dict[str, Any]] = None
    marquee: Optional[List[str]] = None
    en: Optional[Dict[str, Any]] = None
    tr: Optional[Dict[str, Any]] = None


class AppSettingsCreate(AppSettingsBase):
    pass


class AppSettingsUpdate(BaseModel):
    """All fields optional — send only what you want to change."""

    sections: Optional[Union[Dict[str, Any], List[Dict[str, Any]]]] = None
    socials: Optional[List[Dict[str, Any]]] = None
    footer: Optional[Dict[str, Any]] = None
    marquee: Optional[List[str]] = None
    en: Optional[Dict[str, Any]] = None
    tr: Optional[Dict[str, Any]] = None


class AppSettingsResponse(AppSettingsBase):
    """The response shape is identical to the old wide-table response.

    The frontend does not need to know about the underlying KV storage.
    """

    class Config:
        from_attributes = True
