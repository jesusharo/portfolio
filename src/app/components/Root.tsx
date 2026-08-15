import { useLocation, Outlet } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import NetworkVisualization from './NetworkVisualization';
import MainMenu from './MainMenu';
import { NetworkStateProvider, useNetworkState } from '../context/NetworkStateContext';

function RootInner() {
  const location = useLocation();
  const { pageBackground } = useNetworkState();

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1c1c1c]">
      {/* Persistent animated background — smoothly transitions to project color */}
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundColor: pageBackground ?? '#1c1c1c' }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />

      {/* Single persistent network — always behind page content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <NetworkVisualization />
      </div>

      {/* Pages fade in/out — transparent, background handled above */}
      <AnimatePresence mode="sync">
        <Outlet key={location.pathname} />
      </AnimatePresence>

      {/* Persistent menu */}
      <MainMenu />
    </div>
  );
}

export default function Root() {
  return (
    <NetworkStateProvider>
      <RootInner />
    </NetworkStateProvider>
  );
}
