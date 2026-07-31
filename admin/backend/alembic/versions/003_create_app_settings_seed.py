"""seed app_settings default values

Revision ID: 003_app_settings
Revises: 002_sections
Create Date: 2026-07-30

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "003_app_settings"
down_revision = "002_sections"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Ensure app_settings table exists
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS app_settings (
            id SERIAL PRIMARY KEY,
            key VARCHAR(255) UNIQUE NOT NULL,
            value JSONB
        );
        CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings (key);
        """
    )

    # 2. Seed default values
    op.execute(
        """
        INSERT INTO app_settings (key, value) VALUES
            ('integrations', '{"github_username": "AtaCanYmc", "medium_username": "atacanymc", "devto_username": "atacanymc"}'::jsonb),
            ('llm', '{"provider": "mock", "openai_model": "gpt-4o", "groq_model": "llama-3.3-70b-versatile", "ollama_base_url": "http://localhost:11434", "ollama_model": "llama3"}'::jsonb),
            ('feature_flags', '{"enable_admin_workspace": true, "enable_cron_jobs": true}'::jsonb)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DELETE FROM app_settings WHERE key IN ('integrations', 'llm', 'feature_flags');
        """
    )
