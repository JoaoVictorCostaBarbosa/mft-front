import type {
  CreateWorkoutTemplateRequest,
  UpdateWorkoutTemplateNameRequest,
  WorkoutTemplate,
  WorkoutTemplateExerciseRequest,
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

export function updateWorkoutTemplateName(
  payload: UpdateWorkoutTemplateNameRequest,
) {
  return apiFetch<WorkoutTemplate>(apiRoutes.workoutTemplates.changeName, {
    method: "PATCH",
    body: payload,
  });
}

export function addExerciseToWorkoutTemplate(
  payload: WorkoutTemplateExerciseRequest,
) {
  return apiFetch<void>(apiRoutes.workoutTemplates.addExercise, {
    method: "POST",
    body: payload,
  });
}

export function removeExerciseFromWorkoutTemplate(
  payload: WorkoutTemplateExerciseRequest,
) {
  return apiFetch<void>(apiRoutes.workoutTemplates.removeExercise, {
    method: "POST",
    body: payload,
  });
}

// Soft delete: o hard delete falha por FK quando o template tem sessões
// registradas (workout_log.workout_template_id não tem ON DELETE CASCADE).
export function deleteWorkoutTemplate(workoutTemplateId: string) {
  return apiFetch<void>(
    apiRoutes.workoutTemplates.softDelete(workoutTemplateId),
    {
      method: "DELETE",
    },
  );
}
