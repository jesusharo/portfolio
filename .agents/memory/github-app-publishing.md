---
name: GitHub App publishing
description: Authentication boundaries when publishing portfolio changes to GitHub.
---

An active GitHub App integration does not guarantee that the Git CLI credential helper is authenticated. Treat the App connection and source-control credentials as separate.

**Why:** Switching integrations left the command-line credential unusable even though the GitHub App could access and update the same repository.

**How to apply:** If command-line push fails authentication, use the connected integration before asking for credentials or another authorization. Preserve the local commit history, verify uploaded object hashes, and only advance the remote branch without force.
