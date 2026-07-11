import logging

from fastapi import BackgroundTasks, Request
from posthog import Posthog

from app.config.settings import settings

logger = logging.getLogger("ResuMesh")


class TelemetryService:
    def __init__(self):
        self.api_key = settings.POSTHOG_API_KEY
        self.host = settings.POSTHOG_HOST
        self.client = None

        if self.api_key:
            try:
                self.client = Posthog(project_api_key=self.api_key, host=self.host)
                logger.info("[TELEMETRY] PostHog telemetry initialized successfully.")
            except Exception as e:
                logger.error(f"[TELEMETRY] Failed to initialize PostHog: {str(e)}")
        else:
            logger.warning(
                "[TELEMETRY] PostHog API Key not set. Telemetry is disabled."
            )

    def capture_event(self, distinct_id: str, event_name: str, properties: dict = None):
        if self.client:
            try:
                self.client.capture(
                    distinct_id=distinct_id,
                    event=event_name,
                    properties=properties or {},
                )
            except Exception as e:
                logger.error(
                    f"[TELEMETRY] Failed to capture event '{event_name}': {str(e)}"
                )
        else:
            # Silent fallback when not configured
            pass


# Singleton instance
telemetry = TelemetryService()


async def get_telemetry_data(request: Request, background_tasks: BackgroundTasks):
    """Dependency to extract telemetry metadata and background task scheduler

    from the current request.
    """
    return {
        "ip": request.client.host if request.client else "unknown",
        "ua": request.headers.get("user-agent", "unknown"),
        "background_tasks": background_tasks,
        "url": request.url,
        "language": request.headers.get("language", "unknown"),
    }
