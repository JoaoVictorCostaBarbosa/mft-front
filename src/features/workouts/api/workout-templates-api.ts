import type {
  CreateWorkoutTemplateRequest,
  WorkoutTemplate,
} from "@/features/workouts/types";
import { apiRoutes } from "@/lib/api-routes";
import { apiFetch } from "@/lib/http";

export function createWorkoutTemplate(payload: CreateWorkoutTemplateRequest) {
  return apiFetch<WorkoutTemplate>(apiRoutes.workoutTemplates.create, {
    method: "POST",
    body: payload,
  });
}

export function getWorkoutTemplateById(workoutTemplateId: string) {
  return apiFetch<WorkoutTemplate>(
    apiRoutes.workoutTemplates.byId(workoutTemplateId),
  );
}
