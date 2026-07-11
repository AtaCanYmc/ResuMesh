import os

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.db.dependencies import get_article_repo, get_project_repo, get_system_log_repo
from app.services.ingestion_service import IngestionService
from app.services.log_service import LogService

scheduler = AsyncIOScheduler()


async def nightly_data_sync_job():
    """Main task that updates data in the background every night."""
    project_provider = get_project_repo()
    article_provider = get_article_repo()
    log_provider = get_system_log_repo()

    github_username = os.getenv("GITHUB_USERNAME")
    medium_username = os.getenv("MEDIUM_USERNAME")
    devto_username = os.getenv("DEVTO_USERNAME")

    await LogService.info(
        log_provider,
        "SYSTEM",
        "Scheduled data synchronization started in background.",
    )

    try:
        if github_username and github_username != "your_github_username":
            await IngestionService.fetch_github_repos(
                github_username, project_provider, log_provider
            )
            await LogService.info(
                log_provider, "GITHUB", "GitHub repositories synchronized successfully."
            )
        if devto_username and devto_username != "your_devto_username":
            await IngestionService.fetch_devto_articles(
                devto_username, article_provider, log_provider
            )
            await LogService.info(
                log_provider, "DEV_TO", "Dev.to articles synchronized successfully."
            )
        if medium_username and medium_username != "your_medium_username":
            await IngestionService.fetch_medium_articles(
                medium_username, article_provider
            )
            await LogService.info(
                log_provider, "MEDIUM", "Medium articles synchronized successfully."
            )

        await LogService.info(
            log_provider, "SYSTEM", "Nightly sync cycle completed without errors."
        )
    except Exception as e:
        error_details = {"exception": type(e).__name__, "message": str(e)}
        await LogService.error(
            log_provider,
            "SYSTEM",
            "Synchronization cycle was interrupted!",
            error_details,
        )


def start_scheduler():
    enabled = os.getenv("ENABLE_CRON_JOBS", "false").lower() in ("true", "1", "yes")
    if not enabled:
        import logging

        logging.getLogger(__name__).warning(
            "ENABLE_CRON_JOBS is disabled. Nightly sync job will NOT run."
        )
        return

    # Set to run every day at 03:00 AM
    scheduler.add_job(nightly_data_sync_job, "cron", hour=3, minute=0)
    # If you want to test in development stage, you can set it to every 1 hour:
    # scheduler.add_job(nightly_data_sync_job, 'interval', hours=1)
    scheduler.start()
