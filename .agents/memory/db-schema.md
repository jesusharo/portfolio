---
name: Database schema for portfolio CMS
description: Tables for projects, case studies, and about content
---

Two tables: `projects` (id, type, name, slug, sort_order, hidden, background_color, accent_color, logo_grid_image, logo_header_image, hero_image, content_blocks JSONB, description) and `about_content` (id=1, content_html).

`DATABASE_URL` is runtime-managed by Replit — never set it manually, it auto-injects.

Schema is created by `server/schema.sql` which runs on API server startup via `migrate()`. Public views filter `hidden=false` and order by `sort_order`. Editor routes include all rows.

**Why:** Moved from static `.ts` data files to DB so content can be edited via the drawer without code changes.
