import { Dumbbell, Flame, Heart, Trophy, type LucideIcon } from "lucide-react";

import type { UserGoal } from "@/features/auth";

export const goalOptions: Array<{
  id: UserGoal;
  label: string;
  icon: LucideIcon;
}> = [
  { id: "muscle", label: "Ganhar massa", icon: Dumbbell },
  { id: "loss", label: "Perder gordura", icon: Flame },
  { id: "strength", label: "Ficar mais forte", icon: Trophy },
  { id: "health", label: "Saúde geral", icon: Heart },
];

export function getGoalLabel(goal: UserGoal | null | undefined) {
  return goalOptions.find((option) => option.id === goal)?.label ?? null;
}
