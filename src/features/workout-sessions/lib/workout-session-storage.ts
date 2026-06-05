import type { Exercise } from "@/features/workouts";
import type {
  CurrentWorkoutSession,
  WorkoutSetType,
} from "@/features/workout-sessions/types";

const activeWorkoutStorageKey = "mft:active_workout_session";

export type LocalSyncStatus = "synced" | "pending" | "syncing" | "failed";

export type LocalWorkoutSet = {
  clientOperationId: string;
  completedAt: string;
  localId: string;
  reps: number;
  serverId?: string;
  setType: WorkoutSetType;
  syncStatus: LocalSyncStatus;
  weight: number;
};

export type LocalWorkoutExercise = {
  clientOperationId?: string | null;
  exercise: Exercise;
  localId: string;
  order: number;
  serverId?: string;
  sets: LocalWorkoutSet[];
  syncStatus: LocalSyncStatus;
};

export type PendingWorkoutOperation =
  | AddExerciseOperation
  | AddSetOperation
  | UpdateSetOperation
  | DeleteSetOperation;

type BaseOperation = {
  createdAt: string;
  id: string;
  retryCount: number;
  status: Exclude<LocalSyncStatus, "synced">;
};

export type AddExerciseOperation = BaseOperation & {
  clientOperationId: string;
  exerciseId: string;
  localExerciseId: string;
  type: "ADD_EXERCISE";
};

export type AddSetOperation = BaseOperation & {
  clientOperationId: string;
  exerciseId: string;
  localSetId: string;
  payload: {
    completedAt: string;
    reps: number;
    setType: WorkoutSetType;
    weight: number;
  };
  type: "ADD_SET";
};

export type UpdateSetOperation = BaseOperation & {
  localSetId: string;
  payload: {
    reps?: number;
    setType?: WorkoutSetType;
    weight?: number;
  };
  serverSetId?: string;
  type: "UPDATE_SET";
};

export type DeleteSetOperation = BaseOperation & {
  localSetId: string;
  serverSetId?: string;
  type: "DELETE_SET";
};

export type LocalActiveWorkoutSession = {
  exercises: LocalWorkoutExercise[];
  pendingOperations: PendingWorkoutOperation[];
  session: CurrentWorkoutSession;
};

export function readActiveWorkoutSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(activeWorkoutStorageKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as LocalActiveWorkoutSession;
  } catch {
    window.localStorage.removeItem(activeWorkoutStorageKey);
    return null;
  }
}

export function writeActiveWorkoutSession(
  activeWorkoutSession: LocalActiveWorkoutSession,
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    activeWorkoutStorageKey,
    JSON.stringify(activeWorkoutSession),
  );
}

export function clearActiveWorkoutSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(activeWorkoutStorageKey);
}

