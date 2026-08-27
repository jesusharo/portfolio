/**
 * Shared HTML sanitization for all editor-saved content.
 * Uses sanitize-html with a strict whitelist: only formatting tags
 * needed for the rich text editor — no scripts, no event handlers,
 * no iframes, no javascript: URLs.
 */
import sanitizeHtml from 'sanitize-html';

const RICH_TEXT_OPTIONS = {
  allowedTags: [
    'b', 'i', 'em', 'strong', 'u', 's',
    'h1', 'h2', 'h3', 'h4',
    'p', 'br', 'blockquote', 'pre', 'code',
    'ul', 'ol', 'li',
    'a', 'span',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    '*': ['style'],
  },
  allowedStyles: {
    '*': {
      color: [/^#[0-9a-f]{6}$/i],
      'font-size': [/^(0\.85|1|1\.25|1\.5)rem$/],
      'text-align': [/^(left|center|right|justify)$/],
    },
  },
  allowedSchemes: ['https', 'http', 'mailto'],
  allowedSchemesByTag: { a: ['https', 'http', 'mailto'] },
  allowProtocolRelative: false,
  // Force safe values on links
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        rel: 'noopener noreferrer',
        // strip any javascript: href that might slip through
        href: (attribs.href || '').replace(/^javascript:/i, ''),
      },
    }),
  },
};

/** Sanitize rich text HTML (from Tiptap / the content blocks editor). */
export function sanitizeRichText(html) {
  if (typeof html !== 'string') return '';
  return sanitizeHtml(html, RICH_TEXT_OPTIONS);
}

/** Strip ALL HTML from a plain-text field (e.g. project name). */
export function sanitizePlainText(text) {
  if (typeof text !== 'string') return '';
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} }).trim();
}

/** Allow project-scoped colors only in standard six-digit hex notation. */
export function sanitizeHexColor(value, fallback = '#ffffff') {
  const color = typeof value === 'string' ? value.trim() : '';
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
}

/** Limit the project description to the supported text alignment values. */
export function sanitizeTextAlign(value, fallback = 'center') {
  return ['left', 'center', 'right', 'justify'].includes(value) ? value : fallback;
}

/**
 * Walk a content_blocks array and sanitize every richtext block's html field in place.
 * Returns a new array — does not mutate the original.
 */
export function sanitizeContentBlocks(blocks) {
  if (!Array.isArray(blocks)) return [];
  return blocks.map(block => {
    if (block?.type === 'richtext' && typeof block.html === 'string') {
      return { ...block, html: sanitizeRichText(block.html) };
    }
    if (block?.type === 'carousel') {
      const visibleCount = [1, 2, 3].includes(block.visible_count) ? block.visible_count : 3;
      return { ...block, visible_count: visibleCount };
    }
    return block;
  });
}
