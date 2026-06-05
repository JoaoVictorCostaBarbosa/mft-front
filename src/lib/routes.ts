export const routes = {
  home: "/",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  workouts: "/workouts",
  workoutPlan: (planId: string) => `/workouts/${planId}`,
  workoutTemplate: (templateId: string, planId?: string) =>
    `/workouts/templates/${templateId}${planId ? `?planId=${planId}` : ""}`,
  workoutExercises: "/workouts/exercises",
  workoutSession: "/workouts/session",
  progress: "/progress",
  bodyMetrics: "/body-metrics",
  profile: "/profile",
  signIn: "/sign-in",
  signUp: "/sign-up",
} as const;
