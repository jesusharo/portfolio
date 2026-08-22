import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface LightboxImage {
  src: string;
  alt?: string;
}

interface Props {
  src?: string;
  alt?: string;
  images?: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;
}

export default function ImageLightbox({
  src,
  alt = '',
  images,
  initialIndex = 0,
  onClose,
}: Props) {
  const items = images?.length ? images : src ? [{ src, alt }] : [];
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0))
  );
  const hasNavigation = items.length > 1;

  useEffect(() => {
    setCurrentIndex(Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0)));
  }, [initialIndex, items.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }
      if (!hasNavigation) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        event.stopPropagation();
        setCurrentIndex(index => (index - 1 + items.length) % items.length);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        event.stopPropagation();
        setCurrentIndex(index => (index + 1) % items.length);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasNavigation, items.length, onClose]);

  if (!items.length) return null;

  const currentImage = items[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      data-image-lightbox="true"
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 p-4 sm:p-8"
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image preview"
        title="Close"
        className="fixed right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/75 backdrop-blur-sm transition-colors hover:bg-white/15 hover:text-white"
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      {hasNavigation && (
        <>
          <button
            type="button"
            onClick={() => setCurrentIndex(index => (index - 1 + items.length) % items.length)}
            aria-label="Previous image"
            title="Previous image"
            className="fixed left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/75 backdrop-blur-sm transition-colors hover:bg-white/15 hover:text-white sm:left-6"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex(index => (index + 1) % items.length)}
            aria-label="Next image"
            title="Next image"
            className="fixed right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/75 backdrop-blur-sm transition-colors hover:bg-white/15 hover:text-white sm:right-6"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </>
      )}

      <div className="flex min-h-full items-start justify-center py-8 sm:py-4">
        <img
          src={currentImage.src}
          alt={currentImage.alt || ''}
          className="block h-auto w-auto max-w-full cursor-zoom-out rounded-[10px] shadow-2xl"
          onClick={event => event.stopPropagation()}
        />
      </div>
    </div>
  );
}