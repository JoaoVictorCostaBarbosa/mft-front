"use client";

import * as React from "react";

import { getExercises } from "@/features/workouts/api/exercises-api";
import type {
  Equipment,
  Exercise,
  ExerciseType,
  MuscleGroup,
} from "@/features/workouts/types";
import { getApiErrorMessage } from "@/lib/http";

const exercisesPerPage = 20;

export type ExerciseFilters = {
  equipment?: Equipment;
  exerciseType?: ExerciseType;
  muscleGroup?: MuscleGroup;
};

type ExercisesState = {
  error: string;
  hasNext: boolean;
  hasPrevious: boolean;
  exercises: Exercise[] | null;
  isLoading: boolean;
  page: number;
  perPage: number;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  total: number;
  totalPages: number;
};

export function useExercises(filters: ExerciseFilters = {}): ExercisesState {
  const [exercises, setExercises] = React.useState<Exercise[] | null>(null);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(exercisesPerPage);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [hasNext, setHasNext] = React.useState(false);
  const [hasPrevious, setHasPrevious] = React.useState(false);

  const fetchExercises = React.useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const exercisePage = await getExercises({
        page,
        perPage: exercisesPerPage,
        ...filters,
      });
      setExercises(
        [...exercisePage.items].sort((firstExercise, secondExercise) =>
          firstExercise.name.localeCompare(secondExercise.name, "pt-BR", {
            sensitivity: "base",
          }),
        ),
      );
      setPage(exercisePage.pagination.currentPage);
      setPerPage(exercisePage.pagination.itemsPerPage);
      setTotal(exercisePage.pagination.totalItems);
      setTotalPages(exercisePage.pagination.totalPages);
      setHasNext(exercisePage.pagination.hasNext);
      setHasPrevious(exercisePage.pagination.hasPrevious);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  React.useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return {
    error,
    hasNext,
    hasPrevious,
    exercises,
    isLoading,
    page,
    perPage,
    refetch: fetchExercises,
    setPage,
    total,
    totalPages,
  };
}
