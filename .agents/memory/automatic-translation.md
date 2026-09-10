---
name: Automatic portfolio translation
description: Durable provider and safety decisions for translating dynamic portfolio content.
---

Dynamic EN→ES translation must use rate-limited Lingva with MyMemory as a fallback, not a paid model exposed through a public browser endpoint.

**Why:** Anonymous portfolio visitors need automatic translation, while a public paid-model proxy creates uncontrolled spend. MyMemory also returns some API errors inside HTTP 200 responses and rejects inputs above 500 characters.

**How to apply:** Protect URLs, IDs, markup, paths, colors, and code before translation; use chunks below 500 characters; validate provider-level status, protected tokens, and JSON shape; retain bounded caches and request deadlines.