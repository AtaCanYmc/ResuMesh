import pytest

from app.services.log_service import LogService


@pytest.mark.asyncio
async def test_log_service_info(mock_provider):
    await LogService.info(
        mock_provider,
        "TEST",
        "This is an info log",
        user_id="user-123",
        request_id="req-abc",
        ip_address="127.0.0.1",
        endpoint="GET /api/test",
        details={"data": 123},
    )

    logs = await mock_provider.get_logs(level="INFO", module="TEST")
    assert len(logs) == 1
    assert logs[0].level == "INFO"
    assert logs[0].message == "This is an info log"
    assert logs[0].user_id == "user-123"
    assert logs[0].request_id == "req-abc"
    assert logs[0].ip_address == "127.0.0.1"
    assert logs[0].endpoint == "GET /api/test"
    assert logs[0].details == {"data": 123}


@pytest.mark.asyncio
async def test_log_service_error(mock_provider):
    await LogService.error(
        mock_provider,
        "SYSTEM",
        "An error occurred",
        user_id="admin-999",
        request_id="req-xyz",
        ip_address="192.168.1.1",
        endpoint="POST /api/test",
        details={"error_code": 500},
    )

    logs = await mock_provider.get_logs(level="ERROR", module="SYSTEM")
    assert len(logs) == 1
    assert logs[0].level == "ERROR"
    assert logs[0].message == "An error occurred"
    assert logs[0].user_id == "admin-999"
    assert logs[0].request_id == "req-xyz"
    assert logs[0].ip_address == "192.168.1.1"
    assert logs[0].endpoint == "POST /api/test"
    assert logs[0].details == {"error_code": 500}
