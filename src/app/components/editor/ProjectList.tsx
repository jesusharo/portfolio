import { useState } from 'react';
import { GripVertical, Eye, EyeOff, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { createProject, updateProject, reorderProjects } from '../../lib/api';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Project {
  id: string;
  name: string;
  hidden: boolean;
  background_color: string;
  [key: string]: unknown;
}

interface Props {
  projects: Project[];
  type: 'ui_project' | 'case_study';
  onSelect: (p: Project) => void;
  onListChange: (list: Project[]) => void;
}

function SortableItem({ project, onSelect, onToggleHide }: {
  project: Project;
  onSelect: () => void;
  onToggleHide: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 py-2.5 px-3 rounded-[12px] bg-white/[0.03] border border-white/[0.06] hover:border-white/15 group transition-colors"
    >
      <button {...attributes} {...listeners} className="text-white/20 hover:text-white/50 cursor-grab active:cursor-grabbing shrink-0">
        <GripVertical size={14} />
      </button>

      {/* Color swatch */}
      <div
        className="size-[28px] rounded-[6px] shrink-0"
        style={{ backgroundColor: project.background_color || '#333' }}
      />

      <span className={`flex-1 text-[0.85rem] font-['Source_Sans_3',sans-serif] truncate ${project.hidden ? 'text-white/30 line-through' : 'text-white/80'}`}>
        {project.name}
      </span>

      <button onClick={onToggleHide} className="text-white/20 hover:text-white/60 transition-colors shrink-0">
        {project.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>

      <button onClick={onSelect} className="text-white/20 hover:text-white/60 transition-colors shrink-0">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function ProjectList({ projects, type, onSelect, onListChange }: Props) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const ids = projects.map(p => p.id);
      const from = ids.indexOf(active.id as string);
      const to = ids.indexOf(over.id as string);
      const reordered = arrayMove(projects, from, to);
      onListChange(reordered);
      await reorderProjects(reordered.map(p => p.id));
    }
  }

  async function handleToggleHide(project: Project) {
    const updated = { ...project, hidden: !project.hidden };
    onListChange(projects.map(p => p.id === project.id ? updated : p));
    await updateProject(project.id, { hidden: !project.hidden });
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(false);
    const p = await createProject(type, newName.trim());
    onListChange([...projects, p]);
    setNewName('');
    onSelect(p);
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1">
            {projects.map(p => (
              <SortableItem
                key={p.id}
                project={p}
                onSelect={() => onSelect(p)}
                onToggleHide={() => handleToggleHide(p)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add new */}
      {adding ? (
        <form onSubmit={handleAdd} className="flex gap-2 mt-2">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Project name"
            className="flex-1 bg-white/5 border border-white/15 rounded-[10px] px-3 py-2 text-white text-[0.85rem] outline-none focus:border-white/30 placeholder:text-white/25 font-['Source_Sans_3',sans-serif]"
          />
          <button type="submit" className="px-4 py-2 rounded-[10px] bg-[#d25d5f] text-white text-[0.8rem] font-['Source_Sans_3',sans-serif] hover:bg-[#c25052] transition-colors">Add</button>
          <button type="button" onClick={() => { setAdding(false); setNewName(''); }} className="px-3 py-2 rounded-[10px] border border-white/10 text-white/40 text-[0.8rem] hover:text-white transition-colors">✕</button>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 text-white/40 hover:text-white text-[0.82rem] font-['Source_Sans_3',sans-serif] transition-colors mt-2 border border-dashed border-white/10 rounded-[12px] px-4 py-3 hover:border-white/25 justify-center"
        >
          <Plus size={14} /> New project
        </button>
      )}
    </div>
  );
}
