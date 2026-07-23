from abc import ABC, abstractmethod
from typing import List, Optional

from app.schemas.education import EducationCreate, EducationResponse, EducationUpdate


class IEducationRepository(ABC):
    @abstractmethod
    def get_educations(
        self, skip: int = 0, limit: int = 100
    ) -> List[EducationResponse]:
        pass

    @abstractmethod
    def get_education_by_id(self, education_id: str) -> Optional[EducationResponse]:
        pass

    @abstractmethod
    def create_education(self, education: EducationCreate) -> EducationResponse:
        pass

    @abstractmethod
    def update_education(
        self, education_id: str, education: EducationUpdate
    ) -> Optional[EducationResponse]:
        pass

    @abstractmethod
    def delete_education(self, education_id: str) -> bool:
        pass
