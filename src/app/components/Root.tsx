import { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import NetworkVisualization from './NetworkVisualization';
import MainMenu from './MainMenu';
import EditorDrawer from './editor/EditorDrawer';
import { NetworkStateProvider, useNetworkState } from '../context/NetworkStateContext';

function RootInner() {
  const location = useLocation();
  const { pageBackground, setPageBackground } = useNetworkState();
  const [editorOpen, setEditorOpen] = useState(false);

  // Clear background when leaving detail pages (not when switching between them)
  useEffect(() => {
    const isDetailRoute = /^\/(projects|cases)\/.+/.test(location.pathname);
    if (!isDetailRoute) setPageBackground(null);
  }, [location.pathname]);

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
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>

      {/* Persistent menu */}
      <MainMenu onOpenEditor={() => setEditorOpen(true)} />

      {/* Content editor drawer */}
      <EditorDrawer open={editorOpen} onClose={() => setEditorOpen(false)} />
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
