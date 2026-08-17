import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { getProject } from '../lib/api';

interface ContentBlock {
  type: 'richtext' | 'image' | 'imagegrid' | 'carousel' | 'divider';
  html?: string;
  url?: string;
  caption?: string;
  images?: { url: string; caption?: string }[];
  columns?: 2 | 3;
}

interface Project {
  id: string;
  name: string;
  description: string;
  background_color: string;
  accent_color: string;
  hero_image: string;
  content_blocks: ContentBlock[];
}

interface Props {
  projectId: string | null;
  onClose: () => void;
}

function RichTextBlock({ html }: { html: string }) {
  return (
    <div
      className="prose prose-invert prose-sm max-w-none text-white/80 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function ImageBlock({ url, caption }: { url: string; caption?: string }) {
  return (
    <figure className="my-4">
      <img src={url} alt={caption || ''} className="w-full rounded-[12px] object-cover" />
      {caption && <figcaption className="mt-2 text-center text-[0.75rem] text-white/40 font-['Source_Sans_3',sans-serif]">{caption}</figcaption>}
    </figure>
  );
}

function ImageGridBlock({ images, columns = 2 }: { images: { url: string; caption?: string }[]; columns?: 2 | 3 }) {
  return (
    <div className={`grid gap-3 my-4 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {images.map((img, i) => (
        <figure key={i}>
          <img src={img.url} alt={img.caption || ''} className="w-full rounded-[10px] object-cover" />
          {img.caption && <figcaption className="mt-1 text-center text-[0.72rem] text-white/40 font-['Source_Sans_3',sans-serif]">{img.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

function Divider() {
  return <hr className="my-6 border-white/10" />;
}

export default function ProjectModal({ projectId, onClose }: Props) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) { setProject(null); return; }
    setLoading(true);
    getProject(projectId).then(p => {
      setProject(p);
      setLoading(false);
    });
  }, [projectId]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (projectId) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [projectId, handleKeyDown]);

  const bg = project?.background_color || '#1c1c1c';

  return (
    <AnimatePresence>
      {projectId && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            className="fixed inset-x-0 bottom-0 top-[48px] z-[81] flex items-stretch justify-center px-4 pb-4 md:px-8 md:pb-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <div
              className="relative w-full max-w-[860px] rounded-[20px] overflow-hidden flex flex-col"
              style={{ background: bg, boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 size-[36px] flex items-center justify-center rounded-full bg-black/30 text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {loading && (
                  <div className="flex items-center justify-center h-full text-white/30 text-[0.9rem] font-['Source_Sans_3',sans-serif]">
                    Loading…
                  </div>
                )}

                {!loading && project && (
                  <>
                    {/* Hero */}
                    {project.hero_image && (
                      <div className="w-full aspect-[16/7] overflow-hidden">
                        <img
                          src={project.hero_image}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Body */}
                    <div className="px-8 py-8">
                      <h2 className="text-white text-[1.6rem] font-bold leading-tight mb-2 font-['Source_Sans_3',sans-serif]">
                        {project.name}
                      </h2>
                      {project.description && (
                        <p className="text-white/60 text-[0.95rem] leading-[1.6] mb-6 font-['Source_Sans_3',sans-serif]">
                          {project.description}
                        </p>
                      )}

                      {/* Content blocks */}
                      <div className="space-y-2">
                        {(project.content_blocks || []).map((block, i) => {
                          if (block.type === 'richtext' && block.html) return <RichTextBlock key={i} html={block.html} />;
                          if (block.type === 'image' && block.url) return <ImageBlock key={i} url={block.url} caption={block.caption} />;
                          if (block.type === 'imagegrid' && block.images?.length) return <ImageGridBlock key={i} images={block.images} columns={block.columns} />;
                          if (block.type === 'divider') return <Divider key={i} />;
                          return null;
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
