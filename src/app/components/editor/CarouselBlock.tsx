import { useEffect, useRef, useState } from 'react';
import { X, Plus, Loader2, ChevronLeft, ChevronRight, GalleryHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { uploadImage } from '../../lib/api';
import ImageLightbox from '../ImageLightbox';

export interface CarouselImageItem {
  id: string;
  url: string;
  caption?: string;
}

interface Props {
  images: CarouselImageItem[];
  editorMode?: boolean;
  onChange?: (images: CarouselImageItem[]) => void;
}

// ─── Mini upload strip slot ───────────────────────────────────────────────────
function StripUploadSlot({ onUploaded }: { onUploaded: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File | null | undefined) {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      onUploaded(url);
    } catch { /* silent */ }
    finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div
      onClick={() => !uploading && fileRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false); }}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
      className={`shrink-0 w-[100px] h-[70px] rounded-[8px] border-2 border-dashed flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all select-none ${
        dragging
          ? 'border-white/50 bg-white/[0.07]'
          : 'border-white/15 hover:border-white/28 hover:bg-white/[0.03]'
      }`}
    >
      {uploading
        ? <Loader2 size={16} strokeWidth={1.5} className="animate-spin text-white/35" />
        : <Plus size={16} strokeWidth={1.5} className="text-white/25" />
      }
      <span className="text-white/20 text-[0.65rem]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
        {uploading ? '…' : 'Add'}
      </span>
      <input
        ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener?.('change', sync);
    return () => mediaQuery.removeEventListener?.('change', sync);
  }, []);

  return isMobile;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CarouselBlock({ images, editorMode, onChange }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [lightboxImage, setLightboxImage] = useState<CarouselImageItem | null>(null);
  const isMobile = useIsMobile();
  const visibleCount = isMobile ? 1 : 3;
  const maxStartIdx = Math.max(0, images.length - visibleCount);

  useEffect(() => {
    setCurrentIdx(index => Math.min(index, maxStartIdx));
  }, [maxStartIdx]);

  function addImage(url: string) {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    onChange?.([...images, { id, url }]);
  }

  function removeImage(id: string) {
    const next = images.filter(img => img.id !== id);
    onChange?.(next);
  }

  function goTo(idx: number, direction: 1 | -1) {
    setDir(direction);
    setCurrentIdx(idx);
  }

  function prev() {
    goTo(currentIdx === 0 ? maxStartIdx : currentIdx - 1, -1);
  }

  function next() {
    goTo(currentIdx >= maxStartIdx ? 0 : currentIdx + 1, 1);
  }

  // ── Editor mode ──
  if (editorMode) {
    return (
      <div className="rounded-[12px] border border-white/10 bg-white/[0.02] p-3 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-1.5 text-white/35 text-[0.75rem]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          <GalleryHorizontal size={13} strokeWidth={1.5} />
          Carousel · {images.length} image{images.length !== 1 ? 's' : ''}
        </div>

        {/* Horizontal thumbnail strip */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
          {images.map(img => (
            <div key={img.id} className="relative group/thumb shrink-0 w-[100px] h-[70px] rounded-[8px] overflow-hidden">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-1 right-1 size-[18px] flex items-center justify-center rounded-full bg-black/70 border border-white/15 text-white/50 hover:text-[#d25d5f] hover:bg-black/90 transition-all opacity-0 group-hover/thumb:opacity-100"
              >
                <X size={9} strokeWidth={2.5} />
              </button>
            </div>
          ))}
          <StripUploadSlot onUploaded={addImage} />
        </div>

        {/* Mini carousel preview */}
        {images.length > 0 && (
          <div className="relative overflow-hidden">
            <motion.div
              className="flex items-start"
              animate={{ x: `${-(Math.min(currentIdx, maxStartIdx) * 100) / visibleCount}%` }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              {images.map(img => (
                <div
                  key={img.id}
                  className="min-w-0 shrink-0 px-0 md:px-1"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="block h-auto w-full object-contain"
                  />
                </div>
              ))}
            </motion.div>
            {maxStartIdx > 0 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center rounded-full bg-black/50 border border-white/15 text-white/70 hover:text-white hover:bg-black/70 transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center rounded-full bg-black/50 border border-white/15 text-white/70 hover:text-white hover:bg-black/70 transition-all"
                >
                  <ChevronRight size={14} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {Array.from({ length: maxStartIdx + 1 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i, i > currentIdx ? 1 : -1)}
                      className={`rounded-full transition-all ${i === currentIdx ? 'w-4 h-1.5 bg-white' : 'size-1.5 bg-white/35 hover:bg-white/60'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Read-only carousel ────────────────────────────────────────────────────
  if (!images.length) return null;

  const safeStartIdx = Math.min(currentIdx, maxStartIdx);
  const current = images[safeStartIdx];

  return (
    <div className="select-none">
      {/* Slide area */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex items-start"
          animate={{ x: `${-(safeStartIdx * 100) / visibleCount}%` }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        >
          {images.map(img => (
            <div
              key={img.id}
              className="min-w-0 shrink-0 px-0 md:px-1"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <img
                src={img.url}
                alt={img.caption || ''}
                className="block h-auto w-full cursor-zoom-in object-contain"
                onClick={() => setLightboxImage(img)}
              />
            </div>
          ))}
        </motion.div>

        {/* Prev / Next */}
        {maxStartIdx > 0 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-9 flex items-center justify-center rounded-full bg-black/40 border border-white/15 text-white/70 hover:text-white hover:bg-black/60 transition-all backdrop-blur-sm"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-9 flex items-center justify-center rounded-full bg-black/40 border border-white/15 text-white/70 hover:text-white hover:bg-black/60 transition-all backdrop-blur-sm"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </>
        )}

        {/* Dots */}
        {maxStartIdx > 0 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {Array.from({ length: maxStartIdx + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > safeStartIdx ? 1 : -1)}
                className={`rounded-full transition-all ${
                  i === safeStartIdx
                    ? 'w-5 h-1.5 bg-white'
                    : 'size-1.5 bg-white/35 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Caption */}
      {current?.caption && (
        <p className="text-white/35 text-[0.8rem] mt-2 text-center" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          {current.caption}
        </p>
      )}
      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.url}
          alt={lightboxImage.caption || ''}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
