import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import PageTransition from './PageTransition';
import { getProjects } from '../lib/api';
import { useNetworkState } from '../context/NetworkStateContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useSiteVisibility } from '../hooks/useSiteVisibility';
import { useDesktopHover } from '../hooks/useDesktopHover';
import { withAlpha } from '../lib/color';

const DESKTOP_GRID_CLASSES: Record<number, string> = {
  2: 'md:grid-cols-2 md:max-w-[210px]',
  3: 'md:grid-cols-3 md:max-w-[320px]',
  4: 'md:grid-cols-4 md:max-w-[430px]',
  5: 'md:grid-cols-5 md:max-w-[540px]',
};

interface Project {
  id: string;
  name: string;
  background_color: string;
  logo_grid_image: string;
  description: string;
}

export default function ProjectsView() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const { dataVersion } = useNetworkState();
  const { projects_grid_columns } = useSiteVisibility();
  const desktopHover = useDesktopHover();
  const desktopGridClass = DESKTOP_GRID_CLASSES[projects_grid_columns] || DESKTOP_GRID_CLASSES[4];

  useEffect(() => {
    getProjects('ui_project').then(setProjects).catch(() => {});
  }, [dataVersion]);

  return (
    <PageTransition>
      <div className="absolute inset-0 overflow-y-auto overscroll-contain">
        <div className="flex min-h-full w-full items-center justify-center px-4 pb-32 pt-24 md:px-8 md:pb-8 md:pl-24 md:pt-8">
          <div className={`flex w-full max-w-[430px] flex-col items-center gap-5 ${desktopGridClass.split(' ').find(className => className.startsWith('md:max-w-'))}`}>
            <h2
              className="text-white/50 text-[0.72rem] font-semibold tracking-[0.22em] uppercase select-none"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              UI Projects
            </h2>
            <TooltipProvider delayDuration={150}>
              <div className={`grid w-full grid-cols-3 gap-3 ${desktopGridClass.split(' ').find(className => className.startsWith('md:grid-cols-'))}`}>
                {projects.map((project, i) => (
                  <Tooltip key={project.id}>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        aria-label={`Open ${project.name}`}
                        className="group relative flex aspect-square w-full origin-center cursor-pointer items-center justify-center overflow-visible rounded-[20px] border border-transparent transition-[border-color,box-shadow] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform md:hover:border-white/25 md:hover:shadow-2xl md:hover:ring-1 md:hover:ring-white/20"
                        initial={{ opacity: 0, scale: 1, zIndex: 1 }}
                        animate={{ opacity: 1, scale: 1, zIndex: 1 }}
                        whileHover={desktopHover ? {
                          scale: 1.35,
                          zIndex: 30,
                          transition: {
                            scale: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                          },
                        } : undefined}
                        whileTap={{
                          scale: desktopHover ? 1.22 : 0.96,
                          transition: { duration: 0.12, ease: 'easeOut' },
                        }}
                        transition={{
                          opacity: { duration: 0.35, delay: i * 0.05 },
                          scale: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                          zIndex: { duration: 0 },
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-[20px] opacity-100 transition-opacity duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:opacity-0"
                          style={{ backgroundColor: project.background_color || '#333' }}
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -inset-[17.5%] origin-center scale-[0.74074] rounded-[27px] opacity-0 backdrop-blur-[24px] backdrop-saturate-150 transition-opacity duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:opacity-100"
                          style={{ backgroundColor: withAlpha(project.background_color || '#333', 0.78) }}
                        />
                        <span className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-[20px]">
                          {project.logo_grid_image ? (
                            <img src={project.logo_grid_image} alt={project.name}
                              className="max-h-[60%] max-w-[60%] object-contain" />
                          ) : (
                            <span className="text-[2rem] font-bold opacity-40"
                              style={{ color: 'white', fontFamily: "'Source Sans 3', sans-serif" }}>
                              {project.name[0]}
                            </span>
                          )}
                          </span>
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
      </div>
    </PageTransition>
  );
}
