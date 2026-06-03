import type { BodyMetricEntry } from "@/features/body-metrics";
import type {
  WorkoutPlan,
  WorkoutPlanSummary,
  WorkoutTemplateSummary,
} from "@/features/workouts";

export type DashboardData = {
  currentWorkoutPlan: WorkoutPlan | null;
  measurements: BodyMetricEntry[];
  workoutPlans: WorkoutPlanSummary[];
  workoutTemplates: WorkoutTemplateSummary[];
};
