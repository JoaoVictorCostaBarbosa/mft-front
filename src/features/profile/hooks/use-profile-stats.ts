"use client";

import * as React from "react";

import { getPersonalRecords } from "@/features/workouts/api/exercises-api";
import { getWorkoutSessionHistory } from "@/features/workout-sessions";
import type { WorkoutSessionHistoryItem } from "@/features/workout-sessions";

type ProfileStats = {
  totalWorkouts: number | null;
  streakWeeks: number | null;
  recordsCount: number | null;
  isLoading: boolean;
};

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

function getWeekStart(date: Date) {
  const start = new Date(date);
  const dayOfWeek = start.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - daysFromMonday);
  return start;
}

// Semanas consecutivas com pelo menos um treino concluído, contando a partir
// da semana atual (ou da anterior, se ainda não houve treino nesta semana).
function getStreakWeeks(items: WorkoutSessionHistoryItem[]) {
  const trainedWeeks = new Set(
    items
      .filter((item) => item.status === "finished")
      .map((item) => getWeekStart(new Date(item.started_at)).getTime()),
  );

  const currentWeek = getWeekStart(new Date()).getTime();
  let week = trainedWeeks.has(currentWeek)
    ? currentWeek
    : currentWeek - MS_PER_WEEK;
  let streak = 0;

  while (trainedWeeks.has(week)) {
    streak += 1;
    week -= MS_PER_WEEK;
  }

  return streak;
}

export function useProfileStats(): ProfileStats {
  const [stats, setStats] = React.useState<Omit<ProfileStats, "isLoading">>({
    totalWorkouts: null,
    streakWeeks: null,
    recordsCount: null,
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isActive = true;

    async function fetchStats() {
      try {
        const [history, records] = await Promise.all([
          getWorkoutSessionHistory(),
          getPersonalRecords(),
        ]);

        if (!isActive) {
          return;
        }

        setStats({
          totalWorkouts: history.items.filter(
            (item) => item.status === "finished",
          ).length,
          streakWeeks: getStreakWeeks(history.items),
          recordsCount: records.items.length,
        });
      } catch {
        // Mantém os placeholders "—" se a busca falhar.
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      isActive = false;
    };
  }, []);

  return { ...stats, isLoading };
}
