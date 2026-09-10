import type { Language } from '../context/LanguageContext';

export function localized<T extends Record<string, any>>(
  value: T | null | undefined,
  field: string,
  language: Language,
): string {
  if (!value) return '';
  const primary = language === 'es' ? value[`${field}_es`] : value[field];
  const fallback = language === 'es' ? value[field] : value[`${field}_es`];
  return (typeof primary === 'string' && primary.trim() ? primary : fallback) || '';
}

export function localizedBlocks<T extends Record<string, any>>(blocks: T[], language: Language): T[] {
  return blocks.map(block => {
    const next = { ...block };
    for (const field of ['html', 'caption']) {
      if (field in next) next[field] = localized(block, field, language);
    }
    if (Array.isArray(block.images)) {
      next.images = block.images.map((image: T) => ({ ...image, caption: localized(image, 'caption', language) }));
    }
    if (Array.isArray(block.rows)) {
      next.rows = block.rows.map((row: T) => ({
        ...row,
        images: Array.isArray(row.images)
          ? row.images.map((image: T) => ({ ...image, caption: localized(image, 'caption', language) }))
          : row.images,
      }));
    }
    return next;
  });
}