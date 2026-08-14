import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import PageTransition from './PageTransition';
import { useNetworkState } from '../context/NetworkStateContext';
import NetworkVisualization from './NetworkVisualization';
import { projects } from '../data/projects';
import { caseStudies } from '../data/caseStudies';

type Mode = 'projects' | 'cases';

export default function ProjectDetail({ mode }: { mode: Mode }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setNetworkState } = useNetworkState();

  const items = mode === 'projects' ? projects : caseStudies;
  const currentIndex = items.findIndex(p => p.id === id);
  const item = items[currentIndex];

  const listPath = mode === 'projects' ? '/projects' : '/cases';
  const detailPath = listPath;
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  useEffect(() => { setNetworkState('conversation'); }, []);

  useEffect(() => {
    if (!item) navigate(listPath);
  }, [item, navigate, listPath]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (prevItem) navigate(`${detailPath}/${prevItem.id}`);
      } else if (e.key === 'ArrowRight') {
        if (nextItem) navigate(`${detailPath}/${nextItem.id}`);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prevItem, nextItem, navigate, detailPath]);

  if (!item) return null;
  const paragraphs = (item.description ?? '').split('\n\n').filter(Boolean);

  return (
    <PageTransition>
      {/* Solid background — same color everywhere, no cut */}
      <div className="absolute inset-0" style={{ background: item.accentColor }}>

        {/* Network above colored bg, below content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 5 }}>
          <NetworkVisualization />
        </div>

        {/* Scrollable content layer */}
        <div className="absolute inset-0 overflow-y-auto" style={{ zIndex: 10 }}>

          {/* Sticky header — same solid color as background */}
          <div
            className="sticky top-0 flex items-center px-6 py-5"
            style={{ background: item.accentColor, zIndex: 20 }}
          >
            {/* Left spacer to balance the close button */}
            <div className="w-[36px] shrink-0" />

            {/* ← Title → grouped in center */}
            <div className="flex-1 flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={() => prevItem ? navigate(`${detailPath}/${prevItem.id}`) : navigate(listPath)}
                className="size-[28px] flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} strokeWidth={1.5} />
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
                className="size-[28px] flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <ArrowRight size={16} strokeWidth={1.5} />
              </motion.button>
            </div>

            {/* × on the far right edge */}
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate(listPath)}
              className="size-[36px] shrink-0 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X size={16} strokeWidth={1.5} />
            </motion.button>
          </div>

          {/* Preview area */}
          <div className="px-8 pb-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative mx-auto max-w-[760px]"
            >
              {/* Desktop mockup */}
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
                  <span
                    className="text-[4rem] font-bold select-none"
                    style={{ color: item.color, fontFamily: "'Source Sans 3', sans-serif", opacity: 0.4 }}
                  >
                    {item.icon}
                  </span>
                </div>
              </div>

              {/* Mobile mockup */}
              <div
                className="absolute right-[-60px] bottom-[-20px] w-[120px] rounded-[16px] overflow-hidden shadow-2xl"
                style={{ aspectRatio: '9/16', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="w-full h-[8px] bg-white/10 rounded-t-[16px]" />
                <div className="flex items-center justify-center h-[calc(100%-8px)]">
                  <span
                    className="text-[1.5rem] font-bold select-none"
                    style={{ color: item.color, fontFamily: "'Source Sans 3', sans-serif", opacity: 0.4 }}
                  >
                    {item.icon}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Description */}
          {paragraphs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="px-8 py-8 max-w-[760px] mx-auto"
            >
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-white/65 text-[0.9375rem] leading-[1.7] mb-4 last:mb-0"
                  style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  {p}
                </p>
              ))}
            </motion.div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
