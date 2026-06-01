"use client";

import * as React from "react";

import {
  getCurrentUser,
  refreshSession,
} from "@/features/auth/api/auth-api";
import type { AuthSession } from "@/features/auth/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthSessionState = {
  status: AuthStatus;
  user: AuthSession["user"] | null;
};

async function resolveSession() {
  try {
    return await getCurrentUser();
  } catch {
    await refreshSession();
    return getCurrentUser();
  }
}

export function useAuthSession() {
  const [state, setState] = React.useState<AuthSessionState>({
    status: "loading",
    user: null,
  });

  React.useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      try {
        const user = await resolveSession();

        if (!isMounted) {
          return;
        }

        setState({
          status: "authenticated",
          user,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setState({
          status: "unauthenticated",
          user: null,
        });
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
