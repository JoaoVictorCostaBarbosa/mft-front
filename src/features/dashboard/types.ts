import type { BodyMetricEntry } from "@/features/body-metrics";
import type {
  WorkoutPlanSummary,
  WorkoutTemplateSummary,
} from "@/features/workouts";

export type DashboardData = {
  measurements: BodyMetricEntry[];
  workoutPlans: WorkoutPlanSummary[];
  workoutTemplates: WorkoutTemplateSummary[];
};
