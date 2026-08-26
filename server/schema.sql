CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('ui_project', 'case_study')),
  name TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  slug TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  hidden BOOLEAN NOT NULL DEFAULT false,
  background_color TEXT DEFAULT '#1c1c1c',
  accent_color TEXT DEFAULT '#1c1c1c',
  text_color TEXT DEFAULT '#ffffff',
  logo_grid_image TEXT DEFAULT '',
  logo_header_image TEXT DEFAULT '',
  hero_image TEXT DEFAULT '',
  hero_foreground_image TEXT DEFAULT '',
  content_blocks JSONB NOT NULL DEFAULT '[]',
  description TEXT DEFAULT '',
  description_alignment TEXT DEFAULT 'center',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add subtitle to existing projects without affecting stored content.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS subtitle TEXT DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS hero_foreground_image TEXT DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#ffffff';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_alignment TEXT DEFAULT 'center';

CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY,
  filename TEXT NOT NULL DEFAULT '',
  mime_type TEXT NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS about_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  content_html TEXT DEFAULT '',
  resume_content TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO about_content (id, content_html) VALUES (1, '') ON CONFLICT (id) DO NOTHING;

-- Add resume_content if it didn't exist yet (idempotent)
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS resume_content TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  favicon_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (id, favicon_url) VALUES (1, '') ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY,
  filename TEXT NOT NULL DEFAULT '',
  mime_type TEXT NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
