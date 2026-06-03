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
    list: (page: number, perPage: number) =>
      `/api/exercises?page=${page}&per_page=${perPage}`,
    byEquipment: (equipment: string, page: number, perPage: number) =>
      `/api/exercises/equipment/${equipment}?page=${page}&per_page=${perPage}`,
    byMuscleGroup: (muscleGroup: string, page: number, perPage: number) =>
      `/api/exercises/muscle-group/${muscleGroup}?page=${page}&per_page=${perPage}`,
    byType: (exerciseType: string, page: number, perPage: number) =>
      `/api/exercises/type/${exerciseType}?page=${page}&per_page=${perPage}`,
  },
  measurements: {
    list: "/api/measurements",
  },
  workoutPlans: {
    list: "/api/workout-plans",
    create: "/api/workout-plans",
    changeName: "/api/workout-plans/change-name",
    current: "/api/workout-plans/current",
    byId: (workoutPlanId: string) => `/api/workout-plans/${workoutPlanId}`,
    addTemplate: (workoutPlanId: string, workoutTemplateId: string) =>
      `/api/workout-plans/${workoutPlanId}/workout-template/${workoutTemplateId}`,
    setCurrent: (workoutPlanId: string) =>
      `/api/workout-plans/${workoutPlanId}/current`,
  },
  workoutTemplates: {
    list: "/api/workout-templates",
    create: "/api/workout-templates",
    byId: (workoutId: string) => `/api/workout-templates/${workoutId}`,
  },
} as const;
