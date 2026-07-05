import os

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.db.dependencies import get_article_repo, get_project_repo, get_system_log_repo
from app.services.ingestion_service import IngestionService
from app.services.log_service import LogService

scheduler = AsyncIOScheduler()


async def nightly_data_sync_job():
    """Her gece verileri arka planda güncelleyen ana görev."""
    project_provider = get_project_repo()
    article_provider = get_article_repo()
    log_provider = get_system_log_repo()

    github_username = os.getenv("GITHUB_USERNAME")
    medium_username = os.getenv("MEDIUM_USERNAME")
    devto_username = os.getenv("DEVTO_USERNAME")

    await LogService.info(
        log_provider,
        "SYSTEM",
        "Zamanlanmış veri senkronizasyonu arka planda başlatıldı.",
    )

    try:
        if github_username and github_username != "your_github_username":
            await IngestionService.fetch_github_repos(
                github_username, project_provider, log_provider
            )
            await LogService.info(
                log_provider, "GITHUB", "GitHub depoları başarıyla senkronize edildi."
            )
        if devto_username and devto_username != "your_devto_username":
            await IngestionService.fetch_devto_articles(
                devto_username, article_provider, log_provider
            )
            await LogService.info(
                log_provider, "DEV_TO", "Dev.to makaleleri başarıyla senkronize edildi."
            )
        if medium_username and medium_username != "your_medium_username":
            await IngestionService.fetch_medium_articles(
                medium_username, article_provider
            )
            await LogService.info(
                log_provider, "MEDIUM", "Medium makaleleri başarıyla senkronize edildi."
            )

        await LogService.info(
            log_provider, "SYSTEM", "Gece senkronizasyon döngüsü hatasız tamamlandı."
        )
    except Exception as e:
        error_details = {"exception": type(e).__name__, "message": str(e)}
        await LogService.error(
            log_provider,
            "SYSTEM",
            "Senkronizasyon döngüsü yarıda kesildi!",
            error_details,
        )


def start_scheduler():
    # Her gün gece 03:00'te çalışacak şekilde ayarla
    scheduler.add_job(nightly_data_sync_job, "cron", hour=3, minute=0)
    # Geliştirme aşamasında test etmek istersen her 1 saatte bire ayarlayabilirsin:
    # scheduler.add_job(nightly_data_sync_job, 'interval', hours=1)
    scheduler.start()
