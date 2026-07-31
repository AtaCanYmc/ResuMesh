-- Supabase Migration: Seed App Settings Defaults for Integrations, LLM, and Feature Flags

-- 1. APP_SETTINGS TABLOSU (Eğer henüz yoksa oluşturulur)
CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB
);

CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings (key);

-- 2. SEED DEFAULT INTEGRATIONS SETTINGS
INSERT INTO app_settings (key, value) VALUES
    ('integrations', '{"github_username": "AtaCanYmc", "medium_username": "atacanymc", "devto_username": "atacanymc"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 3. SEED DEFAULT LLM CONFIGURATION
INSERT INTO app_settings (key, value) VALUES
    ('llm', '{"provider": "mock", "openai_model": "gpt-4o", "groq_model": "llama-3.3-70b-versatile", "ollama_base_url": "http://localhost:11434", "ollama_model": "llama3"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 4. SEED DEFAULT FEATURE FLAGS
INSERT INTO app_settings (key, value) VALUES
    ('feature_flags', '{"enable_admin_workspace": true, "enable_cron_jobs": true}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
