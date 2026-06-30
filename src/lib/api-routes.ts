export const apiRoutes = {
  auth: {
    google: "/api/auth/google",
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
    lastPerformances: "/api/exercises/last-performances",
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
    addRoutineItem: (workoutPlanId: string) =>
      `/api/workout-plans/${workoutPlanId}/routine-items`,
    nextRoutineItem: (workoutPlanId: string) =>
      `/api/workout-plans/${workoutPlanId}/next-routine-item`,
    routineItem: (workoutPlanId: string, routineItemId: string) =>
      `/api/workout-plans/${workoutPlanId}/routine-items/${routineItemId}`,
    addTemplate: (workoutPlanId: string, workoutTemplateId: string) =>
      `/api/workout-plans/${workoutPlanId}/workout-template/${workoutTemplateId}`,
    setCurrent: (workoutPlanId: string) =>
      `/api/workout-plans/${workoutPlanId}/current`,
  },
  workoutTemplates: {
    list: "/api/workout-templates",
    create: "/api/workout-templates",
    addExercise: "/api/workout-templates/add-exercise",
    changeName: "/api/workout-templates/change-name",
    removeExercise: "/api/workout-templates/remove-exercise",
    byId: (workoutId: string) => `/api/workout-templates/${workoutId}`,
  },
  workoutSessions: {
    create: "/api/workout-sessions",
    current: "/api/workout-sessions/current",
    cancel: (sessionId: string) => `/api/workout-sessions/${sessionId}`,
    finish: (sessionId: string) => `/api/workout-sessions/${sessionId}/finish`,
    exercises: (sessionId: string) =>
      `/api/workout-sessions/${sessionId}/exercises`,
    exercise: (sessionId: string, sessionExerciseId: string) =>
      `/api/workout-sessions/${sessionId}/exercises/${sessionExerciseId}`,
    reorderExercises: (sessionId: string) =>
      `/api/workout-sessions/${sessionId}/exercises/reorder`,
    sets: (sessionId: string) => `/api/workout-sessions/${sessionId}/sets`,
    set: (sessionId: string, setId: string) =>
      `/api/workout-sessions/${sessionId}/sets/${setId}`,
    history: "/api/workout-sessions/history",
    weeklySummary: (startDate: string, endDate: string) =>
      `/api/workout-sessions/weekly-summary?start_date=${startDate}&end_date=${endDate}`,
  },
} as const;
