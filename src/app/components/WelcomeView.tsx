import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useNetworkState } from '../context/NetworkStateContext';

export default function WelcomeView() {
  const navigate = useNavigate();
  const { setNetworkState } = useNetworkState();

  useEffect(() => {
    setNetworkState('conversation');
    sessionStorage.setItem('visited', 'true');

    const timer = setTimeout(() => {
      navigate('/projects', { replace: true });
    }, 2800);

    return () => {
      clearTimeout(timer);
      setNetworkState('idle');
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="flex flex-col items-center gap-3 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-white text-[2.8rem] md:text-[3.5rem] font-bold leading-tight font-['Source_Sans_3',sans-serif]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          Welcome
        </motion.h1>
      </motion.div>
    </div>
  );
}
