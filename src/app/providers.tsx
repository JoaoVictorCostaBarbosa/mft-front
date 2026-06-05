"use client";

import * as React from "react";

import { Toaster } from "@/components/ui/toast";
import { AuthProvider } from "@/features/auth";
import { ActiveWorkoutProvider } from "@/features/workout-sessions";
import { ExercisesProvider, WorkoutPlansProvider } from "@/features/workouts";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ExercisesProvider>
        <WorkoutPlansProvider>
          <ActiveWorkoutProvider>
            {children}
            <Toaster />
          </ActiveWorkoutProvider>
        </WorkoutPlansProvider>
      </ExercisesProvider>
    </AuthProvider>
  );
}
