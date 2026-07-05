import pytest

from app.main import app
from app.schemas.system_log import SystemLogCreate
from app.services.auth_service import get_current_admin


async def override_get_current_admin():
    return {"username": "admin", "role": "admin"}


@pytest.fixture
def auth_override():
    app.dependency_overrides[get_current_admin] = override_get_current_admin
    yield
    app.dependency_overrides.pop(get_current_admin, None)


@pytest.mark.asyncio
async def test_unauthorized_access_to_logs(client):
    # Without auth override, this should fail with 401
    response = await client.get("/api/v1/admin/logs")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_system_logs(client, mock_provider, auth_override):
    # Seed some logs
    await mock_provider.create_log(
        SystemLogCreate(level="INFO", module="TEST", message="Msg 1")
    )
    await mock_provider.create_log(
        SystemLogCreate(level="ERROR", module="TEST", message="Msg 2")
    )

    response = await client.get("/api/v1/admin/logs")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["data"]) == 2


@pytest.mark.asyncio
async def test_get_system_logs_filtered(client, mock_provider, auth_override):
    await mock_provider.create_log(
        SystemLogCreate(level="INFO", module="TEST", message="Msg 1")
    )
    await mock_provider.create_log(
        SystemLogCreate(level="ERROR", module="TEST", message="Msg 2")
    )

    response = await client.get("/api/v1/admin/logs?level=ERROR")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["data"][0]["level"] == "ERROR"


@pytest.mark.asyncio
async def test_generate_cv(client, monkeypatch, auth_override):
    # Mock ScraperService to avoid network call
    async def mock_scrape(url):
        return "We are looking for a Python developer with FastAPI experience."

    from app.services.scraper_service import ScraperService

    monkeypatch.setattr(ScraperService, "scrape_job_description", mock_scrape)

    # Force LLM Provider to be mock
    monkeypatch.setenv("LLM_PROVIDER", "mock")

    response = await client.post(
        "/api/v1/admin/generate-cv", json={"job_url": "https://example.com/job"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "Mocked CV" in data["cv_markdown"]
