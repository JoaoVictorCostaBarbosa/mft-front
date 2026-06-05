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

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type RoutineMode = "weekly" | "sequential";

export type RoutineItemType = "workout" | "rest";

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
  routine_mode: RoutineMode;
};

export type WorkoutPlan = WorkoutPlanSummary & {
  routine_items: WorkoutPlanRoutineItem[];
  templates?: WorkoutTemplateSummary[];
};

export type CreateWorkoutPlanRequest = {
  name: string;
  routine_mode: RoutineMode;
};

export type CreateWorkoutTemplateRequest = {
  name: string;
};

export type WorkoutTemplateExerciseRequest = {
  exercise_id: string;
  id: string;
};

export type WorkoutPlanRoutineItem = {
  day_of_week: DayOfWeek | null;
  id: string;
  item_type: RoutineItemType;
  position: number | null;
  workout_template: WorkoutTemplateSummary | null;
};

export type AddRoutineItemRequest =
  | {
      item_type: "workout";
      workout_template_id: string;
      day_of_week: DayOfWeek;
      position?: never;
    }
  | {
      item_type: "rest";
      day_of_week: DayOfWeek;
      workout_template_id?: never;
      position?: never;
    }
  | {
      item_type: "workout";
      workout_template_id: string;
      position: number;
      day_of_week?: never;
    }
  | {
      item_type: "rest";
      position: number;
      workout_template_id?: never;
      day_of_week?: never;
    };

export type UpdateRoutineItemRequest =
  | {
      day_of_week: DayOfWeek;
      item_type?: RoutineItemType;
      position?: never;
    }
  | {
      day_of_week?: never;
      item_type?: RoutineItemType;
      position: number;
    };

export type UpdateWorkoutPlanNameRequest = {
  workout_plan_id: string;
  name: string;
};

export type UpdateWorkoutTemplateNameRequest = {
  workout_id: string;
  name: string;
};
