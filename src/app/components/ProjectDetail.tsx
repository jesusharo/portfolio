import { useEffect, useLayoutEffect, useState, useRef, type CSSProperties, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Plus, AlignLeft, Image as ImageIcon, X, LayoutGrid, GalleryHorizontal, SeparatorHorizontal, GripVertical } from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNetworkState } from '../context/NetworkStateContext';
import { getProjects, getEditorProjects, updateProject } from '../lib/api';
import RichTextEditor from './editor/RichTextEditor';
import ImageDropZone from './editor/ImageDropZone';
import ImageGridBlock, { type GridImageItem } from './editor/ImageGridBlock';
import CarouselBlock, { type CarouselImageItem, type CarouselVisibleCount } from './editor/CarouselBlock';
import ImageLightbox from './ImageLightbox';
import HeroParallax from './HeroParallax';

type Mode = 'projects' | 'cases';
type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved' | 'error';

interface ContentBlock {
  id: string;
  type: 'richtext' | 'image' | 'imagegrid' | 'carousel' | 'divider';
  // richtext
  html?: string;
  // image (single)
  url?: string;
  caption?: string;
  // imagegrid & carousel
  images?: GridImageItem[];
  columns?: 2 | 3;
  visible_count?: CarouselVisibleCount;
}

interface Project {
  id: string;
  name: string;
  subtitle?: string;
  background_color: string;
  accent_color: string;
  text_color?: string;
  description: string;
  description_alignment?: 'left' | 'center' | 'right' | 'justify';
  hero_image: string;
  hero_foreground_image?: string;
  content_blocks: ContentBlock[] | string;
}

function parseBlocks(raw: ContentBlock[] | string | undefined): ContentBlock[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw as string); } catch { return []; }
}

// ─── Add-block button ────────────────────────────────────────────────────────

type BlockType = ContentBlock['type'];

const BLOCK_OPTIONS: { type: BlockType; label: string; Icon: React.ElementType }[] = [
  { type: 'richtext',   label: 'Text',       Icon: AlignLeft },
  { type: 'image',      label: 'Image',      Icon: ImageIcon },
  { type: 'imagegrid',  label: 'Grid',       Icon: LayoutGrid },
  { type: 'carousel',   label: 'Carousel',   Icon: GalleryHorizontal },
  { type: 'divider',    label: 'Divider',    Icon: SeparatorHorizontal },
];

