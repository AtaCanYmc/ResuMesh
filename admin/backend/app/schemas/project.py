from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


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
    created_at: Optional[datetime] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
