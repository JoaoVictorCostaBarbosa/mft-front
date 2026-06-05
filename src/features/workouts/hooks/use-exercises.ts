"use client";

import * as React from "react";

import { useExerciseCatalog } from "@/features/workouts/components/exercises-provider";
import type {
  Equipment,
  Exercise,
  ExerciseType,
  MuscleGroup,
} from "@/features/workouts/types";

const exercisesPerPage = 20;
const emptyFilters: ExerciseFilters = {};

export type ExerciseFilters = {
  equipment?: Equipment;
  exerciseType?: ExerciseType;
  muscleGroup?: MuscleGroup;
  query?: string;
};

type ExercisesState = {
  allExercises: Exercise[] | null;
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

export function useExercises(
  filters: ExerciseFilters = emptyFilters,
): ExercisesState {
  const {
    error,
    exercises: catalogExercises,
    isLoading,
    refetchExercises,
  } = useExerciseCatalog();
  const [page, setPage] = React.useState(1);
  const normalizedQuery = normalize(filters.query ?? "");

  const filteredExercises = React.useMemo(() => {
    if (!catalogExercises) {
      return null;
    }

    return catalogExercises.filter(
      (exercise) =>
        (!normalizedQuery || normalize(exercise.name).includes(normalizedQuery)) &&
        (!filters.equipment || exercise.equipment === filters.equipment) &&
        (!filters.exerciseType ||
          exercise.exercise_type === filters.exerciseType) &&
        (!filters.muscleGroup || exercise.muscle_group === filters.muscleGroup),
    );
  }, [
    catalogExercises,
    filters.equipment,
    filters.exerciseType,
    filters.muscleGroup,
    normalizedQuery,
  ]);
  const total = filteredExercises?.length ?? 0;
  const totalPages = Math.max(Math.ceil(total / exercisesPerPage), 1);
  const safePage = Math.min(page, totalPages);
  const visibleExercises = React.useMemo(() => {
    if (!filteredExercises) {
      return null;
    }

    const startIndex = (safePage - 1) * exercisesPerPage;

    return filteredExercises.slice(startIndex, startIndex + exercisesPerPage);
  }, [filteredExercises, safePage]);

  React.useEffect(() => {
    setPage(1);
  }, [
    filters.equipment,
    filters.exerciseType,
    filters.muscleGroup,
    normalizedQuery,
  ]);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return {
    allExercises: filteredExercises,
    error,
    hasNext: safePage < totalPages,
    hasPrevious: safePage > 1,
    exercises: visibleExercises,
    isLoading,
    page: safePage,
    perPage: exercisesPerPage,
    refetch: refetchExercises,
    setPage,
    total,
    totalPages,
  };
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
