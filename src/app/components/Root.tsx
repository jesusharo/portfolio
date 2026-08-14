import { useLocation, Outlet } from 'react-router';
import { AnimatePresence } from 'motion/react';
import NetworkVisualization from './NetworkVisualization';
import MainMenu from './MainMenu';
import { NetworkStateProvider } from '../context/NetworkStateContext';

export default function Root() {
  const location = useLocation();
  return (
    <NetworkStateProvider>
      <div className="relative w-full h-full overflow-hidden bg-[#1c1c1c]">
        {/* Persistent network — never unmounts, animates between states */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <NetworkVisualization />
        </div>

        {/* Pages fade in/out on top */}
        <AnimatePresence mode="sync">
          <Outlet key={location.pathname} />
        </AnimatePresence>

        {/* Persistent menu — no remount on navigation */}
        <MainMenu />
      </div>
    </NetworkStateProvider>
  );
}
