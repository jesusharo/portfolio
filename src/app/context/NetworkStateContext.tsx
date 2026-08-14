import { createContext, useContext, useState, ReactNode } from 'react';

export type NetworkState = 'idle' | 'focused' | 'conversation';

interface NetworkStateContextValue {
  networkState: NetworkState;
  setNetworkState: (state: NetworkState) => void;
}

const NetworkStateContext = createContext<NetworkStateContextValue>({
  networkState: 'idle',
  setNetworkState: () => {},
});

export function NetworkStateProvider({ children }: { children: ReactNode }) {
  const [networkState, setNetworkState] = useState<NetworkState>('idle');
  return (
    <NetworkStateContext.Provider value={{ networkState, setNetworkState }}>
      {children}
    </NetworkStateContext.Provider>
  );
}

export function useNetworkState() {
  return useContext(NetworkStateContext);
}
