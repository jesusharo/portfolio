---
name: Image storage
description: Why editor-uploaded images are stored in Postgres instead of Replit Object Storage
---

Editor-uploaded images are stored in Postgres, not Object Storage or the filesystem.

**Why:** No Replit Object Storage bucket was provisioned in this environment, and Postgres is durable across deployments while the filesystem is not. Uploads must stay raster-only (no SVG) with server-side magic-byte validation — the API serves them from the app origin.

**How to apply:** If Object Storage is provisioned later, migrate uploads there but keep the existing image URL shape so stored content URLs keep working.
