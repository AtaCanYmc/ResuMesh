from unittest.mock import MagicMock, patch

from app.services.telemetry_service import TelemetryService


def test_telemetry_service_disabled_by_default():
    # Test service setup when POSTHOG_API_KEY is empty/unset
    with patch("app.services.telemetry_service.settings") as mock_settings:
        mock_settings.POSTHOG_API_KEY = ""
        mock_settings.POSTHOG_HOST = "https://us.i.posthog.com"

        service = TelemetryService()
        assert service.client is None

        # Capture event shouldn't raise exception
        service.capture_event("test_id", "test_event", {"prop": "val"})


def test_telemetry_service_init_success():
    # Test service setup when POSTHOG_API_KEY is provided
    with (
        patch("app.services.telemetry_service.settings") as mock_settings,
        patch("app.services.telemetry_service.Posthog") as mock_posthog_class,
    ):
        mock_settings.POSTHOG_API_KEY = "test-api-key"
        mock_settings.POSTHOG_HOST = "https://us.i.posthog.com"

        service = TelemetryService()
        assert service.client is not None
        mock_posthog_class.assert_called_once_with(
            project_api_key="test-api-key", host="https://us.i.posthog.com"
        )


def test_telemetry_capture_event_calls_client():
    # Test capture event correctly forwards calls to Posthog client
    with (
        patch("app.services.telemetry_service.settings") as mock_settings,
        patch("app.services.telemetry_service.Posthog") as mock_posthog_class,
    ):
        mock_settings.POSTHOG_API_KEY = "test-api-key"
        mock_settings.POSTHOG_HOST = "https://us.i.posthog.com"

        mock_posthog_instance = MagicMock()
        mock_posthog_class.return_value = mock_posthog_instance

        service = TelemetryService()
        service.capture_event("user_123", "cv_downloaded", {"format": "pdf"})

        mock_posthog_instance.capture.assert_called_once_with(
            distinct_id="user_123", event="cv_downloaded", properties={"format": "pdf"}
        )
