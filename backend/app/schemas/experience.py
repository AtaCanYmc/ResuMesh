from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class ExperienceBase(BaseModel):
    company_name: str
    title: str
    location: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    is_current: bool = False
    description: Optional[str] = None


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceResponse(ExperienceBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
