import logging
from typing import Any, Dict, Optional

from app.db.base import ProjectRepository
from app.schemas.system_log import SystemLogCreate

logger = logging.getLogger("ResuMesh")


class LogService:
    @staticmethod
    async def log(
        log_provider: ProjectRepository,
        level: str,
        module: str,
        message: str,
        details: Optional[Dict[str, Any]] = None,
    ):
        """Havuz sistemine yeni bir log satırı ekler."""
        log_msg = f"[{module}] {message}"
        if level in ["ERROR", "CRITICAL"]:
            logger.error(log_msg)
        elif level == "WARNING":
            logger.warning(log_msg)
        else:
            logger.info(log_msg)

        try:
            log_entry = SystemLogCreate(
                level=level.upper(),
                module=module.upper(),
                message=message,
                details=details,
            )
            await log_provider.create_log(log_entry)
        except Exception as e:
            logger.critical(f"[SYSTEM] Log havuzuna yazılamadı! Hata: {str(e)}")

    @staticmethod
    async def info(
        log_provider: ProjectRepository,
        module: str,
        message: str,
        details: Optional[Dict[str, Any]] = None,
    ):
        await LogService.log(log_provider, "INFO", module, message, details)

    @staticmethod
    async def error(
        log_provider: ProjectRepository,
        module: str,
        message: str,
        details: Optional[Dict[str, Any]] = None,
    ):
        await LogService.log(log_provider, "ERROR", module, message, details)

    @staticmethod
    async def warning(
        log_provider: ProjectRepository,
        module: str,
        message: str,
        details: Optional[Dict[str, Any]] = None,
    ):
        await LogService.log(log_provider, "WARNING", module, message, details)
