import os

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session

from app.config.security import SecurityUtils
from app.db.dependencies import get_db
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
    db: Session = Depends(get_db),
):
    enabled = os.getenv("ENABLE_ADMIN_WORKSPACE", "false").lower() in (
        "true",
        "1",
        "yes",
    )
    if not enabled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Admin panel operations are disabled "
                "on this environment/instance to save resources."
            ),
        )

    # In test mode or fallback
    # when Supabase URL/Key is not set, allow checking the database
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")

    if not supabase_url or not supabase_key:
        user = db.query(User).filter(User.username == form_data.username).first()
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
    else:
        # Proxy token request directly to Supabase Auth
        async with httpx.AsyncClient() as client:
            try:
                res = await client.post(
                    f"{supabase_url}/auth/v1/token?grant_type=password",
                    json={"email": form_data.username, "password": form_data.password},
                    headers={
                        "apikey": supabase_key,
                        "Content-Type": "application/json",
                    },
                )
                if res.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Incorrect username or password",
                        headers={"WWW-Authenticate": "Bearer"},
                    )
                data = res.json()
                access_token = data.get("access_token")
            except Exception as e:
                # If Supabase connection fails
                # but username matches local DB / test settings
                user = (
                    db.query(User).filter(User.username == form_data.username).first()
                )
                if user and SecurityUtils.verify_password(
                    form_data.password, user.password_hash
                ):
                    access_token = SecurityUtils.create_access_token(
                        data={"sub": user.username, "role": user.role}
                    )
                else:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail=f"Supabase login failed: {str(e)}",
                        headers={"WWW-Authenticate": "Bearer"},
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
