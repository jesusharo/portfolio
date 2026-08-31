import { useEffect, useState } from 'react';
import { getSiteSettings } from '../lib/api';
import { useNetworkState } from '../context/NetworkStateContext';

export interface SiteVisibility {
  case_studies_visible: boolean;
  agent_visible: boolean;
}

const DEFAULT_VISIBILITY: SiteVisibility = {
  case_studies_visible: true,
  agent_visible: true,
};

export function useSiteVisibility() {
  const { dataVersion } = useNetworkState();
  const [visibility, setVisibility] = useState<SiteVisibility>(DEFAULT_VISIBILITY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getSiteSettings()
      .then(settings => {
        if (!active) return;
        setVisibility({
          case_studies_visible: settings.case_studies_visible !== false,
          agent_visible: settings.agent_visible !== false,
        });
      })
      .catch(() => {
        if (active) setVisibility(DEFAULT_VISIBILITY);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [dataVersion]);

  return { ...visibility, loading };
}