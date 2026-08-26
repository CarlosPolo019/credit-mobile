import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest, registerRequest } from "@/features/auth/api";
import { configureApi } from "@/shared/api/client";
import { clearSession, readSession, writeSession } from "@/shared/lib/storage/sessionStorage";
import type { Session } from "./types";

type SessionContextValue = {
  session: Session | null;
  isRestoring: boolean;
  isAuthenticated: boolean;
  login: (document: string, password: string) => Promise<void>;
  register: (fullName: string, document: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

type SessionProviderProps = {
  children: ReactNode;
};

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
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
    readSession<Session>()
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

  const persistSession = useCallback(async (nextSession: Session) => {
    await writeSession(nextSession);
    setSession(nextSession);
  }, []);

  const login = useCallback(async (document: string, password: string) => {
    const response = await loginRequest(document, password);
    await persistSession(response);
  }, [persistSession]);

  const register = useCallback(async (fullName: string, document: string, password: string) => {
    const response = await registerRequest(fullName, document, password);
    await persistSession(response);
  }, [persistSession]);

  const value = useMemo(
    () => ({
      session,
      isRestoring,
      isAuthenticated: Boolean(session?.token),
      login,
      register,
      logout,
    }),
    [isRestoring, login, logout, register, session],
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
