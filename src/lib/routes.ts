export const routes = {
  home: "/",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  workouts: "/workouts",
  workoutPlan: (planId: string) => `/workouts/${planId}`,
  workoutExercises: "/workouts/exercises",
  progress: "/progress",
  bodyMetrics: "/body-metrics",
  profile: "/profile",
  signIn: "/sign-in",
  signUp: "/sign-up",
} as const;
