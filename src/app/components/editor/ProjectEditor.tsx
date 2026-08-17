import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Plus, GripVertical, X } from 'lucide-react';
import { updateProject, deleteProject } from '../../lib/api';
import RichTextEditor from './RichTextEditor';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ImageUploadField from './ImageUploadField';

interface ContentBlock {
  id: string;
  type: 'richtext' | 'image';
  html?: string;
  url?: string;
  caption?: string;
}

interface Project {
  id: string;
  name: string;
  type: string;
  slug: string;
  background_color: string;
  accent_color: string;
  logo_grid_image: string;
  logo_header_image: string;
  hero_image: string;
  content_blocks: ContentBlock[];
  description: string;
  hidden: boolean;
}

interface Props {
  project: Project;
  onBack: () => void;
  onDeleted: () => void;
  onSaved: (p: Project) => void;
}

function SortableBlock({ block, onUpdate, onDelete }: {
  block: ContentBlock;
  onUpdate: (id: string, data: Partial<ContentBlock>) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2 items-start group">
      <button {...attributes} {...listeners} className="mt-3 text-white/20 hover:text-white/50 cursor-grab active:cursor-grabbing shrink-0">
        <GripVertical size={14} />
      </button>
      <div className="flex-1">
        {block.type === 'richtext' ? (
          <RichTextEditor
            content={block.html || ''}
            onChange={html => onUpdate(block.id, { html })}
            placeholder="Write something…"
          />
        ) : (
          <div className="rounded-[12px] border border-white/10 bg-white/5 p-3 flex flex-col gap-2">
            <ImageUploadField
              value={block.url || ''}
              onChange={url => onUpdate(block.id, { url })}
              placeholder="Image URL or upload"
              inputClassName="flex-1 bg-transparent text-white/80 text-[0.85rem] outline-none placeholder:text-white/25 font-['Source_Sans_3',sans-serif] border-b border-white/10 pb-2"
              showPreview
            />
            <input
              type="text"
              value={block.caption || ''}
              onChange={e => onUpdate(block.id, { caption: e.target.value })}
              placeholder="Caption (optional)"
              className="bg-transparent text-white/40 text-[0.75rem] outline-none placeholder:text-white/20 font-['Source_Sans_3',sans-serif]"
            />
          </div>
        )}
      </div>
      <button
        onClick={() => onDelete(block.id)}
        className="mt-3 text-white/20 hover:text-[#d25d5f] transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ProjectEditor({ project, onBack, onDeleted, onSaved }: Props) {
  const [draft, setDraft] = useState<Project>({ ...project });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => { setDraft({ ...project }); }, [project.id]);

  function set(field: Partial<Project>) { setDraft(d => ({ ...d, ...field })); }

  function addBlock(type: 'richtext' | 'image') {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    setDraft(d => ({ ...d, content_blocks: [...d.content_blocks, { id, type }] }));
  }

  function updateBlock(id: string, data: Partial<ContentBlock>) {
    setDraft(d => ({ ...d, content_blocks: d.content_blocks.map(b => b.id === id ? { ...b, ...data } : b) }));
  }

  function deleteBlock(id: string) {
    setDraft(d => ({ ...d, content_blocks: d.content_blocks.filter(b => b.id !== id) }));
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setDraft(d => {
        const ids = d.content_blocks.map(b => b.id);
        const from = ids.indexOf(active.id as string);
        const to = ids.indexOf(over.id as string);
        return { ...d, content_blocks: arrayMove(d.content_blocks, from, to) };
      });
    }
  }

  async function save() {
    setSaving(true);
    try {
      const updated = await updateProject(draft.id, {
        name: draft.name, slug: draft.slug, hidden: draft.hidden,
        background_color: draft.background_color, accent_color: draft.accent_color,
        logo_grid_image: draft.logo_grid_image, logo_header_image: draft.logo_header_image,
        hero_image: draft.hero_image, content_blocks: draft.content_blocks,
        description: draft.description,
      });
      onSaved(updated);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!window.confirm(`Delete "${draft.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await deleteProject(draft.id);
    onDeleted();
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
        <button onClick={confirmDelete} disabled={deleting} className="text-white/20 hover:text-[#d25d5f] transition-colors">
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
            <label className={labelCls}>Slug</label>
            <input className={inputCls} value={draft.slug} onChange={e => set({ slug: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              className={`${inputCls} resize-none`} rows={3}
              value={draft.description} onChange={e => set({ description: e.target.value })}
            />
          </div>
        </div>

        {/* Colors */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelCls}>Card color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={draft.background_color || '#1c1c1c'}
                onChange={e => set({ background_color: e.target.value })}
                className="w-9 h-9 rounded-[8px] border border-white/10 bg-transparent cursor-pointer p-0.5"
              />
              <input className={`${inputCls} flex-1`} value={draft.background_color}
                onChange={e => set({ background_color: e.target.value })} />
            </div>
          </div>
          <div className="flex-1">
            <label className={labelCls}>Accent color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={draft.accent_color || '#1c1c1c'}
                onChange={e => set({ accent_color: e.target.value })}
                className="w-9 h-9 rounded-[8px] border border-white/10 bg-transparent cursor-pointer p-0.5"
              />
              <input className={`${inputCls} flex-1`} value={draft.accent_color}
                onChange={e => set({ accent_color: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="flex flex-col gap-3">
          {([
            ['logo_grid_image', 'Grid logo'],
            ['logo_header_image', 'Header logo'],
            ['hero_image', 'Hero image'],
          ] as const).map(([field, label]) => (
            <div key={field}>
              <label className={labelCls}>{label}</label>
              <ImageUploadField
                value={(draft as any)[field]}
                onChange={url => set({ [field]: url } as any)}
                placeholder="https://… or upload"
                inputClassName={`${inputCls} flex-1`}
              />
            </div>
          ))}
        </div>

        {/* Content blocks */}
        <div>
          <label className={labelCls}>Content blocks</label>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={draft.content_blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-3 mb-3">
                {draft.content_blocks.map(block => (
                  <SortableBlock key={block.id} block={block} onUpdate={updateBlock} onDelete={deleteBlock} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <div className="flex gap-2">
            <button onClick={() => addBlock('richtext')}
              className="flex items-center gap-1.5 text-white/40 hover:text-white text-[0.8rem] font-['Source_Sans_3',sans-serif] transition-colors border border-white/10 rounded-[8px] px-3 py-2 hover:border-white/25">
              <Plus size={14} /> Text block
            </button>
            <button onClick={() => addBlock('image')}
              className="flex items-center gap-1.5 text-white/40 hover:text-white text-[0.8rem] font-['Source_Sans_3',sans-serif] transition-colors border border-white/10 rounded-[8px] px-3 py-2 hover:border-white/25">
              <Plus size={14} /> Image block
            </button>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <button onClick={save} disabled={saving}
          className="w-full py-3 rounded-[32px] bg-[#d25d5f] text-white text-[0.9rem] font-semibold font-['Source_Sans_3',sans-serif] hover:bg-[#c25052] transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
