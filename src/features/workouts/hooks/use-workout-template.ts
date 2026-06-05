"use client";

import * as React from "react";

import {
  addExerciseToWorkoutTemplate,
  getWorkoutTemplateById,
  removeExerciseFromWorkoutTemplate,
} from "@/features/workouts/api/workout-templates-api";
import type { WorkoutTemplate } from "@/features/workouts/types";
import { getApiErrorMessage } from "@/lib/http";

type WorkoutTemplateState = {
  addExercise: (exerciseId: string) => Promise<void>;
  error: string;
  isLoading: boolean;
  isMutating: boolean;
  refetch: () => Promise<void>;
  removeExercise: (exerciseId: string) => Promise<void>;
  template: WorkoutTemplate | null;
};

export function useWorkoutTemplate(
  templateId: string,
): WorkoutTemplateState {
  const [template, setTemplate] = React.useState<WorkoutTemplate | null>(null);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMutating, setIsMutating] = React.useState(false);

  const fetchTemplate = React.useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const workoutTemplate = await getWorkoutTemplateById(templateId);
      setTemplate(workoutTemplate);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [templateId]);

  const addExercise = React.useCallback(
    async (exerciseId: string) => {
      setIsMutating(true);

      try {
        await addExerciseToWorkoutTemplate({
          id: templateId,
          exercise_id: exerciseId,
        });
        await fetchTemplate();
      } finally {
        setIsMutating(false);
      }
    },
    [fetchTemplate, templateId],
  );

  const removeExercise = React.useCallback(
    async (exerciseId: string) => {
      setIsMutating(true);

      try {
        await removeExerciseFromWorkoutTemplate({
          id: templateId,
          exercise_id: exerciseId,
        });
        await fetchTemplate();
      } finally {
        setIsMutating(false);
      }
    },
    [fetchTemplate, templateId],
  );

  React.useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  return {
    addExercise,
    error,
    isLoading,
    isMutating,
    refetch: fetchTemplate,
    removeExercise,
    template,
  };
}
