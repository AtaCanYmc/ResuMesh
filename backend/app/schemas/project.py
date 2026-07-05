from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    github_url: Optional[HttpUrl] = None
    stars: int = 0
    watchers: int = 0
    forks: int = 0
    languages: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    raw_github_data: Optional[Dict[str, Any]] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
