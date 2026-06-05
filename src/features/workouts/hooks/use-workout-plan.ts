"use client";

import * as React from "react";

import {
  addRoutineItemToWorkoutPlan,
  deleteRoutineItemFromWorkoutPlan,
  getWorkoutPlanById,
  updateRoutineItemInWorkoutPlan,
} from "@/features/workouts/api/workout-plans-api";
import {
  createWorkoutTemplate,
  deleteWorkoutTemplate,
  updateWorkoutTemplateName,
} from "@/features/workouts/api/workout-templates-api";
import type { DayOfWeek, WorkoutPlan } from "@/features/workouts/types";
import { getApiErrorMessage } from "@/lib/http";

type CreateTemplatePayload =
  | {
      dayOfWeek: DayOfWeek;
      name: string;
      position?: never;
    }
  | {
      dayOfWeek?: never;
      name: string;
      position: number;
    };

type CreateRestPayload =
  | {
      dayOfWeek: DayOfWeek;
      position?: never;
    }
  | {
      dayOfWeek?: never;
      position: number;
    };

type WorkoutPlanState = {
  createRest: (payload: CreateRestPayload) => Promise<void>;
  createTemplate: (payload: CreateTemplatePayload) => Promise<void>;
  deleteRoutineItem: (routineItemId: string) => Promise<void>;
  deleteTemplate: (templateId: string) => Promise<void>;
  error: string;
  isCreatingTemplate: boolean;
  isLoading: boolean;
  plan: WorkoutPlan | null;
  refetch: () => Promise<void>;
  renameTemplate: (templateId: string, name: string) => Promise<void>;
  updateRoutineItemSchedule: (
    routineItemId: string,
    payload: { dayOfWeek: DayOfWeek } | { position: number },
  ) => Promise<void>;
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
    async (payload: CreateTemplatePayload) => {
      setIsCreatingTemplate(true);

      try {
        const template = await createWorkoutTemplate({ name: payload.name });

        if (payload.dayOfWeek) {
          await addRoutineItemToWorkoutPlan(planId, {
            item_type: "workout",
            workout_template_id: template.id,
            day_of_week: payload.dayOfWeek,
          });
        } else {
          await addRoutineItemToWorkoutPlan(planId, {
            item_type: "workout",
            workout_template_id: template.id,
            position: payload.position,
          });
        }

        await fetchPlan();
      } finally {
        setIsCreatingTemplate(false);
      }
    },
    [fetchPlan, planId],
  );

  const createRest = React.useCallback(
    async (payload: CreateRestPayload) => {
      setIsCreatingTemplate(true);

      try {
        if (payload.dayOfWeek) {
          await addRoutineItemToWorkoutPlan(planId, {
            item_type: "rest",
            day_of_week: payload.dayOfWeek,
          });
        } else {
          await addRoutineItemToWorkoutPlan(planId, {
            item_type: "rest",
            position: payload.position,
          });
        }

        await fetchPlan();
      } finally {
        setIsCreatingTemplate(false);
      }
    },
    [fetchPlan, planId],
  );

  const renameTemplate = React.useCallback(
    async (templateId: string, name: string) => {
      await updateWorkoutTemplateName({
        workout_id: templateId,
        name,
      });
      await fetchPlan();
    },
    [fetchPlan],
  );

  const deleteTemplate = React.useCallback(
    async (templateId: string) => {
      await deleteWorkoutTemplate(templateId);
      await fetchPlan();
    },
    [fetchPlan],
  );

  const deleteRoutineItem = React.useCallback(
    async (routineItemId: string) => {
      await deleteRoutineItemFromWorkoutPlan(planId, routineItemId);
      await fetchPlan();
    },
    [fetchPlan, planId],
  );

  const updateRoutineItemSchedule = React.useCallback(
    async (
      routineItemId: string,
      payload: { dayOfWeek: DayOfWeek } | { position: number },
    ) => {
      await updateRoutineItemInWorkoutPlan(
        planId,
        routineItemId,
        "dayOfWeek" in payload
          ? { day_of_week: payload.dayOfWeek }
          : { position: payload.position },
      );
      await fetchPlan();
    },
    [fetchPlan, planId],
  );

  React.useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return {
    createRest,
    createTemplate,
    deleteRoutineItem,
    deleteTemplate,
    error,
    isCreatingTemplate,
    isLoading,
    plan,
    refetch: fetchPlan,
    renameTemplate,
    updateRoutineItemSchedule,
  };
}
