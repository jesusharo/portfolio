import ProjectDetail from './ProjectDetail';
import { Navigate } from 'react-router';
import { useSiteVisibility } from '../hooks/useSiteVisibility';

export default function ProjectDetailCases() {
  const { case_studies_visible, loading } = useSiteVisibility();
  if (loading) return null;
  if (!case_studies_visible) return <Navigate to="/projects" replace />;
  return <ProjectDetail mode="cases" />;
}
