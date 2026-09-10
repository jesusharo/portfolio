---
name: Backdrop blur on scaled cards
description: Why hover glass layers must sample neighboring content before a card is transformed.
---

For liquid-glass hover effects on cards that grow with `transform: scale()`, use a separate glass layer whose pre-transform bounds extend into the neighboring cards, then counter-scale that layer so its visible edge still matches the card.

**Why:** Applying `backdrop-filter` directly to the scaled card samples its original layout area. The expanded pixels therefore blur the page behind the card's original position rather than the neighboring cards it visually overlaps.

**How to apply:** Keep the normal card color on an opaque base layer. During hover, fade to an oversized, counter-scaled layer with a mostly opaque tinted background and backdrop blur; keep content in a foreground layer.