import { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { SquarePen } from 'lucide-react';
import NetworkVisualization from './NetworkVisualization';
import MainMenu from './MainMenu';
import EditorDrawer from './editor/EditorDrawer';
import { NetworkStateProvider, useNetworkState } from '../context/NetworkStateContext';

function RootInner() {
  const location = useLocation();
  const { pageBackground, setPageBackground, bumpDataVersion } = useNetworkState();
  const [editorOpen, setEditorOpen] = useState(false);
  const isDetailRoute = /^\/(projects|cases)\/.+/.test(location.pathname);

  useEffect(() => {
    if (!isDetailRoute) setPageBackground(null);
  }, [location.pathname]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1c1c1c]">
      {/* Persistent animated background */}
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundColor: pageBackground ?? '#1c1c1c' }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />

      {/* Network visualization */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <NetworkVisualization />
      </div>

      {/* Pages */}
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>

      {/* Navigation */}
      <MainMenu />

      {/* Editor button — top-right, shifts left on detail pages to make room for X */}
      <motion.button
        onClick={() => setEditorOpen(true)}
        className={`fixed top-5 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.22)] border border-white/15 text-white/60 hover:text-white transition-all backdrop-blur-sm ${isDetailRoute ? 'right-[60px]' : 'right-5'}`}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        title="Open content editor"
      >
        <SquarePen size={15} strokeWidth={1.5} />
        <span className="text-[0.78rem] font-['Source_Sans_3',sans-serif] hidden sm:block">Edit</span>
      </motion.button>

      {/* Content editor drawer */}
      <EditorDrawer open={editorOpen} onClose={() => { setEditorOpen(false); bumpDataVersion(); }} />
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
