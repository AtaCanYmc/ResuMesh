from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config.security import SecurityUtils
from app.config.settings import settings
from app.db.base import IUserRepository
from app.db.dependencies import get_user_repo
from app.models.user import User
from app.services.auth_service import get_current_admin

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
@limiter.limit("5/minute")
async def login_for_access_token(
    request: Request,
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    user_repo: IUserRepository = Depends(get_user_repo),
):
    if not settings.ENABLE_ADMIN_WORKSPACE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Admin panel operations are disabled "
                "on this environment/instance to save resources."
            ),
        )

    user = user_repo.get_user_by_username(form_data.username)
    if not user or not SecurityUtils.verify_password(
        form_data.password, user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = SecurityUtils.create_access_token(
        data={"sub": user.username, "role": user.role}
    )

    # Set HTTPOnly secure cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=1800,  # 30 minutes
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Successfully logged out"}


@router.get("/verify")
async def verify_token(current_admin: User = Depends(get_current_admin)):
    return {"username": current_admin.username, "role": current_admin.role}
