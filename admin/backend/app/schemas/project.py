from datetime import datetime
from typing import Optional
from pydantic import ConfigDict
from resumesh_scrapers.models import GitHubRepositoryModel


class ProjectBase(GitHubRepositoryModel):
    name: Optional[str] = None
    title: Optional[str] = None

    def model_post_init(self, __context):
        if not self.name and self.title:
            self.name = self.title
        elif not self.title and self.name:
            self.title = self.name

    @property
    def stars(self) -> int:
        return self.stargazers_count

    @property
    def watchers(self) -> int:
        return self.watchers_count

    @property
    def forks(self) -> int:
        return self.forks_count

    @property
    def url(self) -> Optional[str]:
        return self.html_url


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
