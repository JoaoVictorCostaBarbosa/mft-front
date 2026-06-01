export const apiRoutes = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    refresh: "/api/auth/refresh",
    register: "/api/auth/register",
    verify: "/api/auth/verify",
  },
  users: {
    me: "/api/users/me",
    avatar: "/api/users/me/avatar",
    email: "/api/users/me/email",
    password: "/api/users/me/password",
    sendCode: "/api/users/send-code",
  },
  exercises: {
    list: "/api/exercises",
  },
  measurements: {
    list: "/api/measurements",
  },
  workoutPlans: {
    list: "/api/workout-plans",
    create: "/api/workout-plans",
  },
  workoutTemplates: {
    list: "/api/workout-templates",
  },
} as const;
