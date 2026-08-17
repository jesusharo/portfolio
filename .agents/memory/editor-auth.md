---
name: Editor authentication
description: How the content editor drawer is protected
---

Simple passcode auth: POST `/api/auth/login` with `{ passcode }` returns a JWT. Token stored in `localStorage` as `editor_token`. All editor API routes (`/api/projects/editor/*`, PUT `/api/about`) require `Authorization: Bearer <token>`.

Requires two Replit Secrets: `EDITOR_PASSCODE` (the user's chosen passcode) and `JWT_SECRET` (long random string). Falls back to `'dev-secret-change-me'` if JWT_SECRET is missing — never deploy without it.

**Why:** Only the portfolio owner needs access; no user accounts needed. Passcode is fastest to implement and maintain.
