import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import PageTransition from './PageTransition';
import { getProjects } from '../lib/api';

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

  useEffect(() => {
    getProjects('case_study').then(setProjects).catch(() => {});
  }, []);

  return (
    <PageTransition>
      <div className="absolute inset-0 flex items-center justify-center p-8 md:pl-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-[640px]">
          {projects.map((project, i) => (
            <motion.button
              key={project.id}
              onClick={() => navigate(`/cases/${project.id}`)}
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
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
