import type { BodyMetricEntry } from "@/features/body-metrics";
import type { WorkoutPlan, WorkoutTemplateSummary } from "@/features/workouts";
import {
  getCurrentWorkoutPlan,
  getWorkoutPlans,
} from "@/features/workouts/api/workout-plans-api";
import { apiRoutes } from "@/lib/api-routes";
import { ApiError, apiFetch } from "@/lib/http";

import type { DashboardData } from "../types";

export async function getDashboardData(): Promise<DashboardData> {
  const [currentWorkoutPlan, workoutPlans, workoutTemplates, measurements] =
    await Promise.all([
      getCurrentPlanOrNull(),
      getWorkoutPlans(),
      apiFetch<WorkoutTemplateSummary[]>(apiRoutes.workoutTemplates.list),
      apiFetch<BodyMetricEntry[]>(apiRoutes.measurements.list),
    ]);

  return {
    currentWorkoutPlan,
    measurements,
    workoutPlans,
    workoutTemplates,
  };
}

async function getCurrentPlanOrNull(): Promise<WorkoutPlan | null> {
  try {
    return await getCurrentWorkoutPlan();
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
