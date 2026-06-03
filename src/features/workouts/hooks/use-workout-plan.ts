"use client";

import * as React from "react";

import {
  addTemplateToWorkoutPlan,
  getWorkoutPlanById,
} from "@/features/workouts/api/workout-plans-api";
import { createWorkoutTemplate } from "@/features/workouts/api/workout-templates-api";
import type { WorkoutPlan } from "@/features/workouts/types";
import { getApiErrorMessage } from "@/lib/http";

type WorkoutPlanState = {
  createTemplate: (name: string) => Promise<void>;
  error: string;
  isCreatingTemplate: boolean;
  isLoading: boolean;
  plan: WorkoutPlan | null;
  refetch: () => Promise<void>;
};

export function useWorkoutPlan(planId: string): WorkoutPlanState {
  const [plan, setPlan] = React.useState<WorkoutPlan | null>(null);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCreatingTemplate, setIsCreatingTemplate] = React.useState(false);

  const fetchPlan = React.useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const workoutPlan = await getWorkoutPlanById(planId);
      setPlan(workoutPlan);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [planId]);

  const createTemplate = React.useCallback(
    async (name: string) => {
      setIsCreatingTemplate(true);

      try {
        const template = await createWorkoutTemplate({ name });
        await addTemplateToWorkoutPlan(planId, template.id);
        await fetchPlan();
      } finally {
        setIsCreatingTemplate(false);
      }
    },
    [fetchPlan, planId],
  );

  React.useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return {
    createTemplate,
    error,
    isCreatingTemplate,
    isLoading,
    plan,
    refetch: fetchPlan,
  };
}
