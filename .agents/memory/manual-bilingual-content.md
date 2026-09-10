---
name: Manual bilingual portfolio content
description: Durable rules for authoring and displaying English and Spanish project content.
---

Project prose must be authored manually in English and Spanish. Project names, IDs, slugs, media, colors, and layout settings are shared and must never be translated or duplicated.

**Why:** Automatic translation was unreliable and could alter project titles or fail entirely. Editors need direct control over each language while legacy single-language content must remain visible.

**How to apply:** Store parallel language fields for subtitles, descriptions, rich text, and captions. Editor tabs always show the exact stored value for the selected language. Public views fall back per field to the other language only when the selected value is empty.