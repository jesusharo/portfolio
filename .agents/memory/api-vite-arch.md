---
name: API + Vite dual-server architecture
description: How the backend and frontend run together in this project
---

Express API runs on port 3001, Vite dev server on port 5000. The `npm run dev` script uses `concurrently` to start both. Vite's `server.proxy` sends all `/api/*` requests to localhost:3001.

**Why:** Added backend for content editor CMS — auth, project CRUD, about content — while keeping the Vite SPA frontend unchanged.

**How to apply:** Any new API routes go in `server/routes/*.mjs`, mounted in `server/index.mjs`. Frontend calls via `/api/...` relative paths (no hardcoded localhost). The `npm run dev` script begins with `fuser -k 5000/tcp 2>/dev/null; sleep 0.5 &&` — do not remove this, it evicts stale processes that would block Vite. Vite uses `--strictPort` so a port bump causes an immediate visible failure rather than silently redirecting to Express. If "Cannot GET /" appears, kill port 5000 and restart the workflow.
