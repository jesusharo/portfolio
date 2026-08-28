import { useEffect, useRef, useState } from 'react';
import { X, Plus, Loader2, ChevronLeft, ChevronRight, GalleryHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { uploadImage } from '../../lib/api';
import ImageLightbox from '../ImageLightbox';
import ImageCaptionField from './ImageCaptionField';

export interface CarouselImageItem {
  id: string;
  url: string;
  caption?: string;
}

export type CarouselVisibleCount = 1 | 2 | 3;

interface Props {
  images: CarouselImageItem[];
  visibleCount?: CarouselVisibleCount;
  editorMode?: boolean;
  onChange?: (images: CarouselImageItem[]) => void;
  onVisibleCountChange?: (count: CarouselVisibleCount) => void;
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
export default function CarouselBlock({
  images,
  visibleCount: configuredVisibleCount = 3,
  editorMode,
  onChange,
  onVisibleCountChange,
}: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<CarouselImageItem | null>(null);
  const isMobile = useIsMobile();
  const visibleCount = isMobile ? 1 : Math.min(configuredVisibleCount, images.length);
  const safeStartIdx = Math.min(currentIdx, Math.max(0, images.length - 1));

  useEffect(() => {
    setCurrentIdx(index => Math.min(index, Math.max(0, images.length - 1)));
  }, [images.length]);

  function addImage(url: string) {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    onChange?.([...images, { id, url }]);
  }

  function removeImage(id: string) {
    const next = images.filter(img => img.id !== id);
    onChange?.(next);
  }

  function updateCaption(id: string, caption: string) {
    onChange?.(images.map(img => img.id === id ? { ...img, caption } : img));
  }

  function goTo(idx: number) {
    setCurrentIdx(idx);
  }

  function prev() {
    goTo(safeStartIdx === 0 ? images.length - 1 : safeStartIdx - 1);
  }

  function next() {
    goTo(safeStartIdx === images.length - 1 ? 0 : safeStartIdx + 1);
  }

  function getVisibleImages(): CarouselImageItem[] {
    if (!images.length) return [];
    if (visibleCount <= 1 || images.length <= 1) return [images[safeStartIdx]];
    if (visibleCount === 2) {
      return [images[safeStartIdx], images[(safeStartIdx + 1) % images.length]];
    }
    return [
      images[(safeStartIdx - 1 + images.length) % images.length],
      images[safeStartIdx],
      images[(safeStartIdx + 1) % images.length],
    ];
  }

  const visibleImages = getVisibleImages();
  const centerIdx = !isMobile && visibleCount === 3 ? 1 : -1;

  // ── Editor mode ──
  if (editorMode) {
    return (
      <div className="rounded-[12px] border border-white/10 bg-white/[0.02] p-3 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-1.5 text-white/35 text-[0.75rem]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          <GalleryHorizontal size={13} strokeWidth={1.5} />
          <span>Carousel · {images.length} image{images.length !== 1 ? 's' : ''}</span>
          <span className="ml-auto text-white/25">Screens</span>
          <select
            value={configuredVisibleCount}
            aria-label="Screens visible in carousel"
            title="Screens visible in carousel"
            onChange={event => onVisibleCountChange?.(Number(event.target.value) as CarouselVisibleCount)}
            className="h-[25px] rounded-[6px] border border-white/10 bg-white/[0.04] px-1.5 text-[0.7rem] text-white/60 outline-none hover:border-white/25 hover:text-white cursor-pointer"
          >
            {[1, 2, 3].map(count => (
              <option key={count} value={count} className="bg-[#242424] text-white">
                {count}
              </option>
            ))}
          </select>
        </div>

        {/* Horizontal thumbnail strip */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
          {images.map(img => (
            <div key={img.id} className="shrink-0 w-[100px] flex flex-col gap-1">
              <div className="relative group/thumb h-[70px] rounded-[8px] overflow-hidden">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 size-[18px] flex items-center justify-center rounded-full bg-black/70 border border-white/15 text-white/50 hover:text-[#d25d5f] hover:bg-black/90 transition-all opacity-0 group-hover/thumb:opacity-100"
                >
                  <X size={9} strokeWidth={2.5} />
                </button>
              </div>
              <ImageCaptionField
                value={img.caption}
                onChange={caption => updateCaption(img.id, caption)}
                placeholder="Caption"
              />
            </div>
          ))}
          <StripUploadSlot onUploaded={addImage} />
        </div>

        {/* Mini carousel preview */}
        {images.length > 0 && (
          <div className="relative w-full">
            {images.length > 1 && (
              <button
                onClick={prev}
                aria-label="Previous carousel image"
                className="absolute left-1 top-1/2 z-10 hidden size-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 transition-all hover:bg-black/70 hover:text-white min-[900px]:-left-8 min-[900px]:flex"
              >
                <ChevronLeft size={14} />
              </button>
            )}
            <div className="relative min-w-0 flex-1 overflow-hidden">
              <div className="flex items-start py-5 md:py-8">
                {visibleCount <= 2 ? (
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={`${safeStartIdx}-${visibleCount}-${visibleImages.map(img => img.id).join('|')}`}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                      className="flex w-full min-w-0 items-start"
                    >
                      {visibleImages.map(img => (
                        <div
                          key={img.id}
                          className="flex min-w-0 shrink-0 items-start justify-center px-0 md:px-1"
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
                  </AnimatePresence>
                ) : (
                  visibleImages.map((img, i) => (
                    <motion.div
                      key={img.id}
                      layout="position"
                      className="flex min-w-0 shrink-0 items-start justify-center px-0 md:px-1"
                      style={{ width: `${100 / visibleCount}%` }}
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{
                        opacity: 1,
                        scale: i === centerIdx ? 1.12 : 1,
                        zIndex: i === centerIdx ? 1 : 0,
                      }}
                      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="block h-auto w-full object-contain"
                      />
                    </motion.div>
                  ))
                )}
              </div>
              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => goTo(i)}
                      className={`rounded-full transition-all ${i === safeStartIdx ? 'h-1.5 w-4 bg-white' : 'size-1.5 bg-white/35 hover:bg-white/60'}`}
                    />
                  ))}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <button
                onClick={next}
                aria-label="Next carousel image"
                className="absolute right-1 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 transition-all hover:bg-black/70 hover:text-white min-[900px]:-right-8"
              >
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Read-only carousel ────────────────────────────────────────────────────
  if (!images.length) return null;

  const current = images[safeStartIdx];

  return (
    <div className="select-none">
      {/* Slide area */}
      <div className="relative w-full">
        {images.length > 1 && (
          <button
            onClick={prev}
            aria-label="Previous carousel image"
            className="absolute left-1 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white min-[900px]:-left-12"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
        )}
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="flex items-start py-5 md:py-8">
              {visibleCount <= 2 ? (
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={`${safeStartIdx}-${visibleCount}-${visibleImages.map(img => img.id).join('|')}`}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                    className="flex w-full min-w-0 items-start"
                  >
                    {visibleImages.map(img => (
                      <div
                        key={img.id}
                        className="flex min-w-0 shrink-0 items-start justify-center px-0 md:px-1"
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
                </AnimatePresence>
              ) : (
                visibleImages.map((img, i) => (
                  <motion.div
                    key={img.id}
                    layout="position"
                    className="flex min-w-0 shrink-0 items-start justify-center px-0 md:px-1"
                    style={{ width: `${100 / visibleCount}%` }}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{
                      opacity: 1,
                      scale: i === centerIdx ? 1.12 : 1,
                      zIndex: i === centerIdx ? 1 : 0,
                    }}
                    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                  >
                    <img
                      src={img.url}
                      alt={img.caption || ''}
                      className="block h-auto w-full cursor-zoom-in object-contain"
                      onClick={() => setLightboxImage(img)}
                    />
                  </motion.div>
                ))
              )}
          </div>

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all ${
                    i === safeStartIdx
                      ? 'h-1.5 w-5 bg-white'
                      : 'size-1.5 bg-white/35 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        {images.length > 1 && (
          <button
            onClick={next}
            aria-label="Next carousel image"
            className="absolute right-1 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white min-[900px]:-right-12"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Caption */}
      {current?.caption && (
        <p
          className="mt-2 text-center text-[0.8rem] whitespace-pre-line"
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            color: 'rgba(255,255,255,0.35)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {current.caption}
        </p>
      )}
      {lightboxImage && (
        <ImageLightbox
          images={images.map(img => ({
            src: img.url,
            alt: img.caption || '',
          }))}
          initialIndex={Math.max(0, images.findIndex(img => img.id === lightboxImage.id))}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
