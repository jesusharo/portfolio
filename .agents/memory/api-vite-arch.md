---
name: API + Vite dual-server architecture
description: How the backend and frontend run together in this project
---

Express API runs on port 3001, Vite dev server on port 5000. The `npm run dev` script uses `concurrently` to start both. Vite's `server.proxy` sends all `/api/*` requests to localhost:3001.

**Why:** Added backend for content editor CMS — auth, project CRUD, about content — while keeping the Vite SPA frontend unchanged.

**How to apply:** Any new API routes go in `server/routes/*.mjs`, mounted in `server/index.mjs`. Frontend calls via `/api/...` relative paths (no hardcoded localhost). If port conflicts arise on restart, run `fuser -k 5000/tcp 5001/tcp` before restarting the workflow.
