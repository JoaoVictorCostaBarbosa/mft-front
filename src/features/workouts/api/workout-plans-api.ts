import type {
  AddRoutineItemRequest,
  CreateWorkoutPlanRequest,
  UpdateRoutineItemRequest,
  UpdateWorkoutPlanNameRequest,
  WorkoutPlan,
  WorkoutPlanRoutineItem,
  WorkoutPlanSummary,
} from "@/features/workouts/types";
import { apiRoutes } from "@/lib/api-routes";
import { apiFetch } from "@/lib/http";

export function getWorkoutPlans() {
  return apiFetch<WorkoutPlanSummary[]>(apiRoutes.workoutPlans.list);
}

export function getCurrentWorkoutPlan() {
  return apiFetch<WorkoutPlan>(apiRoutes.workoutPlans.current);
}

export function getWorkoutPlanById(workoutPlanId: string) {
  return apiFetch<WorkoutPlan>(apiRoutes.workoutPlans.byId(workoutPlanId));
}

export function createWorkoutPlan(payload: CreateWorkoutPlanRequest) {
  return apiFetch<WorkoutPlan>(apiRoutes.workoutPlans.create, {
    method: "POST",
    body: payload,
  });
}

export function updateWorkoutPlanName(payload: UpdateWorkoutPlanNameRequest) {
  return apiFetch<WorkoutPlan>(apiRoutes.workoutPlans.changeName, {
    method: "PATCH",
    body: payload,
  });
}

export function setCurrentWorkoutPlan(workoutPlanId: string) {
  return apiFetch<void>(apiRoutes.workoutPlans.setCurrent(workoutPlanId), {
    method: "PUT",
  });
}

export function addTemplateToWorkoutPlan(
  workoutPlanId: string,
  workoutTemplateId: string,
) {
  return apiFetch<void>(
    apiRoutes.workoutPlans.addTemplate(workoutPlanId, workoutTemplateId),
    {
      method: "POST",
    },
  );
}

export function addRoutineItemToWorkoutPlan(
  workoutPlanId: string,
  payload: AddRoutineItemRequest,
) {
  return apiFetch<void>(apiRoutes.workoutPlans.addRoutineItem(workoutPlanId), {
    method: "POST",
    body: payload,
  });
}

export function getNextRoutineItem(workoutPlanId: string) {
  return apiFetch<WorkoutPlanRoutineItem>(
    apiRoutes.workoutPlans.nextRoutineItem(workoutPlanId),
  );
}

export function updateRoutineItemInWorkoutPlan(
  workoutPlanId: string,
  routineItemId: string,
  payload: UpdateRoutineItemRequest,
) {
  return apiFetch<WorkoutPlanRoutineItem>(
    apiRoutes.workoutPlans.routineItem(workoutPlanId, routineItemId),
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function deleteRoutineItemFromWorkoutPlan(
  workoutPlanId: string,
  routineItemId: string,
) {
  return apiFetch<void>(
    apiRoutes.workoutPlans.routineItem(workoutPlanId, routineItemId),
    {
      method: "DELETE",
    },
  );
}
