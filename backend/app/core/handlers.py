from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.exceptions import DomainException


async def domain_exception_handler(request: Request, exc: DomainException):
    """
    Global exception handler for DomainException and its subclasses.
    Converts domain exceptions into standardized JSON responses.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message, "error_type": exc.__class__.__name__},
    )


def setup_exception_handlers(app):
    """Registers custom exception handlers with the FastAPI app."""
    app.add_exception_handler(DomainException, domain_exception_handler)
