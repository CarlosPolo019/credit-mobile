import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest } from "../../features/auth/api.js";
import { configureApi } from "../../shared/api/client.js";
import { clearSession, readSession, writeSession } from "../../shared/lib/storage/sessionStorage.js";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  const logout = useCallback(async () => {
    await clearSession();
    setSession(null);
  }, []);

  useEffect(() => {
    configureApi({
      getToken: () => session?.token ?? null,
      onUnauthorized: () => {
        logout();
      },
    });
  }, [logout, session?.token]);

  useEffect(() => {
    let active = true;
    readSession()
      .then((stored) => {
        if (active) setSession(stored);
      })
      .finally(() => {
        if (active) setIsRestoring(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (username, password) => {
    const response = await loginRequest(username, password);
    const nextSession = {
      token: response.token,
      tokenType: response.tokenType,
      expiresAt: response.expiresAt,
      user: response.user,
    };
    await writeSession(nextSession);
    setSession(nextSession);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isRestoring,
      isAuthenticated: Boolean(session?.token),
      login,
      logout,
    }),
    [isRestoring, login, logout, session],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside SessionProvider");
  }
  return context;
}
