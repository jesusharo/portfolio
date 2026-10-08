---
name: Embedded website preview security
description: Security and behavior requirements for external website previews in portfolio content.
---

Website previews store only validated public HTTPS URLs, never user-supplied HTML or iframe attributes. Embed remote pages in sandboxed iframes with scripts enabled only when needed for modern sites; do not grant same-origin, forms, popups, downloads, or top-navigation permissions. Use `noreferrer`/`noopener` for links that open the original site in a new tab.

**Why:** The editor needs functional previews without allowing a remote page to gain access to the portfolio's origin or navigate visitors away from it.

**How to apply:** Validate and sanitize preview URLs in both browser UI and server persistence. Keep iframe attributes fixed in code, and show an explicit external-link control outside the iframe. Expect some sites to refuse embedding through their own frame policies.

Device previews simulate a CSS layout viewport, not a complete phone browser or its physical display resolution.

**Why:** The user requested fixed desktop and iPhone 17 layouts. Using Retina hardware pixels instead of CSS pixels would make mobile previews render desktop layouts.

**How to apply:** Scale the display of the fixed-size iframe to fit its container without changing its internal layout dimensions, spoofing browser identity, or weakening sandbox permissions.
