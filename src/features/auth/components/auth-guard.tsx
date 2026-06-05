"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useAuthSession } from "@/features/auth/components/auth-provider";
import { getUnauthenticatedEntryRoute } from "@/features/auth/lib/auth-entry-storage";

type AuthGuardProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export function AuthGuard({
  children,
  redirectTo,
}: AuthGuardProps) {
  const router = useRouter();
  const { status } = useAuthSession();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(redirectTo ?? getUnauthenticatedEntryRoute());
    }
  }, [redirectTo, router, status]);

  if (status !== "authenticated") {
    return null;
  }

  return children;
}
