import os
from datetime import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.db.factory import get_db_provider
from app.services.ingestion_service import IngestionService

scheduler = AsyncIOScheduler()


async def nightly_data_sync_job():
    """Her gece verileri arka planda güncelleyen ana görev."""
    provider = get_db_provider()
    github_username = os.getenv("GITHUB_USERNAME")
    medium_username = os.getenv("MEDIUM_USERNAME")
    devto_username = os.getenv("DEVTO_USERNAME")

    print(f"[{datetime.now()}] Zamanlanmış veri senkronizasyonu başladı...")
    try:
        if github_username and github_username != "your_github_username":
            await IngestionService.fetch_github_repos(github_username, provider)
        if devto_username and devto_username != "your_devto_username":
            await IngestionService.fetch_devto_articles(devto_username, provider)
        if medium_username and medium_username != "your_medium_username":
            await IngestionService.fetch_medium_articles(medium_username, provider)
        print(
            f"[{datetime.now()}] Zamanlanmış veri senkronizasyonu başarıyla tamamlandı."
        )
    except Exception as e:
        print(f"Zamanlanmış görev sırasında hata oluştu: {str(e)}")


def start_scheduler():
    # Her gün gece 03:00'te çalışacak şekilde ayarla
    scheduler.add_job(nightly_data_sync_job, "cron", hour=3, minute=0)
    # Geliştirme aşamasında test etmek istersen her 1 saatte bire ayarlayabilirsin:
    # scheduler.add_job(nightly_data_sync_job, 'interval', hours=1)
    scheduler.start()
