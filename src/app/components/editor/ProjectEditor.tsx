import { useState, useEffect } from 'react';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowLeft, Trash2 } from 'lucide-react';
import { updateProject, deleteProject } from '../../lib/api';
import ImageUploadField from './ImageUploadField';

interface Project {
  id: string;
  name: string;
  subtitle: string;
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

  useEffect(() => { setDraft({ ...project }); setSaveError(''); }, [project.id]);

  function set(field: Partial<Project>) { setDraft(d => ({ ...d, ...field })); }

  async function save() {
    setSaving(true);
    setSaveError('');
    try {
      const updated = await updateProject(draft.id, {
        name: draft.name,
        subtitle: draft.subtitle,
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
            <label className={labelCls}>What I did</label>
            <input
              className={inputCls}
              value={draft.subtitle || ''}
              onChange={e => set({ subtitle: e.target.value })}
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
            <textarea
              className={`${inputCls} resize-none`} rows={4}
              value={draft.description} onChange={e => set({ description: e.target.value })}
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
    </div>
  );
}
