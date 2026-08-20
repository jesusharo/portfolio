import { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  src: string;
  alt?: string;
  onClose: () => void;
}

export default function ImageLightbox({ src, alt = '', onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
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

      <div className="flex min-h-full items-start justify-center py-8 sm:py-4">
        <img
          src={src}
          alt={alt}
          className="block h-auto w-auto max-w-full cursor-zoom-out rounded-[10px] shadow-2xl"
          onClick={event => event.stopPropagation()}
        />
      </div>
    </div>
  );
}