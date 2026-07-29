from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.dependencies import get_social_link_repo
from app.db.repositories import ISocialLinkRepository
from app.schemas.social_link import SocialLinkResponse

router = APIRouter(prefix="/social-links", tags=["Social Links"])


@router.get("/", response_model=List[SocialLinkResponse])
def get_social_links(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    social_link_repo: ISocialLinkRepository = Depends(get_social_link_repo),
):
    return social_link_repo.get_social_links(
        skip=skip, limit=limit, active_only=active_only
    )


@router.get("/{social_link_id}", response_model=SocialLinkResponse)
def get_social_link(
    social_link_id: str,
    social_link_repo: ISocialLinkRepository = Depends(get_social_link_repo),
):
    social_link = social_link_repo.get_social_link_by_id(social_link_id)
    if not social_link:
        raise HTTPException(status_code=404, detail="Social link not found")
    return social_link
