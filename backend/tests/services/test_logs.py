import pytest

from app.services.log_service import LogService


@pytest.mark.asyncio
async def test_log_service_info(mock_provider):
    await LogService.info(mock_provider, "TEST", "This is an info log", {"data": 123})

    logs = await mock_provider.get_logs(level="INFO", module="TEST")
    assert len(logs) == 1
    assert logs[0].level == "INFO"
    assert logs[0].message == "This is an info log"
    assert logs[0].details == {"data": 123}


@pytest.mark.asyncio
async def test_log_service_error(mock_provider):
    await LogService.error(
        mock_provider, "SYSTEM", "An error occurred", {"error_code": 500}
    )

    logs = await mock_provider.get_logs(level="ERROR", module="SYSTEM")
    assert len(logs) == 1
    assert logs[0].level == "ERROR"
    assert logs[0].message == "An error occurred"
    assert logs[0].details == {"error_code": 500}
