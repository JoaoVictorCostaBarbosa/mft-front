import type { BodyMetricEntry } from "@/features/body-metrics";
import type { CurrentWorkoutSession } from "@/features/workout-sessions/types";
import {
  getCurrentWorkoutSession,
  getWorkoutSessionWeeklySummary,
} from "@/features/workout-sessions/api/workout-sessions-api";
import type {
  WorkoutPlan,
  WorkoutPlanRoutineItem,
  WorkoutTemplateSummary,
} from "@/features/workouts";
import {
  getCurrentWorkoutPlan,
  getNextRoutineItem,
  getWorkoutPlans,
} from "@/features/workouts/api/workout-plans-api";
import { apiRoutes } from "@/lib/api-routes";
import { ApiError, apiFetch } from "@/lib/http";

import type { DashboardData } from "../types";

export async function getDashboardData(): Promise<DashboardData> {
  const weekRange = getCurrentWeekRange();
  const [
    currentWorkoutPlan,
    currentWorkoutSession,
    workoutPlans,
    workoutTemplates,
    measurements,
    weeklySummary,
  ] = await Promise.all([
    getCurrentPlanOrNull(),
    getCurrentSessionOrNull(),
    getWorkoutPlans(),
    apiFetch<WorkoutTemplateSummary[]>(apiRoutes.workoutTemplates.list),
    apiFetch<BodyMetricEntry[]>(apiRoutes.measurements.list),
    getWorkoutSessionWeeklySummary(weekRange.startDate, weekRange.endDate),
  ]);
  const nextRoutineItem =
    currentWorkoutPlan?.routine_mode === "sequential"
      ? await getNextRoutineItemOrNull(currentWorkoutPlan.id)
      : null;

  return {
    currentWorkoutPlan,
    currentWorkoutSession,
    nextRoutineItem,
    measurements,
    weeklySummary,
    workoutPlans,
    workoutTemplates,
  };
}

async function getCurrentSessionOrNull(): Promise<CurrentWorkoutSession | null> {
  try {
    return await getCurrentWorkoutSession();
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

async function getNextRoutineItemOrNull(
  workoutPlanId: string,
): Promise<WorkoutPlanRoutineItem | null> {
  try {
    return await getNextRoutineItem(workoutPlanId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
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

function getCurrentWeekRange() {
  const today = new Date();
  const start = new Date(today);

  start.setDate(today.getDate() - today.getDay());

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
