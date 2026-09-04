import ProjectDetail from './ProjectDetail';
import { Navigate } from 'react-router';
import { useSiteVisibility } from '../hooks/useSiteVisibility';
import { useNetworkState } from '../context/NetworkStateContext';

export default function ProjectDetailCases() {
  const { case_studies_visible, loading } = useSiteVisibility();
  const { editorAuthed, editorMode } = useNetworkState();
  if (loading) return null;
  if (!case_studies_visible && !(editorAuthed && editorMode)) {
    return <Navigate to="/projects" replace />;
  }
  return <ProjectDetail mode="cases" />;
}
