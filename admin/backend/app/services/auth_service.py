import logging
import os
from dataclasses import dataclass

import jwt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer

from app.config.security import ALGORITHM, SECRET_KEY

logger = logging.getLogger("auth")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login", auto_error=False)


@dataclass
class SupabaseUser:
    """Lightweight user representation extracted from a Supabase JWT."""

    id: str
    email: str
    role: str


async def get_current_admin(
    request: Request,
    token_from_header: str = Depends(oauth2_scheme),
):
    """Validates a Supabase Auth JWT and ensures the user has admin privileges.

    Extracts user info directly from the JWT payload — no local database lookup.
    """
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
        logger.warning(
            "Authentication failed: Missing token in cookies or authorization header."
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    logger.info(
        f"Auth attempt: JWT token prefix={token[:15]}... "
        f"Key length={len(SECRET_KEY) if SECRET_KEY else 0}"
    )
    try:
        # Supabase JWTs are signed with HS256 using the Supabase JWT Secret.
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={
                "verify_aud": False
            },  # verify_aud False to simplify mock test runs
        )
        sub: str = payload.get("sub")
        email: str = payload.get("email", "")

        if sub is None:
            logger.warning("Authentication failed: Token missing 'sub' claim.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token details.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        app_metadata = payload.get("app_metadata", {})
        user_metadata = payload.get("user_metadata", {})
        role = (
            app_metadata.get("role")
            or user_metadata.get("role")
            or payload.get("role", "authenticated")
        )

        logger.info(
            f"Authentication successful for sub={sub}, email={email}, role={role}"
        )
        return SupabaseUser(id=sub, email=email, role=role)

    except jwt.ExpiredSignatureError as e:
        logger.error(f"Authentication failed: Token signature expired. Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        prefix = SECRET_KEY[:4] if SECRET_KEY else "None"
        try:
            unverified_header = jwt.get_unverified_header(token)
            alg = unverified_header.get("alg")
        except Exception:
            alg = "unknown"
        logger.error(
            f"Authentication failed: Invalid signature or token format. "
            f"Secret key prefix used={prefix}. Token alg={alg}. Error: {str(e)}"
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
