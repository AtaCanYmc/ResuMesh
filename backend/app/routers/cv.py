from fastapi import APIRouter, Depends, HTTPException, Response

from app.services.supabase_storage import SupabaseStorageService
from app.services.telemetry_service import get_telemetry_data, telemetry

router = APIRouter(prefix="/cv", tags=["CV Storage"])


@router.get("/{filename}")
async def get_cv(filename: str, telemetry_ctx: dict = Depends(get_telemetry_data)):
    try:
        storage = SupabaseStorageService()
        file_bytes = await storage.download_cv(filename)
        telemetry_ctx["background_tasks"].add_task(
            telemetry.capture_event,
            distinct_id=telemetry_ctx["ip"],
            event_name="cv_downloaded",
            properties={
                "filename": filename,
                "format": "pdf",
                "ip": telemetry_ctx["ip"],
                "user_agent": telemetry_ctx["ua"],
                "url": telemetry_ctx["url"],
            },
        )
        return Response(
            content=file_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"inline; filename={filename}"},
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"CV not found: {str(e)}")
