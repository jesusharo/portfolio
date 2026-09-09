import { useEffect, useState } from 'react';

const DESKTOP_HOVER_QUERY = '(min-width: 768px) and (hover: hover)';

export function useDesktopHover() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_HOVER_QUERY);
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return enabled;
}