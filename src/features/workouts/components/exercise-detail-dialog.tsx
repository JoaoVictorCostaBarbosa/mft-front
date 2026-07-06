"use client";

import { History } from "lucide-react";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getExerciseById,
  getExerciseLastPerformances,
  type ExerciseLastPerformance,
} from "@/features/workouts/api/exercises-api";
import {
  equipmentLabels,
  exerciseTypeLabels,
  muscleGroupAccentClasses,
  muscleGroupLabels,
} from "@/features/workouts/lib/exercise-labels";
import type { Exercise } from "@/features/workouts/types";
import { getApiErrorMessage } from "@/lib/http";
import { cn } from "@/lib/utils";

type ExerciseDetailDialogProps = {
  exerciseId: string;
  children: React.ReactNode;
};

function formatPerformanceDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

function formatWeight(weight: number) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(
    weight,
  );
}

export function ExerciseDetailDialog({
  exerciseId,
  children,
}: ExerciseDetailDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [exercise, setExercise] = React.useState<Exercise | null>(null);
  const [lastPerformance, setLastPerformance] =
    React.useState<ExerciseLastPerformance | null>(null);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    setIsLoading(true);
    setError("");

    Promise.all([
      getExerciseById(exerciseId),
      getExerciseLastPerformances({ exercise_ids: [exerciseId] }),
    ])
      .then(([exerciseDetail, performances]) => {
        if (cancelled) {
          return;
        }
        setExercise(exerciseDetail);
        setLastPerformance(performances.items[0] ?? null);
      })
      .catch((error) => {
        if (!cancelled) {
          setError(getApiErrorMessage(error));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, exerciseId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{exercise?.name ?? "Exercício"}</DialogTitle>
          <DialogDescription>
            Detalhes do exercício e sua última execução.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="grid gap-2.5">
            <Skeleton className="h-7 rounded-full" />
            <Skeleton className="h-24 rounded-[14px]" />
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </div>
        ) : exercise ? (
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-2">
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold",
                  muscleGroupAccentClasses[exercise.muscle_group],
                )}
              >
                {muscleGroupLabels[exercise.muscle_group]}
              </span>
              <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                {exerciseTypeLabels[exercise.exercise_type]}
              </span>
              <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                {equipmentLabels[exercise.equipment] ?? exercise.equipment}
              </span>
            </div>

            <div className="rounded-[14px] border border-border bg-card p-3.5">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <History className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Última execução
                </span>
                {lastPerformance ? (
                  <span className="ml-auto text-xs font-medium">
                    {formatPerformanceDate(lastPerformance.performed_at)}
                  </span>
                ) : null}
              </div>

              {lastPerformance?.sets.length ? (
                <ul className="grid gap-1.5">
                  {lastPerformance.sets.map((set) => (
                    <li
                      key={set.order}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-semibold text-muted-foreground">
                        Série {set.order}
                      </span>
                      <span className="font-semibold text-foreground">
                        {formatWeight(set.weight)} kg × {set.reps}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Você ainda não registrou séries deste exercício.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
