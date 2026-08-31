const DEFAULT_FAVICON = '/favicon.png';

function cacheBustedUrl(url: string) {
  if (!url.startsWith('/api/images/') && !url.startsWith('/uploads/')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${Date.now().toString(36)}`;
}

export function applyFavicon(url?: string | null) {
  if (typeof document === 'undefined') return;

  let link = document.querySelector<HTMLLinkElement>('link[data-site-favicon]');
  if (!link) {
    link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
  }
  if (!link) {
    link = document.createElement('link');
    document.head.appendChild(link);
  }

  link.rel = 'icon';
  link.dataset.siteFavicon = 'true';
  // The static link in index.html declares PNG. Remove that hint so uploaded
  // JPEG/WebP/AVIF favicons are selected from their response Content-Type.
  link.removeAttribute('type');
  link.href = cacheBustedUrl(url || DEFAULT_FAVICON);
}