function AddBlockButton({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center py-3 group/add">
      {/* Divider line */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/0 group-hover/add:bg-white/12 transition-colors pointer-events-none" />
      {/* + pill */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        className="relative z-10 flex items-center justify-center size-7 rounded-full border border-white/0 group-hover/add:border-white/25 bg-transparent group-hover/add:bg-[rgba(28,28,28,0.85)] text-white/0 group-hover/add:text-white/50 hover:!border-white/50 hover:!text-white hover:!bg-[rgba(28,28,28,0.98)] transition-all duration-150 backdrop-blur-sm"
      >
        <Plus size={14} strokeWidth={2} />
      </button>

      {/* Dropdown — 2×2 grid of block types */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 grid grid-cols-2 gap-1 bg-[rgba(14,14,14,0.98)] border border-white/15 rounded-xl p-1.5 shadow-2xl"
            >
              {BLOCK_OPTIONS.map(({ type, label, Icon }, i) => (
                <button
                  key={type}
                  onClick={() => { onAdd(type); setMenuOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-[8px] hover:bg-white/10 text-white/60 hover:text-white text-[0.8rem] transition-colors whitespace-nowrap ${
                    i === BLOCK_OPTIONS.length - 1 && BLOCK_OPTIONS.length % 2 !== 0
                      ? 'col-span-2 justify-center'
                      : ''
                  }`}
                  style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  <Icon size={13} strokeWidth={1.5} /> {label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SortableContentSection({ id, children }: { id: string; children: ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.55 : 1,
      }}
      className={`relative group/block mb-1 ${isDragging ? 'z-20' : ''}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Reorder section"
        title="Drag to reorder section"
        className="absolute -left-7 top-2 z-20 flex size-6 touch-none cursor-grab items-center justify-center rounded-[6px] text-white/35 opacity-60 transition-colors hover:bg-white/10 hover:text-white/80 focus-visible:bg-white/10 focus-visible:text-white active:cursor-grabbing md:opacity-0 md:group-hover/block:opacity-100"
      >
        <GripVertical size={15} strokeWidth={1.7} />
      </button>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProjectDetail({ mode }: { mode: Mode }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    setNetworkState,
    setPageBackground,
    setDetailTextColor,
    editorMode,
    bumpDataVersion,
    dataVersion,
    saveRequestVersion,
  } = useNetworkState();
  const [items, setItems] = useState<Project[]>([]);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const apiType = mode === 'projects' ? 'ui_project' : 'case_study';
  const listPath = mode === 'projects' ? '/projects' : '/cases';
  const detailPath = listPath;

  // Fetch items — use editor API when in editor mode (includes hidden projects).
  // Guard against non-array responses (e.g. 401 error JSON) to prevent render crashes.
  useEffect(() => {
    if (editorMode) {
      getEditorProjects(apiType)
        .then(data => { if (Array.isArray(data)) setItems(data as Project[]); })
        .catch(() => {}); // auth failure: keep existing items list
    } else {
      getProjects(apiType)
        .then(data => { if (Array.isArray(data)) setItems(data); })
        .catch(() => {});
    }
  }, [apiType, editorMode, dataVersion]);

  const currentIndex = items.findIndex(p => p.id === id);
  const item = items[currentIndex] ?? null;
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 55 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    if (deltaX < 0 && nextItem) {
      navigate(`${detailPath}/${nextItem.id}`);
    } else if (deltaX > 0 && prevItem) {
      navigate(`${detailPath}/${prevItem.id}`);
    }
  }

  // ── Inline content editing state ──────────────────────────────────────────
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blockSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 5 } }),
    useSensor(KeyboardSensor),
  );
  // Keep a ref to contentBlocks so the flush-save effect always has the latest value
  const contentBlocksRef = useRef<ContentBlock[]>([]);
  useEffect(() => { contentBlocksRef.current = contentBlocks; }, [contentBlocks]);
  // Track previous saveRequestVersion so we only act on new increments
  const prevSaveReqRef = useRef(saveRequestVersion);

  // Reset content blocks only when project ID changes (not on re-fetches)
  useEffect(() => {
    if (!item) return;
    setContentBlocks(parseBlocks(item.content_blocks));
    setSaveStatus('idle');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
  }, [item?.id]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, []);

  // Flush pending save immediately when "Save changes" is clicked in Root
  useEffect(() => {
    if (saveRequestVersion === prevSaveReqRef.current) return;
    prevSaveReqRef.current = saveRequestVersion;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    // Always flush so changes made right before "Save changes" are not lost
    doSave(contentBlocksRef.current);
  }, [saveRequestVersion]);

  function scheduleAutoSave(blocks: ContentBlock[]) {
    setSaveStatus('unsaved');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => doSave(blocks), 1500);
  }

  async function doSave(blocks: ContentBlock[]) {
    if (!item) return;
    setSaveStatus('saving');
    try {
      await updateProject(item.id, { content_blocks: blocks });
      setSaveStatus('saved');
      bumpDataVersion();
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch {
      setSaveStatus('error');
    }
  }

  function insertBlock(type: BlockType, atIndex: number) {
    const blockId = Date.now().toString(36) + Math.random().toString(36).slice(2);
    let newBlock: ContentBlock = { id: blockId, type };
    if (type === 'imagegrid') newBlock = { ...newBlock, images: [], columns: 2 };
    if (type === 'carousel')  newBlock = { ...newBlock, images: [], visible_count: 3 };
    const next = [
      ...contentBlocks.slice(0, atIndex),
      newBlock,
      ...contentBlocks.slice(atIndex),
    ];
    setContentBlocks(next);
    scheduleAutoSave(next);
  }

  function removeBlock(blockId: string) {
    const next = contentBlocks.filter(b => b.id !== blockId);
    setContentBlocks(next);
    scheduleAutoSave(next);
  }

  function updateBlock(blockId: string, data: Partial<ContentBlock>) {
    const next = contentBlocks.map(b => b.id === blockId ? { ...b, ...data } : b);
    setContentBlocks(next);
    scheduleAutoSave(next);
  }

  function handleBlockDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = contentBlocks.findIndex(block => block.id === active.id);
    const to = contentBlocks.findIndex(block => block.id === over.id);
    if (from < 0 || to < 0) return;

    const next = arrayMove(contentBlocks, from, to);
    setContentBlocks(next);
    scheduleAutoSave(next);
  }

  // ── Background / keyboard shortcuts ──────────────────────────────────────
  useLayoutEffect(() => {
    setNetworkState('conversation');
    if (item) {
      setPageBackground(item.accent_color || item.background_color);
      setDetailTextColor(/^#[0-9a-f]{6}$/i.test(item.text_color || '') ? item.text_color! : '#ffffff');
    }
    return () => {
      setNetworkState('idle');
      setDetailTextColor(null);
    };
  }, [item?.accent_color, item?.background_color, item?.text_color]);

  useEffect(() => {
    if (items.length > 0 && !item) navigate(listPath);
  }, [item, items.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Image previews own the arrow keys; do not navigate between projects
      // while a grid, carousel, or standalone image is open.
      if (document.querySelector('[data-image-lightbox="true"]')) return;

      // Don't hijack keyboard shortcuts when focus is inside an editable element
      // (inputs, textareas, Tiptap contenteditable, etc.)
      const el = document.activeElement as HTMLElement | null;
      if (!el) return;
      const tag = el.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || el.contentEditable === 'true') return;

      if (e.key === 'Escape') navigate(listPath);
      if (e.key === 'ArrowLeft' && prevItem) navigate(`${detailPath}/${prevItem.id}`);
      if (e.key === 'ArrowRight' && nextItem) navigate(`${detailPath}/${nextItem.id}`);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prevItem, nextItem, navigate, listPath, detailPath]);

  if (!item) return null;

  const paragraphs = (item.description ?? '').split('\n\n').filter(Boolean);
  const accentColor = item.accent_color || item.background_color || '#1c1c1c';
  const textColor = /^#[0-9a-f]{6}$/i.test(item.text_color || '') ? item.text_color! : '#ffffff';
  const descriptionAlignment = ['left', 'center', 'right', 'justify'].includes(item.description_alignment || '')
    ? item.description_alignment!
    : 'center';
  const projectBodyStyle = {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    '--project-text-color': textColor,
  } as CSSProperties;

  return (
    <div
      className="absolute inset-0 overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

        {/* ── Sticky header ─────────────────────────────────────────────── */}
        <motion.div
          className="sticky top-0 relative flex items-center justify-center px-6 py-5 gap-6"
          style={{ zIndex: 20 }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={false}
            animate={{
              background: `linear-gradient(to bottom, ${accentColor} 0%, transparent 100%)`,
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={false}
            animate={{ backgroundColor: accentColor }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ opacity: 0.5 }}
          />
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            onClick={() => prevItem ? navigate(`${detailPath}/${prevItem.id}`) : navigate(listPath)}
            className="relative z-10 hidden md:flex size-[36px] items-center justify-center rounded-full border border-white/30 text-white/70 hover:text-white hover:bg-[rgba(255,255,255,0.15)] transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={1.5} style={{ color: textColor }} />
          </motion.button>

          <div className="relative z-10 min-w-0 max-w-[min(55vw,520px)] text-center">
            <h1
              className="truncate text-[1.25rem] font-semibold uppercase"
              style={{ fontFamily: "'Source Sans 3', sans-serif", letterSpacing: '0.2em', color: textColor }}
            >
              {item.name}
            </h1>
            {item.subtitle?.trim() && (
              <p
                className="mt-0.5 hidden truncate text-[0.72rem] leading-tight md:block opacity-55"
                style={{ fontFamily: "'Source Sans 3', sans-serif", color: textColor }}
              >
                {item.subtitle}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            onClick={() => nextItem ? navigate(`${detailPath}/${nextItem.id}`) : navigate(listPath)}
            className="relative z-10 hidden md:flex size-[36px] items-center justify-center rounded-full border border-white/30 text-white/70 hover:text-white hover:bg-[rgba(255,255,255,0.15)] transition-colors"
          >
            <ArrowRight size={20} strokeWidth={1.5} style={{ color: textColor }} />
          </motion.button>
        </motion.div>

        {/* Keep the mobile subtitle out of the navigation row so it cannot
            overlap the next/close controls on narrow screens. */}
        {item.subtitle?.trim() && (
          <div className="px-8 pt-3 md:hidden">
            <p
              className="text-center text-[0.78rem] leading-snug opacity-55"
              style={{ fontFamily: "'Source Sans 3', sans-serif", color: textColor }}
            >
              {item.subtitle}
            </p>
          </div>
        )}

        {/* ── Hero image ────────────────────────────────────────────────── */}
        <div className="px-8 pb-4 pt-6 md:pt-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mx-auto max-w-[760px]"
          >
            {item.hero_image ? (
              <HeroParallax
                background={item.hero_image}
                foreground={item.hero_foreground_image}
                alt={item.name}
              />
            ) : (
              <div
                className="w-full rounded-[12px] overflow-hidden"
                style={{ aspectRatio: '16/10', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center gap-[6px] px-4 py-3 border-b border-white/10">
                  <div className="size-[10px] rounded-full bg-white/20" />
                  <div className="size-[10px] rounded-full bg-white/20" />
                  <div className="size-[10px] rounded-full bg-white/20" />
                  <div className="flex-1 mx-4 h-[20px] rounded-full bg-white/10" />
                </div>
                <div className="flex items-center justify-center h-[calc(100%-41px)]">
                  <span className="text-[4rem] font-bold select-none opacity-30 text-white"
                    style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                    {item.name[0]}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Description ───────────────────────────────────────────────── */}
        {paragraphs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="project-body-copy px-8 py-6 max-w-[760px] mx-auto"
            style={{ textAlign: descriptionAlignment }}
          >
            {paragraphs.map((p, i) => (
              <p key={i} className="mb-4 last:mb-0 opacity-65"
                style={{ fontFamily: "'Source Sans 3', sans-serif", color: textColor }}>
                {p}
              </p>
            ))}
          </motion.div>
        )}

        {/* ── Content blocks ────────────────────────────────────────────── */}
        <div className="px-8 pb-20 max-w-[760px] mx-auto">
          {editorMode ? (
            /* ── Edit mode ── */
            <>
              <AddBlockButton onAdd={type => insertBlock(type, 0)} />

              {contentBlocks.length === 0 && (
                <p className="text-center text-white/20 text-[0.82rem] py-6 select-none"
                  style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                  Hover the line above and click + to add content
                </p>
              )}

              <DndContext
                sensors={blockSensors}
                collisionDetection={closestCenter}
                onDragEnd={handleBlockDragEnd}
              >
                <SortableContext
                  items={contentBlocks.map(block => block.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {contentBlocks.map((block, idx) => (
                    <SortableContentSection key={block.id} id={block.id}>

                      {/* Delete button */}
                      <button
                        onClick={() => removeBlock(block.id)}
                        className="absolute top-2 right-2 z-10 size-[22px] flex items-center justify-center rounded-full bg-[rgba(10,10,10,0.7)] border border-white/10 text-white/30 hover:text-[#d25d5f] hover:border-[#d25d5f]/40 hover:bg-[rgba(10,10,10,0.9)] transition-all opacity-0 group-hover/block:opacity-100"
                      >
                        <X size={11} strokeWidth={2} />
                      </button>

                      {/* Block content */}
                      <div className="mb-1">
                        {block.type === 'richtext' && (
                          <RichTextEditor
                            content={block.html || ''}
                            onChange={html => updateBlock(block.id, { html })}
                            placeholder="Write something…"
                          />
                        )}
                        {block.type === 'image' && (
                          <ImageDropZone
                            value={block.url || ''}
                            onChange={url => updateBlock(block.id, { url })}
                            caption={block.caption}
                            onCaptionChange={caption => updateBlock(block.id, { caption })}
                          />
                        )}
                        {block.type === 'imagegrid' && (
                          <ImageGridBlock
                            images={block.images || []}
                            columns={block.columns ?? 2}
                            editorMode
                            onChange={(images, columns) => updateBlock(block.id, { images, columns })}
                          />
                        )}
                        {block.type === 'carousel' && (
                          <CarouselBlock
                            images={(block.images || []) as CarouselImageItem[]}
                            visibleCount={block.visible_count ?? 3}
                            editorMode
                            onChange={images => updateBlock(block.id, { images })}
                            onVisibleCountChange={visible_count => updateBlock(block.id, { visible_count })}
                          />
                        )}
                        {block.type === 'divider' && (
                          <div className="py-5 flex items-center px-2">
                            <div className="flex-1 h-px rounded-full opacity-30" style={{ backgroundColor: textColor }} />
                          </div>
                        )}
                      </div>

                      {/* Add-block button after this block */}
                      <AddBlockButton onAdd={type => insertBlock(type, idx + 1)} />
                    </SortableContentSection>
                  ))}
                </SortableContext>
              </DndContext>
            </>
          ) : (
            /* ── Read-only mode ── */
            <>
              {contentBlocks.map(block => (
                <div key={block.id} className="mb-8">
                  {block.type === 'richtext' && block.html && (
                    <div
                      className="project-rich-text project-body-copy prose prose-invert max-w-none"
                      style={projectBodyStyle}
                      dangerouslySetInnerHTML={{ __html: block.html }}
                    />
                  )}
                  {block.type === 'image' && block.url && (
                    <figure>
                      <img
                        src={block.url}
                        alt={block.caption || ''}
                        className="w-full h-auto cursor-zoom-in rounded-[12px] object-contain"
                        onClick={() => setLightboxImage({ src: block.url!, alt: block.caption || '' })}
                      />
                      {block.caption && (
                        <figcaption
                          className="text-[0.8rem] mt-2 text-center opacity-55"
                          style={{ fontFamily: "'Source Sans 3', sans-serif", color: textColor }}
                        >
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                  {block.type === 'imagegrid' && (block.images?.length ?? 0) > 0 && (
                    <ImageGridBlock
                      images={block.images || []}
                      columns={block.columns ?? 2}
                    />
                  )}
                  {block.type === 'carousel' && (block.images?.length ?? 0) > 0 && (
                    <CarouselBlock
                      images={(block.images || []) as CarouselImageItem[]}
                      visibleCount={block.visible_count ?? 3}
                    />
                  )}
                  {block.type === 'divider' && (
                    <hr className="border-0 border-t my-2 opacity-30" style={{ borderColor: textColor }} />
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* ── Navigation instructions ────────────────────────────────────── */}
        <div
          className="px-8 pb-32 pt-2 text-center text-[0.7rem] uppercase tracking-[0.16em] opacity-45 md:pb-12"
          style={{ fontFamily: "'Source Sans 3', sans-serif", color: textColor }}
        >
          <p className="hidden md:block">Press next/previous keys to change between projects.</p>
          <p className="md:hidden">Swipe left/right to change project.</p>
        </div>

        {/* ── Auto-save status toast ─────────────────────────────────────── */}
        <AnimatePresence>
          {editorMode && saveStatus !== 'idle' && (
            <motion.div
              key="save-status"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-7 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[rgba(8,8,8,0.88)] backdrop-blur-sm border border-white/10 text-[0.75rem] pointer-events-none"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              {saveStatus === 'unsaved' && <span className="text-white/40">● Unsaved changes</span>}
              {saveStatus === 'saving'  && <span className="text-white/50">↑ Saving…</span>}
              {saveStatus === 'saved'   && <span className="text-white/60">✓ Saved</span>}
              {saveStatus === 'error'   && <span className="text-[#d25d5f]">⚠ Save failed</span>}
            </motion.div>
          )}
        </AnimatePresence>

        {lightboxImage && (
          <ImageLightbox
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            onClose={() => setLightboxImage(null)}
          />
        )}

    </div>
  );
}
