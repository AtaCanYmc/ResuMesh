from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, HttpUrl


class CertificateBase(BaseModel):
    name: str
    issuing_organization: Optional[str] = None
    issue_date: Optional[date] = None
    credential_id: Optional[str] = None
    credential_url: Optional[HttpUrl] = None


class CertificateCreate(CertificateBase):
    pass


class CertificateResponse(CertificateBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
