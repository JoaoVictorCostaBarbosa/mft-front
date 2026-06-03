"use client";

import * as React from "react";

import { getCurrentUser, signOut } from "@/features/auth/api/auth-api";
import type { AuthSession } from "@/features/auth/types";
import { authSessionExpiredEvent } from "@/lib/http";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  user: AuthSession["user"] | null;
  refresh: () => Promise<void>;
  setAuthenticatedUser: (user: AuthSession["user"]) => void;
  clearSession: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

async function resolveSession() {
  return getCurrentUser();
}

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = React.useState<AuthStatus>("loading");
  const [user, setUser] = React.useState<AuthSession["user"] | null>(null);

  const refresh = React.useCallback(async () => {
    setStatus("loading");

    try {
      const currentUser = await resolveSession();
      setUser(currentUser);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const setAuthenticatedUser = React.useCallback((user: AuthSession["user"]) => {
    setUser(user);
    setStatus("authenticated");
  }, []);

  const clearSession = React.useCallback(async () => {
    try {
      await signOut();
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  React.useEffect(() => {
    function handleSessionExpired() {
      setUser(null);
      setStatus("unauthenticated");
    }

    window.addEventListener(authSessionExpiredEvent, handleSessionExpired);

    return () => {
      window.removeEventListener(authSessionExpiredEvent, handleSessionExpired);
    };
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      refresh,
      setAuthenticatedUser,
      clearSession,
    }),
    [clearSession, refresh, setAuthenticatedUser, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthSession() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthProvider");
  }

  return context;
}
