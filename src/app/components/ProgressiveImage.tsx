import { useEffect, useState } from 'react';
import type { ImgHTMLAttributes, CSSProperties } from 'react';
import { getImageDimensions } from '../lib/imageDimensions';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  frameClassName?: string;
  placeholderAspectRatio?: string;
  frameStyle?: CSSProperties;
}

export default function ProgressiveImage({
  src,
  alt = '',
  className = '',
  frameClassName = 'w-full',
  frameStyle,
  placeholderAspectRatio = '16 / 10',
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  style,
  ...imageProps
}: Props) {
  const dimensions = getImageDimensions(src);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    setNaturalDimensions(null);
  }, [src]);

  const resolvedDimensions = dimensions || naturalDimensions;
  const aspectRatio = resolvedDimensions
    ? `${resolvedDimensions.width} / ${resolvedDimensions.height}`
    : placeholderAspectRatio;

  return (
    <span
      className={`relative block overflow-hidden ${frameClassName}`}
      style={{ aspectRatio, ...frameStyle }}
    >
      {!loaded && !failed && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.025] via-white/[0.075] to-white/[0.025]"
        />
      )}
      {src && !failed && (
        <img
          {...imageProps}
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          className={className}
          style={{
            ...style,
            display: 'block',
            width: '100%',
            height: '100%',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 300ms ease',
          }}
          onLoad={event => {
            if (!dimensions) {
              const { naturalWidth, naturalHeight } = event.currentTarget;
              if (naturalWidth > 0 && naturalHeight > 0) {
                setNaturalDimensions({ width: naturalWidth, height: naturalHeight });
              }
            }
            setLoaded(true);
            onLoad?.(event);
          }}
          onError={event => {
            setFailed(true);
            onError?.(event);
          }}
        />
      )}
      {failed && (
        <span className="absolute inset-0 flex items-center justify-center text-xs text-white/25">
          Image unavailable
        </span>
      )}
    </span>
  );
}
