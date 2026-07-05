from unittest.mock import AsyncMock, patch

import pytest

from app.services.ingestion_service import IngestionService


@pytest.mark.asyncio
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

    from unittest.mock import MagicMock

    mock_response_obj = MagicMock()
    mock_response_obj.status_code = 200
    mock_response_obj.json.return_value = mock_response

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_response_obj

        await IngestionService.fetch_github_repos("test_user", mock_provider)

        projects = await mock_provider.get_projects()
        assert len(projects) == 1
        assert projects[0].title == "ResuMesh"
        assert projects[0].stars == 10
        assert "Python" in projects[0].languages
