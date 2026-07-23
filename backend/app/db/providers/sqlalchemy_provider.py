from typing import List, Optional

from sqlalchemy.orm import Session

from app.db.base import IEducationRepository, ISkillRepository
from app.models.education import Education
from app.models.skill import Skill
from app.schemas.education import EducationCreate, EducationResponse, EducationUpdate
from app.schemas.skill import SkillCreate, SkillResponse, SkillUpdate


class SQLAlchemyEducationRepository(IEducationRepository):
    def __init__(self, db: Session):
        self.db = db

    def get_educations(
        self, skip: int = 0, limit: int = 100
    ) -> List[EducationResponse]:
        return (
            self.db.query(Education)
            .order_by(Education.start_date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_education_by_id(self, education_id: str) -> Optional[EducationResponse]:
        return self.db.query(Education).filter(Education.id == education_id).first()

    def create_education(self, education: EducationCreate) -> EducationResponse:
        db_education = Education(**education.model_dump())
        self.db.add(db_education)
        self.db.commit()
        self.db.refresh(db_education)
        return db_education

    def update_education(
        self, education_id: str, education: EducationUpdate
    ) -> Optional[EducationResponse]:
        db_education = self.get_education_by_id(education_id)
        if not db_education:
            return None

        update_data = education.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_education, key, value)

        self.db.commit()
        self.db.refresh(db_education)
        return db_education

    def delete_education(self, education_id: str) -> bool:
        db_education = self.get_education_by_id(education_id)
        if not db_education:
            return False
        self.db.delete(db_education)
        self.db.commit()
        return True


class SQLAlchemySkillRepository(ISkillRepository):
    def __init__(self, db: Session):
        self.db = db

    def get_skills(self, skip: int = 0, limit: int = 100) -> List[SkillResponse]:
        return (
            self.db.query(Skill)
            .order_by(Skill.category, Skill.name)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_skill_by_id(self, skill_id: str) -> Optional[SkillResponse]:
        return self.db.query(Skill).filter(Skill.id == skill_id).first()

    def create_skill(self, skill: SkillCreate) -> SkillResponse:
        db_skill = Skill(**skill.model_dump())
        self.db.add(db_skill)
        self.db.commit()
        self.db.refresh(db_skill)
        return db_skill

    def update_skill(
        self, skill_id: str, skill: SkillUpdate
    ) -> Optional[SkillResponse]:
        db_skill = self.get_skill_by_id(skill_id)
        if not db_skill:
            return None

        update_data = skill.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_skill, key, value)

        self.db.commit()
        self.db.refresh(db_skill)
        return db_skill

    def delete_skill(self, skill_id: str) -> bool:
        db_skill = self.get_skill_by_id(skill_id)
        if not db_skill:
            return False
        self.db.delete(db_skill)
        self.db.commit()
        return True
