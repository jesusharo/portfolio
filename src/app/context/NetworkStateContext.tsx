import { createContext, useContext, useState, ReactNode } from 'react';

export type NetworkState = 'idle' | 'focused' | 'conversation';

interface NetworkStateContextValue {
  networkState: NetworkState;
  setNetworkState: (state: NetworkState) => void;
  pageBackground: string | null;
  setPageBackground: (color: string | null) => void;
  dataVersion: number;
  bumpDataVersion: () => void;
  editorMode: boolean;
  setEditorMode: (m: boolean) => void;
}

const NetworkStateContext = createContext<NetworkStateContextValue>({
  networkState: 'idle',
  setNetworkState: () => {},
  pageBackground: null,
  setPageBackground: () => {},
  dataVersion: 0,
  bumpDataVersion: () => {},
  editorMode: false,
  setEditorMode: () => {},
});

export function NetworkStateProvider({ children }: { children: ReactNode }) {
  const [networkState, setNetworkState] = useState<NetworkState>('idle');
  const [pageBackground, setPageBackground] = useState<string | null>(null);
  const [dataVersion, setDataVersion] = useState(0);
  const [editorMode, setEditorMode] = useState(false);
  const bumpDataVersion = () => setDataVersion(v => v + 1);
  return (
    <NetworkStateContext.Provider value={{
      networkState, setNetworkState,
      pageBackground, setPageBackground,
      dataVersion, bumpDataVersion,
      editorMode, setEditorMode,
    }}>
      {children}
    </NetworkStateContext.Provider>
  );
}

export function useNetworkState() {
  return useContext(NetworkStateContext);
}
