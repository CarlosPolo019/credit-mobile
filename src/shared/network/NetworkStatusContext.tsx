import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

export type NetworkStatus = "online" | "limited" | "offline";

type NetworkStatusContextValue = {
  status: NetworkStatus;
  isOnline: boolean;
};

const NetworkStatusContext = createContext<NetworkStatusContextValue>({ status: "online", isOnline: true });

function resolveStatus(state: Pick<NetInfoState, "isConnected" | "isInternetReachable">): NetworkStatus {
  if (!state.isConnected) return "offline";
  if (state.isInternetReachable === false) return "offline";
  if (state.isInternetReachable === null) return "limited";
  return "online";
}

export function NetworkStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<NetworkStatus>("online");

  useEffect(() => {
    return NetInfo.addEventListener((state) => setStatus(resolveStatus(state)));
  }, []);

  return (
    <NetworkStatusContext.Provider value={{ status, isOnline: status !== "offline" }}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export function useNetworkStatus() {
  return useContext(NetworkStatusContext);
}
