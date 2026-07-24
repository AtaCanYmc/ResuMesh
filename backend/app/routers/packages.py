from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.db.dependencies import get_package_repo
from app.db.repositories import IPackageRepository
from app.schemas.package import PackageResponse

router = APIRouter(prefix="/packages", tags=["packages"])


@router.get("/", response_model=List[PackageResponse])
async def get_packages(
    skip: int = 0,
    limit: int = 100,
    provider: IPackageRepository = Depends(get_package_repo),
):
    return await provider.get_packages(skip=skip, limit=limit)


@router.get("/{package_id}", response_model=PackageResponse)
async def get_package(
    package_id: str, provider: IPackageRepository = Depends(get_package_repo)
):
    package = await provider.get_package_by_id(package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return package
