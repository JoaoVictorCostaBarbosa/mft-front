import type {
  AddWorkoutSessionExerciseRequest,
  CreateWorkoutSessionRequest,
  CreateWorkoutSessionSetRequest,
  CurrentWorkoutSession,
  FinishedWorkoutSession,
  FinishWorkoutSessionRequest,
  WorkoutSession,
  WorkoutSessionExercise,
  WorkoutSessionHistoryResponse,
  WorkoutSessionSet,
  WorkoutSessionWeeklySummary,
} from "@/features/workout-sessions/types";
import { apiRoutes } from "@/lib/api-routes";
import { apiFetch } from "@/lib/http";

export function createWorkoutSession(payload: CreateWorkoutSessionRequest) {
  return apiFetch<WorkoutSession>(apiRoutes.workoutSessions.create, {
    method: "POST",
    body: payload,
  });
}

export function getCurrentWorkoutSession() {
  return apiFetch<CurrentWorkoutSession>(apiRoutes.workoutSessions.current);
}

export function finishWorkoutSession(
  sessionId: string,
  payload: FinishWorkoutSessionRequest = { finished_at: null },
) {
  return apiFetch<FinishedWorkoutSession>(
    apiRoutes.workoutSessions.finish(sessionId),
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function addExerciseToWorkoutSession(
  sessionId: string,
  payload: AddWorkoutSessionExerciseRequest,
) {
  return apiFetch<WorkoutSessionExercise>(
    apiRoutes.workoutSessions.exercises(sessionId),
    {
      method: "POST",
      body: payload,
    },
  );
}

export function addSetToWorkoutSession(
  sessionId: string,
  payload: CreateWorkoutSessionSetRequest,
) {
  return apiFetch<WorkoutSessionSet>(apiRoutes.workoutSessions.sets(sessionId), {
    method: "POST",
    body: payload,
  });
}

export function getWorkoutSessionHistory() {
  return apiFetch<WorkoutSessionHistoryResponse>(
    apiRoutes.workoutSessions.history,
  );
}

export function getWorkoutSessionWeeklySummary(
  startDate: string,
  endDate: string,
) {
  return apiFetch<WorkoutSessionWeeklySummary>(
    apiRoutes.workoutSessions.weeklySummary(startDate, endDate),
  );
}
