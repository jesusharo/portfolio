import { useState, useEffect } from 'react';
import { getAbout, updateAbout } from '../../lib/api';
import RichTextEditor from './RichTextEditor';

export default function AboutEditor() {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAbout().then(d => { setHtml(d.content_html || ''); setLoading(false); });
  }, []);

  async function save() {
    setSaving(true);
    await updateAbout(html);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return (
    <div className="flex items-center justify-center flex-1 text-white/30 text-[0.85rem] font-['Source_Sans_3',sans-serif]">
      Loading…
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-white/40 text-[0.8rem] font-['Source_Sans_3',sans-serif] mb-3">
          Rich text content for the About Me page. This replaces the static content.
        </p>
        <RichTextEditor content={html} onChange={setHtml} placeholder="Write your bio, experience, skills…" />
      </div>
      <div className="p-4 border-t border-white/10 shrink-0">
        <button
          onClick={save}
          disabled={saving}
          className="w-full py-3 rounded-[32px] bg-[#d25d5f] text-white text-[0.9rem] font-semibold font-['Source_Sans_3',sans-serif] hover:bg-[#c25052] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
