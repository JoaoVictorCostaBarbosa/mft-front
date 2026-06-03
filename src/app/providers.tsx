"use client";

import * as React from "react";

import { Toaster } from "@/components/ui/toast";
import { AuthProvider } from "@/features/auth";
import { WorkoutPlansProvider } from "@/features/workouts";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <WorkoutPlansProvider>
        {children}
        <Toaster />
      </WorkoutPlansProvider>
    </AuthProvider>
  );
}
