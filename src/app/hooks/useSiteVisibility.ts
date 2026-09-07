import { useEffect, useState } from 'react';
import { getSiteSettings } from '../lib/api';
import { useNetworkState } from '../context/NetworkStateContext';

export interface SiteVisibility {
  case_studies_visible: boolean;
  agent_visible: boolean;
  projects_grid_columns: number;
  case_studies_grid_columns: number;
}

const DEFAULT_VISIBILITY: SiteVisibility = {
  case_studies_visible: true,
  agent_visible: true,
  projects_grid_columns: 4,
  case_studies_grid_columns: 4,
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
          projects_grid_columns: settings.projects_grid_columns ?? 4,
          case_studies_grid_columns: settings.case_studies_grid_columns ?? 4,
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