from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.base import ICertificateRepository
from app.db.dependencies import get_certificate_repo
from app.schemas.certificate import CertificateCreate, CertificateResponse

router = APIRouter(prefix="/certificates", tags=["certificates"])


@router.post("/", response_model=CertificateResponse)
async def create_certificate(
    certificate: CertificateCreate,
    provider: ICertificateRepository = Depends(get_certificate_repo),
):
    try:
        result = await provider.create_certificate(certificate)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[CertificateResponse])
async def get_certificates(
    provider: ICertificateRepository = Depends(get_certificate_repo),
):
    try:
        certificates = await provider.get_all_certificates()
        return certificates
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
