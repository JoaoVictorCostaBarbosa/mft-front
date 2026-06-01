"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { LoadingState } from "@/components/ui/loading-state";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { routes } from "@/lib/routes";

type AuthGuardProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export function AuthGuard({
  children,
  redirectTo = routes.home,
}: AuthGuardProps) {
  const router = useRouter();
  const { status } = useAuthSession();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(redirectTo);
    }
  }, [redirectTo, router, status]);

  if (status !== "authenticated") {
    return (
      <LoadingState
        title="Verificando sessão"
        description="Estamos conferindo se sua sessão ainda está ativa."
      />
    );
  }

  return children;
}
