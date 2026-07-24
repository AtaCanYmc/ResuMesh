from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.dependencies import get_post_repo
from app.db.repositories import IPostRepository
from app.schemas.post import PostResponse

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("/", response_model=List[PostResponse])
async def get_posts(
    skip: int = 0,
    limit: int = 100,
    provider: IPostRepository = Depends(get_post_repo),
):
    return await provider.get_posts(skip=skip, limit=limit)


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: str, provider: IPostRepository = Depends(get_post_repo)):
    post = await provider.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post
