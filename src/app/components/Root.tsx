import { useLocation, Outlet } from 'react-router';
import { AnimatePresence } from 'motion/react';

export default function Root() {
  const location = useLocation();
  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </div>
  );
}
