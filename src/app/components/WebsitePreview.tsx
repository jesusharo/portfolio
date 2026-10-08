import { useEffect, useMemo, useRef, useState } from 'react';
import { Expand, Globe, Monitor, Smartphone } from 'lucide-react';
import { getPreviewScale, PREVIEW_VIEWPORTS, type PreviewDevice } from '../lib/previewViewport';

interface Props {
  url: string;
  editorMode?: boolean;
  onUrlChange?: (url: string) => void;
  language?: 'en' | 'es';
}

export function getSafePreviewUrl(value: string): string {
  const candidate = value.trim();
  if (!candidate || candidate.length > 2048) return '';

  try {
    const parsed = new URL(candidate);
    const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
    if (
      parsed.protocol !== 'https:' ||
      parsed.username ||
      parsed.password ||
      !hostname ||
      !hostname.includes('.') ||
      hostname.includes(':') ||
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.test') ||
      hostname.endsWith('.invalid') ||
      hostname.endsWith('.example')
    ) return '';

    const octets = hostname.split('.').map(Number);
    const isIpv4 = octets.length === 4 && octets.every(part => Number.isInteger(part) && part >= 0 && part <= 255);
    if (isIpv4) {
      const [a, b] = octets;
      if (
        a === 0 || a === 10 || a === 127 || a >= 224 ||
        (a === 169 && b === 254) ||
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168) ||
        (a === 100 && b >= 64 && b <= 127)
      ) return '';
    }

    return parsed.toString();
  } catch {
    return '';
  }
}

export default function WebsitePreview({ url, editorMode = false, onUrlChange, language = 'en' }: Props) {
  const safeUrl = useMemo(() => getSafePreviewUrl(url), [url]);
  const hostname = safeUrl ? new URL(safeUrl).hostname : '';
  const isSpanish = language === 'es';
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const viewport = PREVIEW_VIEWPORTS[device];
  const scale = getPreviewScale(containerWidth, viewport.width);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setContainerWidth(container.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [safeUrl]);

  if (!editorMode && !safeUrl) return null;

  return (
    <section className="my-4">
      {editorMode && (
        <div className="mb-3">
          <label className="mb-1 block text-[0.7rem] uppercase tracking-[0.12em] text-white/40">
            {isSpanish ? 'URL del sitio (solo HTTPS)' : 'Website URL (HTTPS only)'}
          </label>
          <input
            type="url"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            value={url}
            onChange={event => onUrlChange?.(event.target.value)}
            placeholder="https://example.com"
            aria-label={isSpanish ? 'URL de vista previa del sitio' : 'Website preview URL'}
            className="w-full rounded-[9px] border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.85rem] text-white/80 outline-none transition-colors placeholder:text-white/20 focus:border-white/25"
          />
          <p className="mt-1 text-[0.68rem] text-white/30">
            {isSpanish
              ? 'Algunos sitios bloquean las vistas previas incrustadas.'
              : 'Some websites block embedded previews.'}
          </p>
          {url.trim() && !safeUrl && (
            <p role="alert" className="mt-1 text-[0.7rem] text-amber-200/80">
              {isSpanish
                ? 'Usa una URL HTTPS pública, sin credenciales.'
                : 'Enter a public HTTPS URL without credentials.'}
            </p>
          )}
        </div>
      )}

      {safeUrl ? (
        <div className="overflow-hidden rounded-[12px] border border-white/12 bg-black/20">
          <div className="flex h-10 items-center gap-2 border-b border-white/10 bg-black/25 px-3">
            <Globe size={14} className="shrink-0 text-white/35" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-[0.72rem] text-white/45">{hostname}</span>
            <span className="hidden shrink-0 text-[0.65rem] tabular-nums text-white/30 sm:block">
              {viewport.width} × {viewport.height}
            </span>
            <div
              role="group"
              aria-label={isSpanish ? 'Tamaño de la vista previa' : 'Preview viewport'}
              className="flex shrink-0 gap-0.5 rounded-[6px] border border-white/10 bg-white/[0.03] p-0.5"
            >
              {([
                ['desktop', 'Desktop', Monitor],
                ['mobile', 'Mobile', Smartphone],
              ] as const).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDevice(value)}
                  aria-pressed={device === value}
                  title={value === 'desktop' ? '1200 × 768' : 'iPhone 17 · 402 × 874'}
                  className={`flex items-center gap-1 rounded-[4px] px-1.5 py-1 text-[0.65rem] transition-colors ${
                    device === value ? 'bg-white/15 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                  }`}
                >
                  <Icon size={12} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
            <a
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              aria-label={isSpanish ? `Abrir ${hostname} en una pestaña nueva` : `Open ${hostname} in a new tab`}
              title={isSpanish ? 'Abrir en una pestaña nueva' : 'Open in a new tab'}
              className="flex size-7 shrink-0 items-center justify-center rounded-[6px] text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Expand size={15} aria-hidden="true" />
            </a>
          </div>
          <div ref={containerRef} className="w-full overflow-hidden bg-black/15">
            <div
              className="relative mx-auto overflow-hidden bg-white"
              style={{
                width: '100%',
                maxWidth: viewport.width,
                aspectRatio: `${viewport.width} / ${viewport.height}`,
              }}
            >
              <iframe
                src={safeUrl}
                width={viewport.width}
                height={viewport.height}
                title={`${isSpanish ? 'Vista previa del sitio' : 'Website preview'}: ${hostname}`}
                sandbox="allow-scripts"
                allow="camera 'none'; microphone 'none'; geolocation 'none'; payment 'none'; clipboard-read 'none'; clipboard-write 'none'; fullscreen 'none'"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="absolute left-0 top-0 block border-0 bg-white"
                style={{
                  width: viewport.width,
                  height: viewport.height,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  visibility: scale > 0 ? 'visible' : 'hidden',
                }}
              />
            </div>
          </div>
        </div>
      ) : !url.trim() ? (
        <div className="flex min-h-36 items-center justify-center rounded-[12px] border border-dashed border-white/10 bg-white/[0.02] text-[0.8rem] text-white/25">
          {isSpanish ? 'Añade una URL para mostrar el sitio.' : 'Add a URL to preview the website.'}
        </div>
      ) : null}
    </section>
  );
}
