---
name: Development watcher scope
description: Why development source watchers must exclude non-source workspace caches.
---

Do not watch cache or agent-tooling directories as application source.

**Why:** This environment can place a large Nix cache inside the workspace. Watching it alongside source code exhausted the OS file-watcher limit and crashed an otherwise healthy development server.

**How to apply:** Keep watcher scope restricted to app inputs, excluding hidden cache and tooling trees when changing development-server configuration.
