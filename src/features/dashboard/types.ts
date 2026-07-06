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
  weeklySummary: WorkoutSessionWeeklySummary;
  workoutPlans: WorkoutPlanSummary[];
  workoutTemplates: WorkoutTemplateSummary[];
};
