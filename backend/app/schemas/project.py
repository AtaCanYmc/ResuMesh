from datetime import datetime

from pydantic import ConfigDict
from resumesh_scrapers.models import GitHubRepositoryModel


class ProjectBase(GitHubRepositoryModel):
    @property
    def title(self) -> str:
        return self.name


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
