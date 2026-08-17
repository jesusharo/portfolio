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
  editorAuthed: boolean;
  setEditorAuthed: (v: boolean) => void;
  saveRequestVersion: number;
  requestSave: () => void;
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
  editorAuthed: false,
  setEditorAuthed: () => {},
  saveRequestVersion: 0,
  requestSave: () => {},
});

export function NetworkStateProvider({ children }: { children: ReactNode }) {
  const [networkState, setNetworkState] = useState<NetworkState>('idle');
  const [pageBackground, setPageBackground] = useState<string | null>(null);
  const [dataVersion, setDataVersion] = useState(0);
  const [editorMode, setEditorMode] = useState(false);
  const [editorAuthed, setEditorAuthed] = useState(false);
  const [saveRequestVersion, setSaveRequestVersion] = useState(0);

  const bumpDataVersion = () => setDataVersion(v => v + 1);
  const requestSave = () => setSaveRequestVersion(v => v + 1);

  return (
    <NetworkStateContext.Provider value={{
      networkState, setNetworkState,
      pageBackground, setPageBackground,
      dataVersion, bumpDataVersion,
      editorMode, setEditorMode,
      editorAuthed, setEditorAuthed,
      saveRequestVersion, requestSave,
    }}>
      {children}
    </NetworkStateContext.Provider>
  );
}

export function useNetworkState() {
  return useContext(NetworkStateContext);
}
