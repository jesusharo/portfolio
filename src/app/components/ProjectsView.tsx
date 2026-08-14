import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import PageTransition from './PageTransition';
import { projects } from '../data/projects';
import { useNetworkState } from '../context/NetworkStateContext';

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const navigate = useNavigate();
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/projects/${project.id}`)}
      className="size-[108px] rounded-[18px] flex items-center justify-center cursor-pointer shadow-lg"
      style={{ background: project.bgColor }}
      title={project.name}
    >
      <span
        className="font-bold text-[32px] leading-none select-none"
        style={{ color: project.color, fontFamily: "'Source Sans 3', sans-serif" }}
      >
        {project.icon}
      </span>
    </motion.button>
  );
}

export default function ProjectsView() {
  const { setNetworkState } = useNetworkState();
  useEffect(() => { setNetworkState('focused'); }, []);

  return (
    <PageTransition>
      <div className="relative size-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="grid grid-cols-3 gap-[10px]">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
