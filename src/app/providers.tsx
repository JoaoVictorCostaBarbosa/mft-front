"use client";

import * as React from "react";

import { Toaster } from "@/components/ui/toast";
import { AuthProvider } from "@/features/auth";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
