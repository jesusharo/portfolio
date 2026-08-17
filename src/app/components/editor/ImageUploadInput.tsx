import { useRef, useState } from 'react';
import { Upload, Link, X, Loader2 } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

function getToken() {
  return localStorage.getItem('editor_token') || '';
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/images/editor/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Upload failed');
  }
  const data = await res.json();
  return data.url;
}

export default function ImageUploadInput({ value, onChange, label, placeholder = 'Paste URL or upload…' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [urlMode, setUrlMode] = useState(!value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      onChange(url);
      setUrlMode(false);
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const labelCls = 'text-white/40 text-[0.72rem] uppercase tracking-wider font-["Source_Sans_3",sans-serif] mb-1 block';

  return (
    <div>
      {label && <label className={labelCls}>{label}</label>}

      {/* Preview */}
      {value && !urlMode && (
        <div className="relative group mb-2">
          <img
            src={value}
            alt=""
            className="w-full rounded-[10px] object-cover max-h-[160px]"
            onError={() => setError('Image failed to load')}
          />
          <div className="absolute inset-0 rounded-[10px] bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setUrlMode(true)}
              className="px-3 py-1.5 rounded-[8px] bg-white/15 text-white text-[0.75rem] font-['Source_Sans_3',sans-serif] hover:bg-white/25 transition-colors flex items-center gap-1.5"
            >
              <Link size={12} /> Change URL
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-3 py-1.5 rounded-[8px] bg-white/15 text-white text-[0.75rem] font-['Source_Sans_3',sans-serif] hover:bg-white/25 transition-colors flex items-center gap-1.5"
            >
              <Upload size={12} /> Upload new
            </button>
            <button
              type="button"
              onClick={() => { onChange(''); setUrlMode(true); }}
              className="p-1.5 rounded-[8px] bg-white/15 text-white hover:bg-[#d25d5f]/80 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Drop zone / URL input when no image or in URL mode */}
      {(!value || urlMode) && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className="rounded-[10px] border border-dashed border-white/15 bg-white/[0.03] hover:border-white/30 transition-colors"
        >
          {urlMode ? (
            <div className="flex items-center gap-2 px-3 py-2">
              <Link size={14} className="text-white/30 shrink-0" />
              <input
                ref={inputRef}
                type="url"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-white/80 text-[0.85rem] outline-none placeholder:text-white/25 font-['Source_Sans_3',sans-serif]"
                onBlur={() => { if (value) setUrlMode(false); }}
                onKeyDown={e => { if (e.key === 'Enter' && value) { e.preventDefault(); setUrlMode(false); } }}
                autoFocus={!value}
              />
              {value && (
                <button type="button" onClick={() => setUrlMode(false)} className="text-white/30 hover:text-white transition-colors">
                  <X size={12} />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full py-6 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors"
            >
              {uploading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Upload size={20} />
              )}
              <span className="text-[0.78rem] font-['Source_Sans_3',sans-serif]">
                {uploading ? 'Uploading…' : 'Click or drag an image'}
              </span>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setUrlMode(true); }}
                className="text-[0.72rem] text-white/30 hover:text-white/60 transition-colors underline underline-offset-2"
              >
                or paste a URL
              </button>
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="text-[#d25d5f] text-[0.75rem] mt-1 font-['Source_Sans_3',sans-serif]">{error}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
}
