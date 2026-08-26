const DEFAULT_FAVICON = '/favicon.png';

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
  link.href = url || DEFAULT_FAVICON;
}