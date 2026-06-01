import type { BodyMetricEntry } from "@/features/body-metrics";
import type { WorkoutTemplateSummary } from "@/features/workouts";
import { getWorkoutPlans } from "@/features/workouts/api/workout-plans-api";
import { apiRoutes } from "@/lib/api-routes";
import { apiFetch } from "@/lib/http";

import type { DashboardData } from "../types";

export async function getDashboardData(): Promise<DashboardData> {
  const [workoutPlans, workoutTemplates, measurements] = await Promise.all([
    getWorkoutPlans(),
    apiFetch<WorkoutTemplateSummary[]>(apiRoutes.workoutTemplates.list),
    apiFetch<BodyMetricEntry[]>(apiRoutes.measurements.list),
  ]);

  return {
    measurements,
    workoutPlans,
    workoutTemplates,
  };
}
