import { useState, useEffect } from 'react';
import { getAbout, updateResume } from '../../lib/api';

export default function ResumeEditor() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAbout().then(d => { setText(d.resume_content || ''); setLoading(false); });
  }, []);

  async function save() {
    setSaving(true);
    await updateResume(text);
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
          Plain text summary of your experience, roles, dates, and skills. The AI agent uses this as context when answering questions about your background.
        </p>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={"Senior Product Designer at Acme Corp (2021–present)\nLead UX Designer at Startup XYZ (2018–2021)\nSkills: Figma, user research, prototyping, design systems…"}
          className="w-full h-[360px] bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-[12px] px-4 py-3 text-[0.85rem] text-white leading-[1.6] font-['Source_Sans_3',sans-serif] placeholder:text-white/20 outline-none resize-none focus:border-white/20 transition-colors"
        />
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
