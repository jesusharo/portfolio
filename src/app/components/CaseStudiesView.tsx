import { useEffect } from 'react';
import { motion } from 'motion/react';
import MainMenu from './MainMenu';
import PageTransition from './PageTransition';
import { caseStudies } from '../data/caseStudies';
import { useNetworkState } from '../context/NetworkStateContext';

function CaseCircle({ cs, index }: { cs: typeof caseStudies[0]; index: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      className="size-[84px] rounded-full bg-[#3C3C3C] flex items-center justify-center shadow-lg cursor-pointer"
      title={cs.name}
    >
      <span
        className="font-bold text-[28px] leading-none select-none"
        style={{ color: cs.color, fontFamily: "'Source Sans 3', sans-serif" }}
      >
        {cs.icon}
      </span>
    </motion.button>
  );
}

export default function CaseStudiesView() {
  const { setNetworkState } = useNetworkState();

  useEffect(() => {
    setNetworkState('focused');
  }, []);

  return (
    <PageTransition>
      <div className="relative size-full overflow-hidden">

        {/* Radial gradient */}
        <div className="absolute flex h-full items-center justify-center left-0 top-0 w-full z-0 pointer-events-none">
          <div className="flex-none rotate-180">
            <div className="h-full w-full" style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1512 982' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.20000000298023224'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-7.5282e-15 98.2 -151.2 -4.0275e-14 756 2.1805e-13)'><stop stop-color='rgba(89,13,180,0.3)' offset='0'/><stop stop-color='rgba(145,68,236,0.15)' offset='0.25'/><stop stop-color='rgba(182,131,243,0.05)' offset='0.5'/><stop stop-color='rgba(0,0,0,0.1)' offset='1'/></radialGradient></defs></svg>")`
            }} />
          </div>
        </div>

        {/* Case studies grid */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="grid grid-cols-3 gap-[16px] pointer-events-auto">
            {caseStudies.map((cs, i) => (
              <CaseCircle key={cs.id} cs={cs} index={i} />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
