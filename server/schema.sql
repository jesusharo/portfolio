CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('ui_project', 'case_study')),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  hidden BOOLEAN NOT NULL DEFAULT false,
  background_color TEXT DEFAULT '#1c1c1c',
  accent_color TEXT DEFAULT '#1c1c1c',
  logo_grid_image TEXT DEFAULT '',
  logo_header_image TEXT DEFAULT '',
  hero_image TEXT DEFAULT '',
  content_blocks JSONB NOT NULL DEFAULT '[]',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS about_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  content_html TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO about_content (id, content_html) VALUES (1, '') ON CONFLICT (id) DO NOTHING;
