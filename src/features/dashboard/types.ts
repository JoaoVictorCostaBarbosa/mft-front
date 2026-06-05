import type { BodyMetricEntry } from "@/features/body-metrics";
import type {
  CurrentWorkoutSession,
  WorkoutSessionWeeklySummary,
} from "@/features/workout-sessions/types";
import type {
  WorkoutPlan,
  WorkoutPlanRoutineItem,
  WorkoutPlanSummary,
  WorkoutTemplateSummary,
} from "@/features/workouts";

export type DashboardData = {
  currentWorkoutPlan: WorkoutPlan | null;
  currentWorkoutSession: CurrentWorkoutSession | null;
  nextRoutineItem: WorkoutPlanRoutineItem | null;
  measurements: BodyMetricEntry[];
  weeklySummary: WorkoutSessionWeeklySummary;
  workoutPlans: WorkoutPlanSummary[];
  workoutTemplates: WorkoutTemplateSummary[];
};
