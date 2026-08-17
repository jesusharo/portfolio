---
name: Image upload storage
description: How editor image uploads are stored and served
---

Images are stored as `bytea` in the `images` Postgres table (id UUID, filename, mime_type, data, created_at). This approach was chosen over filesystem storage because uploaded files on the filesystem are lost across restarts.

Upload endpoint: `POST /api/images/editor/upload` (auth required, multer memoryStorage, 8 MB limit, JPEG/PNG/GIF/WebP/AVIF). Returns `{ id, url: "/api/images/:id" }`.

Serve endpoint: `GET /api/images/:id` — streams the bytea back with correct Content-Type, immutable cache headers, and a restrictive CSP.

**Why:** Filesystem (`public/uploads/`) is still wired up as a fallback static server for any old URLs, but all new uploads go through the DB route. The `ImageUploadInput` component calls `/api/images/editor/upload`.

**How to apply:** When adding new image fields, use `ImageUploadInput` from `src/app/components/editor/ImageUploadInput.tsx` — it handles both file upload and URL paste modes.
