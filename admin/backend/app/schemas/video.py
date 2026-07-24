from datetime import datetime
from typing import Optional

from pydantic import BaseModel, HttpUrl


class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    platform: str
    url: HttpUrl
    thumbnail: Optional[HttpUrl] = None
    profile: str


class VideoCreate(VideoBase):
    pass


class VideoUpdate(VideoBase):
    pass


class VideoResponse(VideoBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
