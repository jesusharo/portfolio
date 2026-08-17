import { useRef, useState, useCallback } from 'react';
import { Upload, Loader2, X, ImageIcon } from 'lucide-react';
import { uploadImage } from '../../lib/api';

interface Props {
  value: string;
  onChange: (url: string) => void;
  caption?: string;
  onCaptionChange?: (caption: string) => void;
}

export default function ImageDropZone({ value, onChange, caption, onCaptionChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File | null | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Only image files are supported.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    // Only trigger if leaving the drop zone entirely (not a child element)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragging(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }, []);

  // ── Image already set: show preview ──────────────────────────────────────
  if (value) {
    return (
      <div className="flex flex-col gap-3">
        <div className="relative group/preview rounded-[12px] overflow-hidden">
          <img
            src={value}
            alt=""
            className="w-full object-cover rounded-[12px]"
            style={{ maxHeight: 400 }}
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/40 transition-colors rounded-[12px] flex items-center justify-center gap-3 opacity-0 group-hover/preview:opacity-100">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white text-[0.8rem] font-['Source_Sans_3',sans-serif] transition-colors backdrop-blur-sm"
            >
              {uploading
                ? <><Loader2 size={13} className="animate-spin" /> Uploading…</>
                : <><Upload size={13} /> Replace</>
              }
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="size-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-[#d25d5f] border border-white/20 text-white/70 hover:text-white transition-colors backdrop-blur-sm"
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {error && (
          <span className="text-[#d25d5f] text-[0.75rem] font-['Source_Sans_3',sans-serif]">{error}</span>
        )}

        {onCaptionChange !== undefined && (
          <input
            type="text"
            value={caption || ''}
            onChange={e => onCaptionChange(e.target.value)}
            placeholder="Caption (optional)"
            className="bg-transparent text-white/40 text-[0.8rem] outline-none placeholder:text-white/20 w-full border-b border-white/[0.06] pb-1 focus:border-white/20 transition-colors"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
          />
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
          className="hidden"
          onChange={e => handleFile(e.target.files?.[0])}
        />
      </div>
    );
  }

  // ── Empty: show drop zone ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        className={`
          relative w-full rounded-[12px] border-2 border-dashed cursor-pointer
          flex flex-col items-center justify-center gap-3 py-12 px-6
          transition-all duration-150 select-none
          ${dragging
            ? 'border-white/50 bg-white/[0.06] scale-[1.01]'
            : 'border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
          }
        `}
      >
        {uploading ? (
          <>
            <Loader2 size={28} strokeWidth={1.5} className="text-white/40 animate-spin" />
            <span className="text-white/40 text-[0.82rem] font-['Source_Sans_3',sans-serif]">
              Uploading…
            </span>
          </>
        ) : dragging ? (
          <>
            <ImageIcon size={28} strokeWidth={1.5} className="text-white/70" />
            <span className="text-white/70 text-[0.85rem] font-['Source_Sans_3',sans-serif]">
              Drop to upload
            </span>
          </>
        ) : (
          <>
            <Upload size={24} strokeWidth={1.5} className="text-white/25" />
            <div className="text-center">
              <p className="text-white/45 text-[0.85rem] font-['Source_Sans_3',sans-serif]">
                Drag an image here
              </p>
              <p className="text-white/25 text-[0.75rem] font-['Source_Sans_3',sans-serif] mt-0.5">
                or click to browse
              </p>
            </div>
            <span className="text-white/15 text-[0.7rem] font-['Source_Sans_3',sans-serif]">
              JPG · PNG · GIF · WebP · AVIF
            </span>
          </>
        )}
      </div>

      {error && (
        <span className="text-[#d25d5f] text-[0.75rem] font-['Source_Sans_3',sans-serif]">{error}</span>
      )}

      {onCaptionChange !== undefined && (
        <input
          type="text"
          value={caption || ''}
          onChange={e => onCaptionChange(e.target.value)}
          placeholder="Caption (optional)"
          className="bg-transparent text-white/40 text-[0.8rem] outline-none placeholder:text-white/20 w-full border-b border-white/[0.06] pb-1 focus:border-white/20 transition-colors"
          style={{ fontFamily: "'Source Sans 3', sans-serif" }}
        />
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
