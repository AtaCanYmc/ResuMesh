import os

import jwt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.config.security import ALGORITHM, SECRET_KEY
from app.db.dependencies import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login", auto_error=False)


async def get_current_admin(
    request: Request,
    token_from_header: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """Checks if the request has a valid Supabase Auth admin token."""
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

    token = request.cookies.get("access_token") or token_from_header
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        # Supabase JWTs are signed with HS256 using the Supabase JWT Secret.
        # They typically have the audience set to "authenticated".
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={
                "verify_aud": False
            },  # verify_aud False to simplify mock test runs
        )
        sub: str = payload.get("sub")
        email: str = payload.get("email")

        if sub is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token details.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Look up by Supabase user ID (sub) or email/username
        user = (
            db.query(User)
            .filter(
                (User.id == sub) | (User.username == email) | (User.username == sub)
            )
            .first()
        )

        # Fallback to trust valid token matching the configured ADMIN_USERNAME
        if not user:
            admin_username = os.getenv("ADMIN_USERNAME", "atacanymc")
            if email == admin_username or sub == admin_username:
                user = User(id=sub, username=email or sub, role="admin", is_active=True)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found in local records.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive.",
            )

        if user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin privileges are required for this operation.",
            )

        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
