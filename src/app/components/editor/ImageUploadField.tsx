import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { uploadImage } from '../../lib/api';

interface Props {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  inputClassName?: string;
  showPreview?: boolean;
}

export default function ImageUploadField({
  value,
  onChange,
  placeholder = 'https://… or upload',
  inputClassName = '',
  showPreview = false,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File | undefined | null) {
    if (!file) return;
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

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <input
          className={inputClassName}
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          title="Upload image"
          className="shrink-0 flex items-center gap-1.5 text-white/40 hover:text-white text-[0.78rem] font-['Source_Sans_3',sans-serif] transition-colors border border-white/10 rounded-[8px] px-3 py-2 hover:border-white/25 disabled:opacity-50"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
          className="hidden"
          onChange={e => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && (
        <span className="text-[#d25d5f] text-[0.72rem] font-['Source_Sans_3',sans-serif]">{error}</span>
      )}
      {showPreview && value && (
        <img src={value} alt="" className="rounded-[8px] max-h-[200px] object-cover w-full" />
      )}
    </div>
  );
}
