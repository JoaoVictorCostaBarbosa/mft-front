"use client";

import * as React from "react";

import { getApiErrorMessage } from "@/lib/http";

import { getWorkoutSessionHistory } from "../api/workout-sessions-api";
import type { WorkoutSessionHistoryItem } from "../types";

type WorkoutSessionHistoryState = {
  items: WorkoutSessionHistoryItem[];
  error: string;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

export function useWorkoutSessionHistory(): WorkoutSessionHistoryState {
  const [items, setItems] = React.useState<WorkoutSessionHistoryItem[]>([]);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchHistory = React.useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const history = await getWorkoutSessionHistory();
      setItems(history.items);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    items,
    error,
    isLoading,
    refetch: fetchHistory,
  };
}
