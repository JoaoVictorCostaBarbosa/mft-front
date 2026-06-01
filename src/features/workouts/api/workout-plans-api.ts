import type {
  CreateWorkoutPlanRequest,
  WorkoutPlan,
  WorkoutPlanSummary,
} from "@/features/workouts/types";
import { apiRoutes } from "@/lib/api-routes";
import { apiFetch } from "@/lib/http";

export function getWorkoutPlans() {
  return apiFetch<WorkoutPlanSummary[]>(apiRoutes.workoutPlans.list);
}

export function createWorkoutPlan(payload: CreateWorkoutPlanRequest) {
  return apiFetch<WorkoutPlan>(apiRoutes.workoutPlans.create, {
    method: "POST",
    body: payload,
  });
}
