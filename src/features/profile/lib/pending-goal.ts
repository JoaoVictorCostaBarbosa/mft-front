import type { UserGoal } from "@/features/auth";

const pendingGoalKey = "mft:pending-goal";

const validGoals: UserGoal[] = ["muscle", "loss", "strength", "health"];

export function savePendingGoal(goal: UserGoal) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(pendingGoalKey, goal);
}

export function readPendingGoal(): UserGoal | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(pendingGoalKey);

  return validGoals.includes(stored as UserGoal) ? (stored as UserGoal) : null;
}

export function clearPendingGoal() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(pendingGoalKey);
}
