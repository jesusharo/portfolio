import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { verifyToken } from '../../lib/api';
import AuthModal from './AuthModal';
import ProjectList from './ProjectList';
import ProjectEditor from './ProjectEditor';
import AboutEditor from './AboutEditor';
import ResumeEditor from './ResumeEditor';
import GeneralEditor from './GeneralEditor';
import { getEditorProjects } from '../../lib/api';
import { useNetworkState } from '../../context/NetworkStateContext';

type Tab = 'general' | 'ui' | 'cases' | 'about' | 'resume';
type View = 'list' | 'detail';

interface Project {
  id: string;
  name: string;
  type: string;
  hidden: boolean;
  background_color: string;
  [key: string]: unknown;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EditorDrawer({ open, onClose }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authed, setAuthed] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [tab, setTab] = useState<Tab>('ui');
  const [view, setView] = useState<View>('list');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [uiProjects, setUiProjects] = useState<Project[]>([]);
  const [caseProjects, setCaseProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const { bumpDataVersion, setEditorAuthed, setEditorMode } = useNetworkState();

  // Verify token when drawer opens — editorAuthed only set after confirmation
  useEffect(() => {
    if (!open) return;
    verifyToken().then(valid => {
      if (valid) {
        setAuthed(true);
        setEditorAuthed(true);
        loadProjects();
      } else {
        setShowAuth(true);
      }
    });
  }, [open]);

  // Auto-detect current project from URL — syncs drawer when navigating
  useEffect(() => {
    if (!open || !authed) return;
    if (!uiProjects.length && !caseProjects.length) return;

    const match = location.pathname.match(/^\/(projects|cases)\/(.+)/);
    if (!match) return;

    const [, section, projectId] = match;
    const isCase = section === 'cases';
    const list = isCase ? caseProjects : uiProjects;
    const found = list.find(p => p.id === projectId);

    if (found) {
      setTab(isCase ? 'cases' : 'ui');
      setSelectedProject(found);
      setView('detail');
    }
  }, [open, authed, location.pathname, uiProjects, caseProjects]);

  async function loadProjects() {
    setLoading(true);
    const [ui, cases] = await Promise.all([
      getEditorProjects('ui_project'),
      getEditorProjects('case_study'),
    ]);
    setUiProjects(ui as Project[]);
    setCaseProjects(cases as Project[]);
    setLoading(false);
  }

  function handleAuthSuccess() {
    setShowAuth(false);
    setAuthed(true);
    setEditorAuthed(true);
    loadProjects();
  }

  function handleClose() {
    onClose();
    setView('list');
    setSelectedProject(null);
  }

  function handleLogout() {
    localStorage.removeItem('editor_token');
    setAuthed(false);
    setEditorAuthed(false);
    setEditorMode(false);
    setView('list');
    setSelectedProject(null);
    onClose();
  }

  function handleSelectProject(p: Project) {
    setSelectedProject(p);
    setView('detail');
    const urlSection = p.type === 'case_study' ? 'cases' : 'projects';
    navigate(`/${urlSection}/${p.id}`);
  }

  function handleBack() {
    setView('list');
    setSelectedProject(null);
  }

  function handleSaved(updated: Project) {
    if (tab === 'ui') setUiProjects(list => list.map(p => p.id === updated.id ? updated : p));
    else setCaseProjects(list => list.map(p => p.id === updated.id ? updated : p));
    setSelectedProject(updated);
    bumpDataVersion();
  }

  function handleDeleted() {
    if (tab === 'ui') setUiProjects(list => list.filter(p => p.id !== selectedProject?.id));
    else setCaseProjects(list => list.filter(p => p.id !== selectedProject?.id));
    bumpDataVersion();
    handleBack();
  }

  const activeProjects = tab === 'ui' ? uiProjects : caseProjects;
  const setActiveProjects = tab === 'ui' ? setUiProjects : setCaseProjects;

  return (
    <>
      <AuthModal
        open={showAuth && open}
        onSuccess={handleAuthSuccess}
        onClose={() => { setShowAuth(false); handleClose(); }}
      />

      <AnimatePresence>
        {open && authed && (
          <>
            {/* Backdrop — only on list view; detail view leaves the page interactive */}
            {view === 'list' && (
              <motion.div
                className="fixed inset-0 z-[49] bg-black/20 backdrop-blur-[1px]"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={handleClose}
              />
            )}

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 h-full w-full max-w-[400px] z-[50] bg-[rgba(18,18,18,0.97)] border-l border-white/10 flex flex-col overflow-hidden"
              style={{ boxShadow: '-24px 0 60px rgba(0,0,0,0.4)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 shrink-0">
                <span className="text-white text-[0.95rem] font-semibold font-['Source_Sans_3',sans-serif]">
                  Content Editor
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    title="Log out"
                    className="size-[32px] flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={15} />
                  </button>
                  <button onClick={handleClose} className="size-[32px] flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {view === 'list' && (
                <>
                  {/* Tabs */}
                  <div className="flex gap-1 overflow-x-auto px-4 py-3 border-b border-white/10 shrink-0" style={{ scrollbarWidth: 'none' }}>
                    {(['general', 'ui', 'cases', 'about', 'resume'] as Tab[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                          className={`shrink-0 px-3 py-1.5 rounded-[8px] text-[0.8rem] font-['Source_Sans_3',sans-serif] transition-colors ${
                          tab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
                        }`}
                      >
                        {t === 'general' ? 'General' : t === 'ui' ? 'UI Projects' : t === 'cases' ? 'Case Studies' : t === 'about' ? 'About Me' : 'Resume'}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-hidden p-4">
                    {loading ? (
                      <div className="flex items-center justify-center h-full text-white/30 text-[0.85rem] font-['Source_Sans_3',sans-serif]">
                        Loading…
                      </div>
                    ) : tab === 'general' ? (
                      <GeneralEditor />
                    ) : tab === 'about' ? (
                      <AboutEditor />
                    ) : tab === 'resume' ? (
                      <ResumeEditor />
                    ) : (
                      <ProjectList
                        projects={activeProjects}
                        type={tab === 'ui' ? 'ui_project' : 'case_study'}
                        onSelect={handleSelectProject}
                        onListChange={setActiveProjects}
                      />
                    )}
                  </div>
                </>
              )}

              {view === 'detail' && selectedProject && (
                <ProjectEditor
                  project={selectedProject as any}
                  onBack={handleBack}
                  onDeleted={handleDeleted}
                  onSaved={handleSaved}
                />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
