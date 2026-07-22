from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.base import ICertificateRepository
from app.db.dependencies import get_certificate_repo
from app.schemas.certificate import CertificateResponse

router = APIRouter(prefix="/certificates", tags=["certificates"])


@router.get("/", response_model=List[CertificateResponse])
async def get_certificates(
    skip: int = 0,
    limit: int = 100,
    provider: ICertificateRepository = Depends(get_certificate_repo),
):
    try:
        certificates = await provider.get_all_certificates(skip=skip, limit=limit)
        return certificates
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
