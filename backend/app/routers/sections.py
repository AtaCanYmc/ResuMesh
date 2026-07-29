from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.dependencies import get_section_repo
from app.db.repositories import ISectionRepository
from app.schemas.section import SectionResponse

router = APIRouter(prefix="/sections", tags=["Sections"])


@router.get("/", response_model=List[SectionResponse])
def get_sections(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    section_repo: ISectionRepository = Depends(get_section_repo),
):
    return section_repo.get_sections(skip=skip, limit=limit, active_only=active_only)


@router.get("/{section_id_or_key}", response_model=SectionResponse)
def get_section(
    section_id_or_key: str,
    section_repo: ISectionRepository = Depends(get_section_repo),
):
    section = section_repo.get_section_by_id(
        section_id_or_key
    ) or section_repo.get_section_by_key(section_id_or_key)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section
