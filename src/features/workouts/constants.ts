import type { DayOfWeek, RoutineMode } from "@/features/workouts/types";

export const dayOfWeekOrder: DayOfWeek[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const dayOfWeekLabels: Record<DayOfWeek, string> = {
  sunday: "Domingo",
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
};

export const dayOfWeekOptions = dayOfWeekOrder.map((dayOfWeek) => [
  dayOfWeek,
  dayOfWeekLabels[dayOfWeek],
] as const);

export const dayOfWeekInitials: Record<DayOfWeek, string> = {
  sunday: "D",
  monday: "S",
  tuesday: "T",
  wednesday: "Q",
  thursday: "Q",
  friday: "S",
  saturday: "S",
};

export const routineModeLabels: Record<RoutineMode, string> = {
  weekly: "Semanal",
  sequential: "Sequencial",
};
