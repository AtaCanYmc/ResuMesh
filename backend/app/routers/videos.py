from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.dependencies import get_video_repo
from app.db.repositories import IVideoRepository
from app.schemas.video import VideoResponse

router = APIRouter(prefix="/videos", tags=["videos"])


@router.get("/", response_model=List[VideoResponse])
async def get_videos(
    skip: int = 0,
    limit: int = 100,
    provider: IVideoRepository = Depends(get_video_repo),
):
    return await provider.get_videos(skip=skip, limit=limit)


@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(
    video_id: str, provider: IVideoRepository = Depends(get_video_repo)
):
    video = await provider.get_video_by_id(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video
