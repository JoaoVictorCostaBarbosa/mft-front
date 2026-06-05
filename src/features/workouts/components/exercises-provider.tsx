"use client";

import * as React from "react";

import { getExercises } from "@/features/workouts/api/exercises-api";
import type { Exercise } from "@/features/workouts/types";
import { getApiErrorMessage } from "@/lib/http";

const exerciseRequestPageSize = 100;

type ExercisesContextValue = {
  error: string;
  exercises: Exercise[] | null;
  isLoading: boolean;
  loadExercises: () => Promise<void>;
  refetchExercises: () => Promise<void>;
};

const ExercisesContext = React.createContext<ExercisesContextValue | null>(
  null,
);

type ExercisesProviderProps = {
  children: React.ReactNode;
};

export function ExercisesProvider({ children }: ExercisesProviderProps) {
  const [exercises, setExercises] = React.useState<Exercise[] | null>(null);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const requestRef = React.useRef<Promise<void> | null>(null);

  const fetchAllExercises = React.useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const firstPage = await getExercises({
        page: 1,
        perPage: exerciseRequestPageSize,
      });
      const pages = [firstPage];

      for (
        let page = firstPage.pagination.currentPage + 1;
        page <= firstPage.pagination.totalPages;
        page += 1
      ) {
        pages.push(
          await getExercises({
            page,
            perPage: exerciseRequestPageSize,
          }),
        );
      }

      setExercises(
        pages
          .flatMap((page) => page.items)
          .sort((firstExercise, secondExercise) =>
            firstExercise.name.localeCompare(secondExercise.name, "pt-BR", {
              sensitivity: "base",
            }),
          ),
      );
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
      requestRef.current = null;
    }
  }, []);

  const loadExercises = React.useCallback(async () => {
    if (exercises !== null) {
      return;
    }

    if (!requestRef.current) {
      requestRef.current = fetchAllExercises();
    }

    await requestRef.current;
  }, [exercises, fetchAllExercises]);

  const refetchExercises = React.useCallback(async () => {
    requestRef.current = fetchAllExercises();
    await requestRef.current;
  }, [fetchAllExercises]);

  const value = React.useMemo<ExercisesContextValue>(
    () => ({
      error,
      exercises,
      isLoading,
      loadExercises,
      refetchExercises,
    }),
    [error, exercises, isLoading, loadExercises, refetchExercises],
  );

  return (
    <ExercisesContext.Provider value={value}>
      {children}
    </ExercisesContext.Provider>
  );
}

export function useExerciseCatalog() {
  const context = React.useContext(ExercisesContext);

  if (!context) {
    throw new Error("useExerciseCatalog must be used within ExercisesProvider");
  }

  const { loadExercises } = context;

  React.useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  return context;
}
