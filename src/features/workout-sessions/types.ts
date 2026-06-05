import type { DayOfWeek, Exercise } from "@/features/workouts";

export type WorkoutSessionStatus = "in_progress" | "finished" | "cancelled";

export type WorkoutSetType = "warmup" | "working" | "drop" | "failure";

export type WorkoutSessionTemplate = {
  id: string;
  name: string;
};

export type WorkoutSession = {
  finished_at: string | null;
  id: string;
  started_at: string;
  status: WorkoutSessionStatus;
  user_id: string;
  workout_plan_id: string | null;
  workout_template_id: string | null;
};

export type CurrentWorkoutSession = {
  exercises: CurrentWorkoutSessionExercise[];
  id: string;
  started_at: string;
  status: "in_progress";
  workout_plan_id: string | null;
  workout_template: WorkoutSessionTemplate | null;
};

export type CurrentWorkoutSessionExercise = {
  client_operation_id?: string | null;
  exercise: Exercise;
  id: string;
  order: number;
  sets: WorkoutSessionSet[];
};

export type FinishedWorkoutSession = {
  finished_at: string;
  id: string;
  started_at: string;
  status: "finished";
};

export type CreateWorkoutSessionRequest = {
  workout_plan_id?: string | null;
  workout_template_id?: string | null;
};

export type FinishWorkoutSessionRequest = {
  finished_at?: string | null;
};

export type AddWorkoutSessionExerciseRequest = {
  client_operation_id?: string;
  exercise_id: string;
};

export type WorkoutSessionExercise = {
  client_operation_id?: string | null;
  exercise_id: string;
  id: string;
  order?: number;
  workout_session_id: string;
};

export type CreateWorkoutSessionSetRequest = {
  client_operation_id?: string;
  completed_at?: string;
  exercise_id: string;
  reps: number;
  set_type: WorkoutSetType;
  weight: number;
};

export type UpdateWorkoutSessionSetRequest = {
  reps?: number;
  set_type?: WorkoutSetType;
  weight?: number;
};

export type WorkoutSessionSet = {
  client_operation_id?: string | null;
  completed_at?: string;
  created_at: string;
  id: string;
  reps: number;
  session_exercise_id: string;
  set_type: WorkoutSetType;
  weight: number;
};

export type ReorderWorkoutSessionExercisesRequest = {
  ordered_session_exercise_ids: string[];
};

export type WorkoutSessionHistoryItem = {
  finished_at: string | null;
  id: string;
  started_at: string;
  status: WorkoutSessionStatus;
  workout_plan_id: string;
  workout_template: WorkoutSessionTemplate;
};

export type WorkoutSessionHistoryResponse = {
  items: WorkoutSessionHistoryItem[];
};

export type WorkoutSessionWeeklySummaryDay = {
  date: string;
  day_of_week: DayOfWeek;
  session_id: string | null;
  trained: boolean;
};

export type WorkoutSessionWeeklySummary = {
  days: WorkoutSessionWeeklySummaryDay[];
};
