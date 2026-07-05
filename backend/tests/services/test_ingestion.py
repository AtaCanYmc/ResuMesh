import pytest
import respx
from httpx import Response

from app.services.ingestion_service import IngestionService


@pytest.mark.asyncio
@respx.mock
async def test_fetch_github_repos_success(mock_provider):
    mock_response = [
        {
            "name": "ResuMesh",
            "description": "Smart Portfolio",
            "html_url": "https://github.com/user/resumesh",
            "stargazers_count": 10,
            "watchers_count": 10,
            "forks_count": 2,
            "language": "Python",
            "fork": False,
        }
    ]

    respx.get("https://api.github.com/users/test_user/repos").mock(
        return_value=Response(200, json=mock_response)
    )

    await IngestionService.fetch_github_repos("test_user", mock_provider)

    projects = await mock_provider.get_projects()
    assert len(projects) == 1
    assert projects[0].title == "ResuMesh"
    assert projects[0].stars == 10
    assert "Python" in projects[0].languages
