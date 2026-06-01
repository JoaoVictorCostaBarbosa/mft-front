export type Equipment =
  | "Barbell"
  | "Dumbbell"
  | "Machine"
  | "Bodyweight"
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
