"use client";

import * as React from "react";

import { Toaster } from "@/components/ui/toast";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
