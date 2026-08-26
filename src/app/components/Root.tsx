import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { SquarePen, PenLine, Check, X } from 'lucide-react';
import NetworkVisualization from './NetworkVisualization';
import MainMenu from './MainMenu';
import EditorDrawer from './editor/EditorDrawer';
import { NetworkStateProvider, useNetworkState } from '../context/NetworkStateContext';
import { triggerHaptic } from '../lib/haptics';

function RootInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    pageBackground, setPageBackground,
    detailTextColor,
    bumpDataVersion,
    editorMode, setEditorMode,
    editorAuthed,
    requestSave,
  } = useNetworkState();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const pendingEditMode = useRef(false);
  const lastHapticRef = useRef(0);

  // Secret entry point: navigating to /login-editor opens the drawer and redirects home
  useEffect(() => {
    if (location.pathname === '/login-editor') {
      navigate('/', { replace: true });
      setDrawerOpen(true);
    }
  }, [location.pathname]);

  const isDetailRoute = /^\/(projects|cases)\/.+/.test(location.pathname);
  const listPath = location.pathname.startsWith('/cases') ? '/cases' : '/projects';

  // Clear background when leaving detail pages
  useEffect(() => {
    if (!isDetailRoute) setPageBackground(null);
  }, [location.pathname]);

  // Reset editorMode when navigating away from a detail page
  useEffect(() => {
    if (!isDetailRoute) setEditorMode(false);
  }, [isDetailRoute]);

  // Auto-activate editorMode after auth completes (when "Edit" triggered the login)
  useEffect(() => {
    if (editorAuthed && pendingEditMode.current) {
      pendingEditMode.current = false;
      setDrawerOpen(false);
      setEditorMode(true);
    }
  }, [editorAuthed]);

  function openDrawer() {
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    bumpDataVersion();
  }

  function handleEditToggle() {
    if (!editorAuthed) {
      // Not logged in yet — open the drawer for auth; remember to activate edit after
      pendingEditMode.current = true;
      setDrawerOpen(true);
      return;
    }
    if (editorMode) {
      // "Save changes" — flush pending saves, exit edit mode
      requestSave();
      setEditorMode(false);
      bumpDataVersion();
    } else {
      setEditorMode(true);
    }
  }

  function handleHapticTarget(target: EventTarget | null) {
    const element = target as HTMLElement | null;
    if (!element?.closest('button, a, [role="button"]')) return;
    const now = Date.now();
    if (now - lastHapticRef.current < 80) return;
    lastHapticRef.current = now;
    triggerHaptic();
  }

  function handlePointerDownCapture(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
    handleHapticTarget(event.target);
  }

  function handleTouchStartCapture(event: React.TouchEvent<HTMLDivElement>) {
    handleHapticTarget(event.target);
  }

  const pillBase = 'flex items-center gap-1.5 px-3 py-2 rounded-full border text-[0.78rem] font-["Source_Sans_3",sans-serif] transition-all backdrop-blur-sm';
  const pillDefault = 'bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.22)] border-white/15 text-white/60 hover:text-white';
  const pillActive = 'bg-[#d25d5f] hover:bg-[#c25052] border-[#d25d5f]/40 text-white';
  const iconBtn = 'size-[36px] flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.22)] border border-white/15 text-white/60 hover:text-white transition-all backdrop-blur-sm';

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-[#1c1c1c]"
      onPointerDownCapture={handlePointerDownCapture}
      onTouchStartCapture={handleTouchStartCapture}
    >
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
      <MainMenu detailTextColor={detailTextColor} />

      {/* ── Top-right button cluster ─────────────────────────────────────── */}
      <div className="fixed top-5 right-5 z-40 flex items-center gap-2">

        {/* Edit / Save changes — only for authenticated editors on detail pages */}
        {editorAuthed && isDetailRoute && (
          <motion.button
            onClick={handleEditToggle}
            className={`${pillBase} ${editorMode ? pillActive : pillDefault}`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {editorMode
              ? <><Check size={14} strokeWidth={2} style={detailTextColor ? { color: detailTextColor } : undefined} /> Save changes</>
              : <><PenLine size={14} strokeWidth={1.5} style={detailTextColor ? { color: detailTextColor } : undefined} /> Edit</>
            }
          </motion.button>
        )}

        {/* Content Editor — only visible after authentication */}
        {editorAuthed && (
          <motion.button
            onClick={openDrawer}
            className={`${pillBase} ${pillDefault}`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            title="Content Editor"
          >
            <SquarePen size={15} strokeWidth={1.5} style={detailTextColor ? { color: detailTextColor } : undefined} />
            {!isDetailRoute && <span>Content Editor</span>}
          </motion.button>
        )}

        {/* Close (X) — only on project detail pages */}
        {isDetailRoute && (
          <motion.button
            onClick={() => navigate(listPath)}
            className={iconBtn}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            title="Close"
          >
            <X size={16} strokeWidth={1.5} style={detailTextColor ? { color: detailTextColor } : undefined} />
          </motion.button>
        )}
      </div>

      {/* Content editor drawer */}
      <EditorDrawer open={drawerOpen} onClose={closeDrawer} />
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
