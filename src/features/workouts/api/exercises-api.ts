import type {
  Equipment,
  Exercise,
  ExerciseType,
  MuscleGroup,
} from "@/features/workouts/types";
import type { WorkoutSetType } from "@/features/workout-sessions";
import { apiRoutes } from "@/lib/api-routes";
import { apiFetch } from "@/lib/http";

export type ExerciseLastPerformanceSet = {
  order: number;
  reps: number;
  set_type: WorkoutSetType;
  weight: number;
};

export type ExerciseLastPerformance = {
  exercise_id: string;
  last_session_id: string;
  performed_at: string;
  sets: ExerciseLastPerformanceSet[];
};

export type GetExerciseLastPerformancesRequest = {
  exercise_ids: string[];
};

export type ExerciseLastPerformancesResponse = {
  items: ExerciseLastPerformance[];
};

export type GetExercisesParams = {
  equipment?: Equipment;
  exerciseType?: ExerciseType;
  muscleGroup?: MuscleGroup;
  page: number;
  perPage: number;
};

export type ExercisesPagination = {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

export type ExercisesResponse = {
  items: Exercise[];
  pagination: ExercisesPagination;
};

export function getExercises({
  equipment,
  exerciseType,
  muscleGroup,
  page,
  perPage,
}: GetExercisesParams) {
  return apiFetch<ExercisesResponse>(
    getExercisesRoute({ equipment, exerciseType, muscleGroup, page, perPage }),
  );
}

export function getExerciseLastPerformances(
  payload: GetExerciseLastPerformancesRequest,
) {
  return apiFetch<ExerciseLastPerformancesResponse>(
    apiRoutes.exercises.lastPerformances,
    {
      method: "POST",
      body: payload,
    },
  );
}

function getExercisesRoute({
  equipment,
  exerciseType,
  muscleGroup,
  page,
  perPage,
}: GetExercisesParams) {
  if (muscleGroup) {
    return apiRoutes.exercises.byMuscleGroup(
      encodeURIComponent(muscleGroup),
      page,
      perPage,
    );
  }

  if (exerciseType) {
    return apiRoutes.exercises.byType(
      encodeURIComponent(exerciseType),
      page,
      perPage,
    );
  }

  if (equipment) {
    return apiRoutes.exercises.byEquipment(
      encodeURIComponent(equipment),
      page,
      perPage,
    );
  }

  return apiRoutes.exercises.list(page, perPage);
}
