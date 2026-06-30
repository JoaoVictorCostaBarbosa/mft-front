"use client";

import {
  Accessibility,
  Activity,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AppScreen } from "@/components/app/app-screen";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useExercises } from "@/features/workouts/hooks/use-exercises";
import type {
  Equipment,
  Exercise,
  ExerciseType,
  MuscleGroup,
} from "@/features/workouts/types";
import { cn } from "@/lib/utils";

const allFilterValue = "all";

const exerciseTypeLabels: Record<ExerciseType, string> = {
  Balance: "Equilíbrio",
  Cardio: "Cardio",
  Flexibility: "Flexibilidade",
  Strength: "Força",
};

const equipmentLabels: Record<Equipment, string> = {
  Barbell: "Barra",
  Bodyweight: "Peso corporal",
  Dumbbell: "Halter",
  Kettlebell: "Kettlebell",
  Kettlerbell: "Kettlebell",
  Machine: "Máquina",
  Other: "Outro",
  ResistanceBand: "Elástico",
};

const muscleGroupLabels: Record<MuscleGroup, string> = {
  Arms: "Braços",
  Back: "Costas",
  Chest: "Peito",
  Core: "Core",
  FullBody: "Corpo todo",
  Legs: "Pernas",
  Other: "Outro",
  Shoulders: "Ombros",
};

const exerciseTypeOptions = Object.entries(exerciseTypeLabels) as [ExerciseType, string][];
const equipmentOptions = Object.entries(equipmentLabels) as [Equipment, string][];
const muscleGroupOptions = Object.entries(muscleGroupLabels) as [MuscleGroup, string][];

const muscleGroupAccentClasses: Record<MuscleGroup, string> = {
  Arms: "bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30",
  Back: "bg-[#60a5fa]/15 text-[#60a5fa] border-[#60a5fa]/30",
  Chest: "bg-[#f472b6]/15 text-[#f472b6] border-[#f472b6]/30",
  Core: "bg-[#a78bfa]/15 text-[#a78bfa] border-[#a78bfa]/30",
  FullBody: "bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30",
  Legs: "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30",
  Other: "bg-muted/40 text-muted-foreground border-border",
  Shoulders: "bg-primary/10 text-primary border-primary/30",
};

