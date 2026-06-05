"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useAuthSession } from "@/features/auth/components/auth-provider";
import { getUnauthenticatedEntryRoute } from "@/features/auth/lib/auth-entry-storage";
import { routes } from "@/lib/routes";

export function AuthEntryRedirect() {
  const router = useRouter();
  const { status } = useAuthSession();

  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace(routes.dashboard);
      return;
    }

    if (status === "unauthenticated") {
      router.replace(getUnauthenticatedEntryRoute());
    }
  }, [router, status]);

  return null;
}
