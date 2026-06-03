"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useAuthSession } from "@/features/auth/components/auth-provider";
import { routes } from "@/lib/routes";

type PublicAuthGuardProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export function PublicAuthGuard({
  children,
  redirectTo = routes.dashboard,
}: PublicAuthGuardProps) {
  const router = useRouter();
  const { status } = useAuthSession();

  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace(redirectTo);
    }
  }, [redirectTo, router, status]);

  if (status === "loading" || status === "authenticated") {
    return null;
  }

  return children;
}
