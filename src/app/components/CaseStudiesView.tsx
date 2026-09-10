import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import PageTransition from './PageTransition';
import { getProjects } from '../lib/api';
import { useNetworkState } from '../context/NetworkStateContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Navigate } from 'react-router';
import { useSiteVisibility } from '../hooks/useSiteVisibility';
import { useDesktopHover } from '../hooks/useDesktopHover';
import { withAlpha } from '../lib/color';

const DESKTOP_GRID_CLASSES: Record<number, string> = {
  2: 'md:grid-cols-2 md:w-[210px]',
  3: 'md:grid-cols-3 md:w-[320px]',
  4: 'md:grid-cols-4 md:w-[430px]',
  5: 'md:grid-cols-5 md:w-[540px]',
};

interface Project {
  id: string;
  name: string;
  background_color: string;
  logo_grid_image: string;
  description: string;
}

export default function CaseStudiesView() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const { dataVersion } = useNetworkState();
  const {
    case_studies_visible,
    case_studies_grid_columns,
    loading: visibilityLoading,
  } = useSiteVisibility();
  const desktopHover = useDesktopHover();
  const desktopGridClass = DESKTOP_GRID_CLASSES[case_studies_grid_columns] || DESKTOP_GRID_CLASSES[4];

  useEffect(() => {
    getProjects('case_study').then(setProjects).catch(() => {});
  }, [dataVersion]);

  if (visibilityLoading) return null;
  if (!case_studies_visible) return <Navigate to="/projects" replace />;

  return (
    <PageTransition>
      <div className="absolute inset-0 flex items-center justify-center p-8 md:pl-24">
        <div className={`flex w-full max-w-[430px] flex-col items-center gap-5 ${desktopGridClass.split(' ').find(className => className.startsWith('md:w-'))}`}>
        <h2
          className="text-white/50 text-[0.72rem] font-semibold tracking-[0.22em] uppercase select-none"
          style={{ fontFamily: "'Source Sans 3', sans-serif" }}
        >
          Case Studies
        </h2>
        <TooltipProvider delayDuration={150}>
          <div className={`grid w-full grid-cols-2 gap-3 ${desktopGridClass.split(' ').find(className => className.startsWith('md:grid-cols-'))}`}>
            {projects.map((project, i) => (
              <Tooltip key={project.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => navigate(`/cases/${project.id}`)}
                    aria-label={`Open ${project.name}`}
                    className="relative flex aspect-square w-full origin-center cursor-pointer items-center justify-center overflow-hidden rounded-[20px] border border-transparent backdrop-blur-0 transition-[backdrop-filter,border-color] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform md:hover:border-white/25 md:hover:backdrop-blur-[20px] md:hover:backdrop-saturate-150 md:hover:shadow-2xl md:hover:ring-1 md:hover:ring-white/20"
                    style={{ backgroundColor: project.background_color || '#333' }}
                    initial={{ opacity: 0, scale: 1, zIndex: 1 }}
                    animate={{ opacity: 1, scale: 1, zIndex: 1 }}
                    whileHover={desktopHover ? {
                      scale: 1.35,
                      zIndex: 30,
                      backgroundColor: withAlpha(project.background_color || '#333', 0.55),
                      transition: {
                        scale: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                        backgroundColor: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                      },
                    } : undefined}
                    whileTap={{
                      scale: desktopHover ? 1.22 : 0.96,
                      transition: { duration: 0.12, ease: 'easeOut' },
                    }}
                    transition={{
                      opacity: { duration: 0.35, delay: i * 0.05 },
                      scale: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                      backgroundColor: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                      zIndex: { duration: 0 },
                    }}
                  >
                    {project.logo_grid_image ? (
                      <img src={project.logo_grid_image} alt={project.name}
                        className="max-w-[60%] max-h-[60%] object-contain" />
                    ) : (
                      <span className="text-[2rem] font-bold opacity-40"
                        style={{ color: 'white', fontFamily: "'Source Sans 3', sans-serif" }}>
                        {project.name[0]}
                      </span>
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={8}
                  className="border border-white/10 bg-[rgba(18,18,18,0.96)] text-white/80 shadow-xl backdrop-blur-md"
                >
                  {project.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
        </div>
      </div>
    </PageTransition>
  );
}
