import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import PageTransition from './PageTransition';
import { useNetworkState } from '../context/NetworkStateContext';
import { getProjects } from '../lib/api';

type Mode = 'projects' | 'cases';

interface Project {
  id: string;
  name: string;
  background_color: string;
  accent_color: string;
  description: string;
  hero_image: string;
  content_blocks: Array<{ id: string; type: string; html?: string; url?: string; caption?: string }>;
}

export default function ProjectDetail({ mode }: { mode: Mode }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setNetworkState, setPageBackground } = useNetworkState();
  const [items, setItems] = useState<Project[]>([]);

  const apiType = mode === 'projects' ? 'ui_project' : 'case_study';
  const listPath = mode === 'projects' ? '/projects' : '/cases';
  const detailPath = listPath;

  useEffect(() => {
    getProjects(apiType).then(setItems).catch(() => {});
  }, [apiType]);

  const currentIndex = items.findIndex(p => p.id === id);
  const item = items[currentIndex] ?? null;
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  useEffect(() => {
    setNetworkState('conversation');
    if (item) setPageBackground(item.accent_color || item.background_color);
    return () => { setNetworkState('idle'); };
  }, [item?.accent_color]);

  useEffect(() => {
    if (items.length > 0 && !item) navigate(listPath);
  }, [item, items.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
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

  return (
    <PageTransition>
      <div className="absolute inset-0 overflow-y-auto">

        {/* Sticky header */}
        <motion.div
          className="sticky top-0 flex items-center px-6 py-5"
          animate={{ backgroundColor: accentColor }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ zIndex: 20 }}
        >
          <div className="w-[36px] shrink-0" />

          <div className="flex-1 flex items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={() => prevItem ? navigate(`${detailPath}/${prevItem.id}`) : navigate(listPath)}
              className="size-[36px] flex items-center justify-center rounded-full border border-white/30 text-white/70 hover:text-white hover:bg-[rgba(255,255,255,0.15)] transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={1.5} />
            </motion.button>

            <h1
              className="text-white text-[1.25rem] font-semibold uppercase"
              style={{ fontFamily: "'Source Sans 3', sans-serif", letterSpacing: '0.2em' }}
            >
              {item.name}
            </h1>

            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={() => nextItem ? navigate(`${detailPath}/${nextItem.id}`) : navigate(listPath)}
              className="size-[36px] flex items-center justify-center rounded-full border border-white/30 text-white/70 hover:text-white hover:bg-[rgba(255,255,255,0.15)] transition-colors"
            >
              <ArrowRight size={20} strokeWidth={1.5} />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate(listPath)}
            className="size-[36px] shrink-0 flex items-center justify-center rounded-full border border-white/30 text-white/70 hover:text-white hover:bg-[rgba(255,255,255,0.15)] transition-colors"
          >
            <X size={16} strokeWidth={1.5} />
          </motion.button>
        </motion.div>

        {/* Hero image or placeholder */}
        <div className="px-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mx-auto max-w-[760px]"
          >
            {item.hero_image ? (
              <img src={item.hero_image} alt={item.name}
                className="w-full rounded-[12px] object-cover" style={{ maxHeight: 420 }} />
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

        {/* Description */}
        {paragraphs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="px-8 py-8 max-w-[760px] mx-auto"
          >
            {paragraphs.map((p, i) => (
              <p key={i} className="text-white/65 text-[0.9375rem] leading-[1.7] mb-4 last:mb-0"
                style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {p}
              </p>
            ))}
          </motion.div>
        )}

        {/* Content blocks */}
        {item.content_blocks?.length > 0 && (
          <div className="px-8 pb-16 max-w-[760px] mx-auto">
            {item.content_blocks.map((block) => (
              <div key={block.id} className="mb-8">
                {block.type === 'richtext' && block.html && (
                  <div
                    className="prose prose-invert prose-lg max-w-none text-white/70"
                    style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                    dangerouslySetInnerHTML={{ __html: block.html }}
                  />
                )}
                {block.type === 'image' && block.url && (
                  <figure>
                    <img src={block.url} alt={block.caption || ''} className="w-full rounded-[12px]" />
                    {block.caption && (
                      <figcaption className="text-white/35 text-[0.8rem] mt-2 text-center"
                        style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </PageTransition>
  );
}
