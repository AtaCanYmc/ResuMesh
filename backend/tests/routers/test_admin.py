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

    # Force LLM Provider to be mock and reset cache
    import app.llm.factory as llm_factory

    monkeypatch.setattr(llm_factory, "_provider_instance", None)
    monkeypatch.setenv("LLM_PROVIDER", "mock")

    response = await client.post(
        "/api/v1/admin/generate-cv", json={"job_url": "https://example.com/job"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["cv_data"]["title"] == "Mocked CV"


@pytest.mark.asyncio
async def test_get_rxresume_resumes(client, monkeypatch, auth_override):
    from datetime import datetime

    from reactive_resume.models.resume import Basics, Resume, ResumeData

    from app.services.reactive_resume_service import ReactiveResumeService

    mock_resume = Resume(
        id="resume-1",
        name="Test CV",
        slug="test-cv",
        userId="user-123",
        visibility="public",
        locked=False,
        data=ResumeData(basics=Basics(name="Ata")),
        createdAt=datetime.now(),
        updatedAt=datetime.now(),
    )

    async def mock_list_resumes(self):
        return [mock_resume]

    monkeypatch.setattr(ReactiveResumeService, "list_resumes", mock_list_resumes)

    response = await client.get("/api/v1/admin/rxresume/resumes")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["resumes"]) == 1
    assert data["resumes"][0]["name"] == "Test CV"


@pytest.mark.asyncio
async def test_get_rxresume_pdf(client, monkeypatch, auth_override):
    from app.services.reactive_resume_service import ReactiveResumeService

    async def mock_export_to_pdf(self, resume_id):
        return f"http://mocked-pdf-url/{resume_id}"

    monkeypatch.setattr(ReactiveResumeService, "export_to_pdf", mock_export_to_pdf)

    response = await client.get("/api/v1/admin/rxresume/resume/resume-1/pdf")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["url"] == "http://mocked-pdf-url/resume-1"


@pytest.mark.asyncio
async def test_sync_rxresume(client, monkeypatch, auth_override):
    from app.services.reactive_resume_service import ReactiveResumeService

    async def mock_sync(self, resume_id, import_data):
        return None

    monkeypatch.setattr(ReactiveResumeService, "sync_mesh_data_to_resume", mock_sync)

    response = await client.post("/api/v1/admin/rxresume/resume/resume-1/sync")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "synchronized" in data["message"]
