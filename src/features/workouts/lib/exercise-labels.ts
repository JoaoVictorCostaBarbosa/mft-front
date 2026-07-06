import type {
  Equipment,
  ExerciseType,
  MuscleGroup,
} from "@/features/workouts/types";

export const exerciseTypeLabels: Record<ExerciseType, string> = {
  Balance: "Equilíbrio",
  Cardio: "Cardio",
  Flexibility: "Flexibilidade",
  Strength: "Força",
};

export const equipmentLabels: Record<Equipment, string> = {
  Barbell: "Barra",
  Bodyweight: "Peso corporal",
  Dumbbell: "Halter",
  Kettlebell: "Kettlebell",
  Kettlerbell: "Kettlebell",
  Machine: "Máquina",
  Other: "Outro",
  ResistanceBand: "Elástico",
};

export const muscleGroupLabels: Record<MuscleGroup, string> = {
  Arms: "Braços",
  Back: "Costas",
  Chest: "Peito",
  Core: "Core",
  FullBody: "Corpo todo",
  Legs: "Pernas",
  Other: "Outro",
  Shoulders: "Ombros",
};

export const muscleGroupAccentClasses: Record<MuscleGroup, string> = {
  Arms: "bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30",
  Back: "bg-[#60a5fa]/15 text-[#60a5fa] border-[#60a5fa]/30",
  Chest: "bg-[#f472b6]/15 text-[#f472b6] border-[#f472b6]/30",
  Core: "bg-[#a78bfa]/15 text-[#a78bfa] border-[#a78bfa]/30",
  FullBody: "bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30",
  Legs: "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30",
  Other: "bg-muted/40 text-muted-foreground border-border",
  Shoulders: "bg-primary/10 text-primary border-primary/30",
};
