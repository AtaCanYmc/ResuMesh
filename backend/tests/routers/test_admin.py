import pytest

from app.schemas.system_log import SystemLogCreate


@pytest.mark.asyncio
async def test_get_system_logs(client, mock_provider):
    # Seed some logs
    await mock_provider.create_log(
        SystemLogCreate(level="INFO", module="TEST", message="Msg 1")
    )
    await mock_provider.create_log(
        SystemLogCreate(level="ERROR", module="TEST", message="Msg 2")
    )

    response = await client.get("/api/v1/admin/logs/")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["data"]) == 2


@pytest.mark.asyncio
async def test_get_system_logs_filtered(client, mock_provider):
    await mock_provider.create_log(
        SystemLogCreate(level="INFO", module="TEST", message="Msg 1")
    )
    await mock_provider.create_log(
        SystemLogCreate(level="ERROR", module="TEST", message="Msg 2")
    )

    response = await client.get("/api/v1/admin/logs/?level=ERROR")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["data"][0]["level"] == "ERROR"
