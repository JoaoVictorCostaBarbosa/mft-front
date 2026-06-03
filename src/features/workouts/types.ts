export type Equipment =
  | "Barbell"
  | "Dumbbell"
  | "Machine"
  | "Bodyweight"
  | "Kettlebell"
  | "Kettlerbell"
  | "ResistanceBand"
  | "Other";

export type ExerciseType = "Strength" | "Cardio" | "Flexibility" | "Balance";

export type MuscleGroup =
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Arms"
  | "Legs"
  | "Core"
  | "FullBody"
  | "Other";

export type Exercise = {
  id: string;
  name: string;
  exercise_type: ExerciseType;
  equipment: Equipment;
  muscle_group: MuscleGroup;
};

export type WorkoutTemplateSummary = {
  id: string;
  user_id: string;
  name: string;
};

export type WorkoutTemplate = WorkoutTemplateSummary & {
  exercises: Exercise[];
};

export type WorkoutPlanSummary = {
  id: string;
  user_id: string;
  name: string;
};

export type WorkoutPlan = WorkoutPlanSummary & {
  templates: WorkoutTemplateSummary[];
};

export type CreateWorkoutPlanRequest = {
  name: string;
};

export type CreateWorkoutTemplateRequest = {
  name: string;
};

export type UpdateWorkoutPlanNameRequest = {
  workout_plan_id: string;
  name: string;
};
