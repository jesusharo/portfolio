import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import PageTransition from './PageTransition';
import { getProjects } from '../lib/api';
import { useNetworkState } from '../context/NetworkStateContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

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

  useEffect(() => {
    getProjects('case_study').then(setProjects).catch(() => {});
  }, [dataVersion]);

  return (
    <PageTransition>
      <div className="absolute inset-0 flex items-center justify-center p-8 md:pl-24">
        <div className="flex flex-col items-center gap-5 w-[430px]">
        <h2
          className="text-white/50 text-[0.72rem] font-semibold tracking-[0.22em] uppercase select-none"
          style={{ fontFamily: "'Source Sans 3', sans-serif" }}
        >
          Case Studies
        </h2>
        <TooltipProvider delayDuration={150}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
            {projects.map((project, i) => (
              <Tooltip key={project.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => navigate(`/cases/${project.id}`)}
                    aria-label={`Open ${project.name}`}
                    className="aspect-square rounded-[20px] flex items-center justify-center cursor-pointer relative overflow-hidden"
                    style={{ backgroundColor: project.background_color || '#333' }}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
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
