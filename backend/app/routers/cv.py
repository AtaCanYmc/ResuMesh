from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile

from app.services.auth_service import get_current_admin
from app.services.supabase_storage import SupabaseStorageService

router = APIRouter(prefix="/cv", tags=["CV Storage"])


@router.post("/upload")
async def upload_cv(
    file: UploadFile = File(...), admin: dict = Depends(get_current_admin)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        storage = SupabaseStorageService()
        file_bytes = await file.read()
        filename = await storage.upload_cv(file.filename, file_bytes)
        public_url = storage.get_public_url(filename)
        return {
            "status": "success",
            "message": "CV uploaded successfully",
            "filename": filename,
            "url": public_url,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list")
async def list_cvs(admin: dict = Depends(get_current_admin)):
    try:
        storage = SupabaseStorageService()
        files = await storage.list_cvs()
        return {"status": "success", "files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{filename}")
async def get_cv(filename: str):
    try:
        storage = SupabaseStorageService()
        file_bytes = await storage.download_cv(filename)
        return Response(
            content=file_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"inline; filename={filename}"},
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"CV not found: {str(e)}")
