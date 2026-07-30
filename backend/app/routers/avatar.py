import mimetypes

from fastapi import APIRouter, Depends, HTTPException, Response

from app.services.supabase_storage import SupabaseStorageService
from app.services.telemetry_service import get_telemetry_data, telemetry

router = APIRouter(prefix="/avatar", tags=["Avatar Storage"])


@router.get("/{filename}")
async def get_avatar(filename: str, telemetry_ctx: dict = Depends(get_telemetry_data)):
    try:
        storage = SupabaseStorageService()
        file_bytes = await storage.download_avatar(filename)

        content_type, _ = mimetypes.guess_type(filename)
        if not content_type:
            content_type = "image/jpeg"

        telemetry_ctx["background_tasks"].add_task(
            telemetry.capture_event,
            distinct_id=telemetry_ctx["ip"],
            event_name="avatar_viewed",
            properties={
                "filename": filename,
                "ip": telemetry_ctx["ip"],
                "user_agent": telemetry_ctx["ua"],
                "url": telemetry_ctx["url"],
            },
        )
        return Response(
            content=file_bytes,
            media_type=content_type,
            headers={"Cache-Control": "public, max-age=86400"},
        )
    except Exception as e:
        if filename in ["profile_pic.jpeg", "profile_pic.jpg", "profile_pic.png"]:
            from fastapi.responses import RedirectResponse

            return RedirectResponse(url="/images/profile_pic.jpeg", status_code=307)
        raise HTTPException(
            status_code=404, detail=f"Profile picture not found: {str(e)}"
        )


@router.get("/{filename}/url")
async def get_avatar_url(
    filename: str, telemetry_ctx: dict = Depends(get_telemetry_data)
):
    try:
        storage = SupabaseStorageService()
        public_url = storage.get_avatar_public_url(filename)
        return {"filename": filename, "url": public_url}
    except Exception as e:
        raise HTTPException(
            status_code=404, detail=f"Failed to get avatar URL: {str(e)}"
        )
