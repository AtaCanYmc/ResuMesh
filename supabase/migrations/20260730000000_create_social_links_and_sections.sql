-- Supabase Migration: Create social_links and sections tables with indexes and initial seed data

-- 1. SOCIAL_LINKS TABLOSU
CREATE TABLE IF NOT EXISTS social_links (
    id VARCHAR(36) PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    url VARCHAR(512) NOT NULL,
    icon VARCHAR(100),
    order_index INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_social_links_platform ON social_links (platform);

-- 2. SECTIONS TABLOSU
CREATE TABLE IF NOT EXISTS sections (
    id VARCHAR(36) PRIMARY KEY,
    key VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sections_key ON sections (key);

-- 3. SEED DEFAULT SECTIONS
INSERT INTO sections (id, key, title, description, is_active, order_index) VALUES
    (gen_random_uuid()::text, 'educations', 'Educations Section', 'Show or hide your educations page on the public site.', true, 1),
    (gen_random_uuid()::text, 'experiences', 'Experiences Section', 'Show or hide your experiences page on the public site.', true, 2),
    (gen_random_uuid()::text, 'projects', 'Projects Section', 'Show or hide your projects page on the public site.', true, 3),
    (gen_random_uuid()::text, 'certificates', 'Certificates Section', 'Show or hide your certificates page on the public site.', true, 4),
    (gen_random_uuid()::text, 'articles', 'Articles Section', 'Show or hide your articles page on the public site.', true, 5),
    (gen_random_uuid()::text, 'videos', 'Videos Section', 'Show or hide your videos page on the public site.', true, 6),
    (gen_random_uuid()::text, 'skills', 'Skills Section', 'Show or hide your skills page on the public site.', true, 7),
    (gen_random_uuid()::text, 'posts', 'Posts Section', 'Show or hide your posts page on the public site.', true, 8)
ON CONFLICT (key) DO NOTHING;

-- 4. SEED DEFAULT SOCIAL LINKS
INSERT INTO social_links (id, platform, label, url, icon, order_index, is_active) VALUES
    ('github', 'github', 'GitHub', 'https://github.com/AtaCanYmc', 'github', 1, true),
    ('linkedin', 'linkedin', 'LinkedIn', 'https://www.linkedin.com/in/ata-can-yaymacı/', 'linkedin', 2, true),
    ('devto', 'devto', 'Dev.to', 'https://dev.to/atacanymc', 'devto', 3, true),
    ('medium', 'medium', 'Medium', 'https://medium.com/@atacanymc', 'medium', 4, true)
ON CONFLICT (id) DO NOTHING;
