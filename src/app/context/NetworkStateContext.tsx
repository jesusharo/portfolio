import { createContext, useContext, useState, ReactNode } from 'react';

export type NetworkState = 'idle' | 'focused' | 'conversation';

interface NetworkStateContextValue {
  networkState: NetworkState;
  setNetworkState: (state: NetworkState) => void;
  pageBackground: string | null;
  setPageBackground: (color: string | null) => void;
}

const NetworkStateContext = createContext<NetworkStateContextValue>({
  networkState: 'idle',
  setNetworkState: () => {},
  pageBackground: null,
  setPageBackground: () => {},
});

export function NetworkStateProvider({ children }: { children: ReactNode }) {
  const [networkState, setNetworkState] = useState<NetworkState>('idle');
  const [pageBackground, setPageBackground] = useState<string | null>(null);
  return (
    <NetworkStateContext.Provider value={{ networkState, setNetworkState, pageBackground, setPageBackground }}>
      {children}
    </NetworkStateContext.Provider>
  );
}

export function useNetworkState() {
  return useContext(NetworkStateContext);
}
