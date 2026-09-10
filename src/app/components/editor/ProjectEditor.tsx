import { useState, useEffect } from 'react';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowLeft, Check, Copy, Loader2, Share2, Trash2, X } from 'lucide-react';
import { createProjectReviewLink, updateProject, deleteProject } from '../../lib/api';
import ImageUploadField from './ImageUploadField';

interface Project {
  id: string;
  name: string;
  subtitle: string;
  subtitle_es?: string;
  type: string;
  slug: string;
  background_color: string;
  accent_color: string;
  text_color: string;
  logo_grid_image: string;
  logo_header_image: string;
  hero_image: string;
  hero_foreground_image: string;
  description: string;
  description_es?: string;
  description_alignment?: 'left' | 'center' | 'right' | 'justify';
  hidden: boolean;
}

interface Props {
  project: Project;
  onBack: () => void;
  onDeleted: () => void;
  onSaved: (p: Project) => void;
}

export default function ProjectEditor({ project, onBack, onDeleted, onSaved }: Props) {
  const [draft, setDraft] = useState<Project>({ ...project });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [reviewUrl, setReviewUrl] = useState('');
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState('');
  const [copied, setCopied] = useState(false);
  const [contentLanguage, setContentLanguage] = useState<'en' | 'es'>('en');

  useEffect(() => { setDraft({ ...project }); setSaveError(''); }, [project.id]);

  function set(field: Partial<Project>) { setDraft(d => ({ ...d, ...field })); }

  async function save() {
    setSaving(true);
    setSaveError('');
    try {
      const updated = await updateProject(draft.id, {
        name: draft.name,
        subtitle: draft.subtitle,
        subtitle_es: draft.subtitle_es || '',
        slug: draft.slug,
        hidden: draft.hidden,
        background_color: draft.background_color,
        accent_color: draft.accent_color,
        text_color: draft.text_color,
        logo_grid_image: draft.logo_grid_image,
        logo_header_image: draft.logo_header_image,
        hero_image: draft.hero_image,
        hero_foreground_image: draft.hero_foreground_image,
        description: draft.description,
        description_es: draft.description_es || '',
        description_alignment: draft.description_alignment || 'center',
      });
      onSaved(updated);
    } catch {
      setSaveError('Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!window.confirm(`Delete "${draft.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteProject(draft.id);
      onDeleted();
    } finally {
      setDeleting(false);
    }
  }

  async function openShareModal() {
    setShareOpen(true);
    setReviewUrl('');
    setShareError('');
    setCopied(false);
    setSharing(true);
    try {
      const result = await createProjectReviewLink(draft.id);
      setReviewUrl(`${window.location.origin}${result.path}`);
    } catch (err) {
      setShareError(err instanceof Error ? err.message : 'Could not create review link.');
    } finally {
      setSharing(false);
    }
  }

  async function copyReviewLink() {
    if (!reviewUrl) return;
    try {
      await navigator.clipboard.writeText(reviewUrl);
    } catch {
      const field = document.createElement('textarea');
      field.value = reviewUrl;
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-white/80 text-[0.85rem] outline-none focus:border-white/25 placeholder:text-white/25 font-["Source_Sans_3",sans-serif]';
  const labelCls = 'text-white/40 text-[0.72rem] uppercase tracking-wider font-["Source_Sans_3",sans-serif] mb-1 block';

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 shrink-0">
        <button onClick={onBack} className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-white text-[0.95rem] font-semibold font-['Source_Sans_3',sans-serif] flex-1 truncate">
          {draft.name || 'Untitled'}
        </h2>
        {draft.hidden && (
          <button
            type="button"
            onClick={openShareModal}
            className="text-white/30 hover:text-white transition-colors"
            title="Share private review link"
            aria-label="Share private review link"
          >
            <Share2 size={16} />
          </button>
        )}
        <button onClick={confirmDelete} disabled={deleting} className="text-white/20 hover:text-[#d25d5f] transition-colors disabled:opacity-50">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">

        {/* Basic fields */}
        <div className="flex flex-col gap-3">
          <div>
            <label className={labelCls}>Name</label>
            <input className={inputCls} value={draft.name} onChange={e => set({ name: e.target.value })} />
          </div>
           <div>
             <div className="mb-1 flex items-center justify-between">
             <label className={`${labelCls} mb-0`}>What I did</label>
             <div className="flex rounded-[7px] border border-white/10 bg-white/[0.03] p-0.5">
               {(['en', 'es'] as const).map(lang => <button key={lang} type="button" onClick={() => setContentLanguage(lang)} className={`rounded-[5px] px-2 py-1 text-[0.65rem] ${contentLanguage === lang ? 'bg-white/15 text-white' : 'text-white/35 hover:text-white'}`}>{lang === 'en' ? 'English' : 'Español'}</button>)}
             </div>
             </div>
            <input
              className={inputCls}
               value={contentLanguage === 'en' ? draft.subtitle || '' : draft.subtitle_es || ''}
               onChange={e => set(contentLanguage === 'en' ? { subtitle: e.target.value } : { subtitle_es: e.target.value })}
              placeholder="e.g. Product design, UX strategy & visual direction"
            />
          </div>
          <div>
            <label className={labelCls}>Slug</label>
            <input className={inputCls} value={draft.slug} onChange={e => set({ slug: e.target.value })} />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between gap-3">
              <label className={`${labelCls} mb-0`}>Description</label>
              <div className="flex items-center gap-2">
                <div className="flex rounded-[7px] border border-white/10 bg-white/[0.03] p-0.5">
                  {(['en', 'es'] as const).map(lang => <button key={lang} type="button" onClick={() => setContentLanguage(lang)} className={`rounded-[5px] px-2 py-1 text-[0.65rem] ${contentLanguage === lang ? 'bg-white/15 text-white' : 'text-white/35 hover:text-white'}`}>{lang === 'en' ? 'English' : 'Español'}</button>)}
                </div>
                <div className="flex items-center gap-0.5 rounded-[8px] border border-white/10 bg-white/[0.03] p-0.5">
                  {([
                  ['left', 'Align left', AlignLeft],
                  ['center', 'Align center', AlignCenter],
                  ['right', 'Align right', AlignRight],
                  ['justify', 'Justify text', AlignJustify],
                ] as const).map(([alignment, label, Icon]) => {
                  const isActive = (draft.description_alignment || 'center') === alignment;
                  return (
                    <button
                      key={alignment}
                      type="button"
                      onClick={() => set({ description_alignment: alignment })}
                      title={label}
                      aria-label={label}
                      aria-pressed={isActive}
                      className={`flex size-7 items-center justify-center rounded-[6px] transition-colors ${
                        isActive ? 'bg-white/20 text-white' : 'text-white/40 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={14} strokeWidth={1.5} />
                    </button>
                  );
                })}
                </div>
              </div>
            </div>
            <textarea
              className={`${inputCls} resize-none`} rows={4}
               value={contentLanguage === 'en' ? draft.description : draft.description_es || ''}
               onChange={e => set(contentLanguage === 'en' ? { description: e.target.value } : { description_es: e.target.value })}
              style={{ textAlign: draft.description_alignment || 'center' }}
            />
          </div>
        </div>

        {/* Colors */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelCls}>Card color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draft.background_color || '#1c1c1c'}
                onChange={e => set({ background_color: e.target.value })}
                className="w-9 h-9 rounded-[8px] border border-white/10 bg-transparent cursor-pointer p-0.5"
              />
              <input
                className={`${inputCls} flex-1`}
                value={draft.background_color}
                onChange={e => set({ background_color: e.target.value })}
              />
            </div>
          </div>
          <div className="flex-1">
            <label className={labelCls}>Accent color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draft.accent_color || '#1c1c1c'}
                onChange={e => set({ accent_color: e.target.value })}
                className="w-9 h-9 rounded-[8px] border border-white/10 bg-transparent cursor-pointer p-0.5"
              />
              <input
                className={`${inputCls} flex-1`}
                value={draft.accent_color}
                onChange={e => set({ accent_color: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div>
          <label className={labelCls}>Typography color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={draft.text_color || '#ffffff'}
              onChange={e => set({ text_color: e.target.value })}
              className="w-9 h-9 rounded-[8px] border border-white/10 bg-transparent cursor-pointer p-0.5"
            />
            <input
              className={inputCls}
              value={draft.text_color || '#ffffff'}
              onChange={e => set({ text_color: e.target.value })}
              placeholder="#ffffff"
            />
          </div>
        </div>

        {/* Images */}
        <div className="flex flex-col gap-3">
          {([
            ['logo_grid_image', 'Grid logo'],
            ['logo_header_image', 'Header logo'],
            ['hero_image', 'Hero background'],
            ['hero_foreground_image', 'Hero foreground (optional)'],
          ] as const).map(([field, label]) => (
            <div key={field}>
              <label className={labelCls}>{label}</label>
              <ImageUploadField
                value={(draft as any)[field] || ''}
                onChange={url => set({ [field]: url } as any)}
                placeholder="https://… or upload"
                inputClassName={`${inputCls} flex-1`}
              />
            </div>
          ))}
        </div>

        {/* Hint */}
        <p className="text-white/25 text-[0.75rem] font-['Source_Sans_3',sans-serif] border border-dashed border-white/10 rounded-[10px] px-3 py-3 text-center leading-relaxed">
          Content blocks are edited directly on the page.<br />Navigate to the project to add text & images.
        </p>
      </div>

      {/* Save button */}
      <div className="p-4 border-t border-white/10 shrink-0 flex flex-col gap-2">
        {saveError && (
          <p className="text-[#d25d5f] text-[0.75rem] font-['Source_Sans_3',sans-serif] text-center">{saveError}</p>
        )}
        <button
          onClick={save}
          disabled={saving}
          className="w-full py-3 rounded-[32px] bg-[#d25d5f] text-white text-[0.9rem] font-semibold font-['Source_Sans_3',sans-serif] hover:bg-[#c25052] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {shareOpen && (
        <div
          className="absolute inset-0 z-[70] flex items-center justify-center bg-black/65 p-5 backdrop-blur-sm"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setShareOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-link-title"
            className="w-full max-w-[360px] rounded-[16px] border border-white/12 bg-[#171717] p-5 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-white/60">
                <Share2 size={16} strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 id="review-link-title" className="text-[0.95rem] font-semibold text-white/90 font-['Source_Sans_3',sans-serif]">
                  Private review link
                </h3>
                <p className="mt-1 text-[0.75rem] leading-relaxed text-white/40 font-['Source_Sans_3',sans-serif]">
                  Anyone with this link can view this hidden project, but cannot edit it.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                className="text-white/30 transition-colors hover:text-white"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5">
              {sharing ? (
                <div className="flex h-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03] text-white/35">
                  <Loader2 size={15} className="animate-spin" />
                </div>
              ) : reviewUrl ? (
                <input
                  readOnly
                  value={reviewUrl}
                  onFocus={event => event.currentTarget.select()}
                  className="h-10 w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-3 text-[0.75rem] text-white/65 outline-none focus:border-white/25 font-['Source_Sans_3',sans-serif]"
                  aria-label="Private review link"
                />
              ) : (
                <div className="rounded-[10px] border border-red-300/20 bg-red-300/[0.05] px-3 py-2.5 text-[0.75rem] text-red-300 font-['Source_Sans_3',sans-serif]">
                  {shareError || 'Could not create review link.'}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={copyReviewLink}
              disabled={!reviewUrl || sharing}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-[24px] bg-[#d25d5f] py-2.5 text-[0.85rem] font-semibold text-white transition-colors hover:bg-[#c25052] disabled:opacity-40 font-['Source_Sans_3',sans-serif]"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Link copied' : 'Copy private link'}
            </button>

            <p className="mt-3 text-center text-[0.68rem] leading-relaxed text-white/25 font-['Source_Sans_3',sans-serif]">
              Creating a new link invalidates the previous one.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
