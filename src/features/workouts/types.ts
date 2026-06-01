export type Exercise = {
  id: string;
  name: string;
  muscleGroup?: string;
};

export type Workout = {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
};
