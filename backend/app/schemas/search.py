from typing import Optional

from pydantic import BaseModel


class SearchResponse(BaseModel):
    id: str
    type: str  # "project", "article", "experience", "certificate"
    title: str
    description: Optional[str] = None
    url: Optional[str] = None

    class Config:
        from_attributes = True
