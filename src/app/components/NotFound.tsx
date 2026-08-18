import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 select-none">
      <motion.div
        className="flex flex-col items-center gap-4 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      >
        <span className="text-[6rem] font-bold leading-none text-white/5 font-['Source_Sans_3',sans-serif] select-none">
          404
        </span>
        <p className="text-white/30 text-[0.9rem] font-['Source_Sans_3',sans-serif] -mt-2">
          This page doesn't exist.
        </p>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="mt-2 px-5 py-2 rounded-full bg-white/8 hover:bg-white/14 text-white/60 hover:text-white text-[0.85rem] font-['Source_Sans_3',sans-serif] transition-colors"
        >
          Go home
        </button>
      </motion.div>
    </div>
  );
}
