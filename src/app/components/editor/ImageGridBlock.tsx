import { useRef, useState } from 'react';
import { X, Plus, Loader2, LayoutGrid } from 'lucide-react';
import { uploadImage } from '../../lib/api';
import ImageLightbox from '../ImageLightbox';

export interface GridImageItem {
  id: string;
  url: string;
  caption?: string;
}

interface Props {
  images: GridImageItem[];
  columns: 2 | 3;
  editorMode?: boolean;
  onChange?: (images: GridImageItem[], columns: 2 | 3) => void;
}

// ─── Mini upload slot ─────────────────────────────────────────────────────────
function UploadSlot({ onUploaded }: { onUploaded: (url: string) => void }) {
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
      className={`aspect-video rounded-[8px] border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all select-none ${
        dragging
          ? 'border-white/50 bg-white/[0.07]'
          : 'border-white/15 hover:border-white/28 hover:bg-white/[0.03]'
      }`}
    >
      {uploading
        ? <Loader2 size={18} strokeWidth={1.5} className="animate-spin text-white/35" />
        : <Plus size={18} strokeWidth={1.5} className="text-white/25" />
      }
      <span className="text-white/20 text-[0.68rem]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
        {uploading ? 'Uploading…' : 'Add image'}
      </span>
      <input
        ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

// ─── Image slot (filled) ──────────────────────────────────────────────────────
function FilledSlot({
  item,
  onRemove,
}: {
  item: GridImageItem;
  onRemove: () => void;
}) {
  return (
    <div className="relative group/slot min-w-0 overflow-hidden">
      <img src={item.url} alt={item.caption || ''} className="block h-auto w-full object-contain" />
      <button
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 size-[22px] flex items-center justify-center rounded-full bg-black/60 border border-white/15 text-white/50 hover:text-[#d25d5f] hover:bg-black/80 transition-all opacity-0 group-hover/slot:opacity-100"
      >
        <X size={11} strokeWidth={2} />
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ImageGridBlock({ images, columns, editorMode, onChange }: Props) {
  const [lightboxImage, setLightboxImage] = useState<GridImageItem | null>(null);

  function setColumns(c: 2 | 3) {
    onChange?.(images, c);
  }

  function addImage(url: string) {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    onChange?.([...images, { id, url }], columns);
  }

  function removeImage(id: string) {
    onChange?.(images.filter(img => img.id !== id), columns);
  }

  const colClass = columns === 3 ? 'grid-cols-3' : 'grid-cols-2';

  // ── Editor mode ──
  if (editorMode) {
    return (
      <div className="rounded-[12px] border border-white/10 bg-white/[0.02] p-3 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/35 text-[0.75rem]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            <LayoutGrid size={13} strokeWidth={1.5} />
            Image Grid
          </div>
          {/* Column toggle */}
          <div className="flex gap-1 bg-white/5 rounded-[8px] p-0.5">
            {([2, 3] as const).map(n => (
              <button
                key={n}
                onClick={() => setColumns(n)}
                className={`px-2.5 py-1 rounded-[6px] text-[0.72rem] transition-colors ${
                  columns === n
                    ? 'bg-white/12 text-white'
                    : 'text-white/30 hover:text-white'
                }`}
                style={{ fontFamily: "'Source Sans 3', sans-serif" }}
              >
                {n} col
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className={`grid ${colClass} gap-2`}>
          {images.map(img => (
            <FilledSlot key={img.id} item={img} onRemove={() => removeImage(img.id)} />
          ))}
          <UploadSlot onUploaded={addImage} />
        </div>
      </div>
    );
  }

  // ── Read-only mode ──
  if (!images.length) return null;
  return (
    <>
      <div className={`grid ${colClass} gap-2`}>
        {images.map(img => (
          <figure key={img.id} className="m-0">
            <img
              src={img.url}
              alt={img.caption || ''}
              className="block h-auto w-full cursor-zoom-in object-contain"
              onClick={() => setLightboxImage(img)}
            />
            {img.caption && (
              <figcaption className="text-white/35 text-[0.75rem] mt-1 text-center" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.url}
          alt={lightboxImage.caption || ''}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </>
  );
}
