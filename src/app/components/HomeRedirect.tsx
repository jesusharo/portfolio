import { Navigate } from 'react-router';
import WelcomeView from './WelcomeView';

export default function HomeRedirect() {
  const visited = sessionStorage.getItem('visited');
  return visited ? <Navigate to="/projects" replace /> : <WelcomeView />;
}