export function ExerciseLibraryScreen() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [exerciseType, setExerciseType] = React.useState(allFilterValue);
  const [equipment, setEquipment] = React.useState(allFilterValue);
  const [muscleGroup, setMuscleGroup] = React.useState(allFilterValue);
  const activeFilters = React.useMemo(
    () => ({
      equipment: equipment === allFilterValue ? undefined : (equipment as Equipment),
      exerciseType: exerciseType === allFilterValue ? undefined : (exerciseType as ExerciseType),
      muscleGroup: muscleGroup === allFilterValue ? undefined : (muscleGroup as MuscleGroup),
      query,
    }),
    [equipment, exerciseType, muscleGroup, query],
  );
  const {
    error, exercises, hasNext, hasPrevious, isLoading, page, perPage,
    refetch, setPage, total, totalPages,
  } = useExercises(activeFilters);

  return (
    <AppScreen>
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 rounded-full"
          aria-label="Voltar"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="font-display text-[1.75rem] font-bold tracking-[-0.025em] text-foreground">
          Exercícios
        </h1>
      </div>

      {/* Search + filter button */}
      <div className="mb-3 flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            placeholder="Buscar exercício"
            autoComplete="off"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="relative shrink-0 rounded-full"
          aria-label="Filtros avançados"
          onClick={() => setShowAdvancedFilters((v) => !v)}
        >
          <SlidersHorizontal className="size-4" />
          {exerciseType !== allFilterValue || equipment !== allFilterValue ? (
            <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
          ) : null}
        </Button>
      </div>

      {/* Advanced filters */}
      {showAdvancedFilters ? (
        <div className="mb-3 grid gap-3 rounded-[14px] border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Filtros
            </span>
            <Button type="button" variant="link" size="sm" onClick={resetFilters}>
              Limpar
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Select value={exerciseType} onValueChange={handleExerciseTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allFilterValue}>Todos os tipos</SelectItem>
                {exerciseTypeOptions.map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={equipment} onValueChange={handleEquipmentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Equipamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allFilterValue}>Todos equipamentos</SelectItem>
                {equipmentOptions.map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : null}

      {/* Muscle group chips */}
      <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <MuscleChip active={muscleGroup === allFilterValue} onClick={() => handleMuscleGroupChange(allFilterValue)}>
          Todos
        </MuscleChip>
        {muscleGroupOptions.map(([value, label]) => (
          <MuscleChip
            key={value}
            active={muscleGroup === value}
            activeClassName={muscleGroupAccentClasses[value]}
            onClick={() => handleMuscleGroupChange(value)}
          >
            {label}
          </MuscleChip>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-2">
          <Skeleton className="h-20 rounded-[16px]" />
          <Skeleton className="h-20 rounded-[16px]" />
          <Skeleton className="h-20 rounded-[16px]" />
          <Skeleton className="h-20 rounded-[16px]" />
        </div>
      ) : null}

      {!isLoading && error ? (
        <ErrorState
          title="Não foi possível carregar"
          description={error}
          action={<Button onClick={refetch}>Tentar novamente</Button>}
        />
      ) : null}

      {!isLoading && !error && exercises?.length === 0 ? (
        <EmptyState
          title="Nenhum exercício encontrado"
          description="Ajuste os filtros para ver outros exercícios."
          action={
            <Button variant="secondary" onClick={resetFilters}>
              Limpar filtros
            </Button>
          }
        />
      ) : null}

      {!error && exercises?.length ? (
        <section className="grid gap-2">
          <p className="text-xs text-muted-foreground">
            {getVisibleRange(page, perPage, total)} de {total} · pág. {page}/{totalPages}
          </p>
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
          <div className="mt-1 flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="size-10 rounded-full"
              disabled={!hasPrevious}
              aria-label="Página anterior"
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-semibold text-foreground">
              {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="size-10 rounded-full"
              disabled={!hasNext}
              aria-label="Próxima página"
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </section>
      ) : null}
    </AppScreen>
  );

  function resetFilters() {
    setQuery("");
    setExerciseType(allFilterValue);
    setEquipment(allFilterValue);
    setMuscleGroup(allFilterValue);
    setPage(1);
  }

  function handleMuscleGroupChange(value: string) {
    setMuscleGroup(value);
    setExerciseType(allFilterValue);
    setEquipment(allFilterValue);
    setPage(1);
  }

  function handleExerciseTypeChange(value: string) {
    setExerciseType(value);
    setMuscleGroup(allFilterValue);
    setEquipment(allFilterValue);
    setPage(1);
  }

  function handleEquipmentChange(value: string) {
    setEquipment(value);
    setMuscleGroup(allFilterValue);
    setExerciseType(allFilterValue);
    setPage(1);
  }
}

type MuscleChipProps = {
  active: boolean;
  activeClassName?: string;
  children: React.ReactNode;
  onClick: () => void;
};

function MuscleChip({ active, activeClassName, children, onClick }: MuscleChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-colors",
        active
          ? (activeClassName ?? "border-primary bg-primary text-primary-foreground")
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const accentClass = muscleGroupAccentClasses[exercise.muscle_group];

  return (
    <div className={cn("flex items-center gap-3 rounded-[16px] border p-3.5", accentClass)}>
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-[10px] border", accentClass)}>
        {renderExerciseIcon(exercise)}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{exercise.name}</p>
        <p className="text-xs text-muted-foreground">
          {muscleGroupLabels[exercise.muscle_group]} · {exerciseTypeLabels[exercise.exercise_type]} · {equipmentLabels[exercise.equipment] ?? exercise.equipment}
        </p>
      </div>
    </div>
  );
}

function getVisibleRange(page: number, perPage: number, total: number) {
  if (total === 0) return "0–0";
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);
  return `${start}–${end}`;
}

function renderExerciseIcon(exercise: Exercise) {
  if (exercise.exercise_type === "Cardio") return <Flame className="size-4" />;
  if (exercise.exercise_type === "Balance") return <Accessibility className="size-4" />;
  if (exercise.exercise_type === "Flexibility") return <Activity className="size-4" />;
  return <Dumbbell className="size-4" />;
}
