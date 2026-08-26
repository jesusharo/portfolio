import { useEffect, useRef, useState } from 'react';
import { Check, Image as ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';
import { getSiteSettings, updateFavicon, uploadImage } from '../../lib/api';
import { applyFavicon } from '../../lib/favicon';

export default function GeneralEditor() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [faviconUrl, setFaviconUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSiteSettings()
      .then(settings => setFaviconUrl(settings.favicon_url || ''))
      .catch(() => setError('Could not load site settings.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleFile(file: File | null | undefined) {
    if (!file || !file.type.startsWith('image/')) {
      setError('Choose a supported image file.');
      return;
    }

    setUploading(true);
    setError('');
    setSaved(false);
    try {
      const result = await uploadImage(file);
      setFaviconUrl(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function save() {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const result = await updateFavicon(faviconUrl);
      setFaviconUrl(result.favicon_url);
      applyFavicon(result.favicon_url);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save favicon.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full text-white/30 text-[0.85rem] font-['Source_Sans_3',sans-serif]">
      Loading…
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-white/40 text-[0.8rem] font-['Source_Sans_3',sans-serif] mb-5">
          General site settings that apply across your portfolio.
        </p>

        <section className="rounded-[12px] border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 text-white/75 text-[0.9rem] font-semibold font-['Source_Sans_3',sans-serif]">
            <ImageIcon size={16} strokeWidth={1.5} />
            Site favicon
          </div>
          <p className="mt-1.5 text-white/35 text-[0.75rem] leading-relaxed font-['Source_Sans_3',sans-serif]">
            This icon appears in the browser tab and bookmarks.
          </p>

          <div className="mt-5 flex items-center gap-4">
            <div className="size-16 shrink-0 rounded-[12px] border border-white/10 bg-white/[0.06] flex items-center justify-center overflow-hidden">
              <img
                src={faviconUrl || '/favicon.png'}
                alt="Favicon preview"
                className="size-10 object-contain"
              />
            </div>
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 rounded-[8px] border border-white/15 px-3 py-2 text-[0.8rem] text-white/65 hover:border-white/30 hover:text-white transition-colors disabled:opacity-50 font-['Source_Sans_3',sans-serif]"
              >
                {uploading
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Upload size={14} strokeWidth={1.5} />
                }
                {uploading ? 'Uploading…' : 'Choose image'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
                className="hidden"
                onChange={event => handleFile(event.target.files?.[0])}
              />
              <p className="mt-2 text-white/25 text-[0.7rem] font-['Source_Sans_3',sans-serif]">
                PNG, JPG, GIF, WebP or AVIF · max 8 MB
              </p>
            </div>
          </div>

          {faviconUrl && (
            <button
              type="button"
              onClick={() => { setFaviconUrl(''); setSaved(false); setError(''); }}
              className="mt-4 flex items-center gap-1.5 text-[0.75rem] text-white/35 hover:text-red-300 transition-colors font-['Source_Sans_3',sans-serif]"
            >
              <Trash2 size={13} strokeWidth={1.5} />
              Restore default favicon
            </button>
          )}
        </section>

        {error && (
          <p className="mt-3 text-[0.75rem] text-red-300 font-['Source_Sans_3',sans-serif]">
            {error}
          </p>
        )}
      </div>

      <div className="p-4 border-t border-white/10 shrink-0">
        <button
          onClick={save}
          disabled={saving || uploading}
          className="w-full py-3 rounded-[32px] bg-[#d25d5f] text-white text-[0.9rem] font-semibold font-['Source_Sans_3',sans-serif] hover:bg-[#c25052] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? <><Check size={15} className="inline mr-1" /> Saved</> : 'Save changes'}
        </button>
      </div>
    </div>
  );
}