import pytest

from app.config.settings import settings
from app.services.supabase_storage import SupabaseStorageService


@pytest.fixture(autouse=True)
def mock_supabase_env(monkeypatch):
    monkeypatch.setattr(settings, "SUPABASE_URL", "https://mock.supabase.co")
    monkeypatch.setattr(settings, "SUPABASE_KEY", "mock_key")


@pytest.mark.asyncio
async def test_download_cv_success(client, monkeypatch):
    async def mock_download(self, filename):
        return b"pdf binary content mock"

    monkeypatch.setattr(SupabaseStorageService, "download_cv", mock_download)

    response = await client.get("/api/v1/cv/test.pdf")
    assert response.status_code == 200
    assert response.content == b"pdf binary content mock"
    assert response.headers["content-type"] == "application/pdf"
    assert "inline; filename=test.pdf" in response.headers["content-disposition"]
