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
import { ScreenHeader } from "@/components/app/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const exerciseTypeOptions = Object.entries(exerciseTypeLabels) as [
  ExerciseType,
  string,
][];
const equipmentOptions = Object.entries(equipmentLabels) as [
  Equipment,
  string,
][];
const muscleGroupOptions = Object.entries(muscleGroupLabels) as [
  MuscleGroup,
  string,
][];

const muscleGroupToneClasses: Record<MuscleGroup, string> = {
  Arms: "[--exercise-tone:var(--exercise-arms)]",
  Back: "[--exercise-tone:var(--exercise-back)]",
  Chest: "[--exercise-tone:var(--exercise-chest)]",
  Core: "[--exercise-tone:var(--exercise-core)]",
  FullBody: "[--exercise-tone:var(--exercise-full-body)]",
  Legs: "[--exercise-tone:var(--exercise-legs)]",
  Other: "[--exercise-tone:var(--exercise-other)]",
  Shoulders: "[--exercise-tone:var(--exercise-shoulders)]",
};

const muscleGroupSurfaceClasses: Record<MuscleGroup, string> = {
  Arms:
    "border-exercise-arms/30 bg-exercise-arms/10 text-exercise-arms",
  Back:
    "border-exercise-back/30 bg-exercise-back/10 text-exercise-back",
  Chest:
    "border-exercise-chest/30 bg-exercise-chest/10 text-exercise-chest",
  Core:
    "border-exercise-core/30 bg-exercise-core/10 text-exercise-core",
  FullBody:
    "border-exercise-full-body/30 bg-exercise-full-body/10 text-exercise-full-body",
  Legs:
    "border-exercise-legs/30 bg-exercise-legs/10 text-exercise-legs",
  Other:
    "border-exercise-other/30 bg-exercise-other/10 text-exercise-other",
  Shoulders:
    "border-exercise-shoulders/30 bg-exercise-shoulders/10 text-exercise-shoulders",
};

const muscleGroupTextClasses: Record<MuscleGroup, string> = {
  Arms: "text-exercise-arms",
  Back: "text-exercise-back",
  Chest: "text-exercise-chest",
  Core: "text-exercise-core",
  FullBody: "text-exercise-full-body",
  Legs: "text-exercise-legs",
  Other: "text-exercise-other",
  Shoulders: "text-exercise-shoulders",
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
      equipment:
        equipment === allFilterValue ? undefined : (equipment as Equipment),
      exerciseType:
        exerciseType === allFilterValue
          ? undefined
          : (exerciseType as ExerciseType),
      muscleGroup:
        muscleGroup === allFilterValue
          ? undefined
          : (muscleGroup as MuscleGroup),
    }),
    [equipment, exerciseType, muscleGroup],
  );
  const {
    error,
    exercises,
    hasNext,
    hasPrevious,
    isLoading,
    page,
    perPage,
    refetch,
    setPage,
    total,
    totalPages,
  } = useExercises(activeFilters);

  const filteredExercises = React.useMemo(() => {
    if (!exercises) {
      return null;
    }

    const normalizedQuery = normalize(query);

    return exercises.filter(
      (exercise) =>
        !normalizedQuery || normalize(exercise.name).includes(normalizedQuery),
    );
  }, [exercises, query]);

  return (
    <AppScreen>
      <div className="mb-6 grid grid-cols-[1fr_auto] items-start gap-3">
        <ScreenHeader
          className="mb-0"
          title="Exercícios"
          description="Busque por nome, músculo, tipo e equipamento."
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-1 size-10 shrink-0 rounded-full"
          aria-label="Voltar"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-5" />
        </Button>
      </div>

      <section className="mb-5 grid gap-3">
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Buscar exercício"
              autoComplete="off"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="relative shrink-0"
            aria-label="Filtros avançados"
            onClick={() => setShowAdvancedFilters((isOpen) => !isOpen)}
          >
            <SlidersHorizontal className="size-4" />
            {exerciseType !== allFilterValue || equipment !== allFilterValue ? (
              <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
            ) : null}
          </Button>
        </div>

        {showAdvancedFilters ? (
          <div className="grid gap-3 rounded-lg border border-border bg-card/40 p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Filtros
              </span>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={resetFilters}
              >
                Limpar
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Select
                value={exerciseType}
                onValueChange={handleExerciseTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={allFilterValue}>Todos os tipos</SelectItem>
                  {exerciseTypeOptions.map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={equipment} onValueChange={handleEquipmentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Equipamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={allFilterValue}>
                    Todos equipamentos
                  </SelectItem>
                  {equipmentOptions.map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip
            active={muscleGroup === allFilterValue}
            onClick={() => handleMuscleGroupChange(allFilterValue)}
          >
            Todos
          </FilterChip>
          {muscleGroupOptions.map(([value, label]) => (
            <FilterChip
              key={value}
              active={muscleGroup === value}
              toneClassName={muscleGroupSurfaceClasses[value]}
              onClick={() => handleMuscleGroupChange(value)}
            >
              {label}
            </FilterChip>
          ))}
        </div>
      </section>

      {isLoading ? (
        <section className="grid gap-2">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </section>
      ) : null}

      {!isLoading && error ? (
        <ErrorState
          title="Não foi possível carregar"
          description={error}
          action={<Button onClick={refetch}>Tentar novamente</Button>}
        />
      ) : null}

      {!isLoading && !error && filteredExercises?.length === 0 ? (
        <EmptyState
          title="Nenhum exercício encontrado"
          description="Ajuste os filtros para ver outros exercícios."
          action={
            <Button variant="secondary" onClick={() => resetFilters()}>
              Limpar filtros
            </Button>
          }
        />
      ) : null}

      {!error && filteredExercises?.length ? (
        <section className="grid gap-2">
          <p className="text-xs text-muted-foreground">
            Mostrando {getVisibleRange(page, perPage, total)} de {total} · pág.{" "}
            {page} de {totalPages}
          </p>
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
          <ExercisePagination
            page={page}
            perPage={perPage}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            total={total}
            onPageChange={setPage}
          />
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

type FilterChipProps = {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  toneClassName?: string;
};

function FilterChip({
  active,
  children,
  onClick,
  toneClassName,
}: FilterChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
        active
          ? (toneClassName ?? "border-primary bg-primary text-primary-foreground")
          : "border-border bg-card/50 text-muted-foreground hover:text-foreground",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

type ExercisePaginationProps = {
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  page: number;
  perPage: number;
  total: number;
};

function ExercisePagination({
  hasNext,
  hasPrevious,
  onPageChange,
  page,
  perPage,
  total,
}: ExercisePaginationProps) {
  const startItem = total === 0 ? 0 : (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);

  return (
    <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-card/40 p-2">
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="size-10 rounded-md"
        disabled={!hasPrevious}
        aria-label="Página anterior"
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Pág. {page}</span>
        <span> · {startItem}-{endItem} de {total}</span>
      </p>

      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="size-10 rounded-md"
        disabled={!hasNext}
        aria-label="Próxima página"
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const surfaceClassName = muscleGroupSurfaceClasses[exercise.muscle_group];
  const textClassName = muscleGroupTextClasses[exercise.muscle_group];
  const toneClassName = muscleGroupToneClasses[exercise.muscle_group];

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border bg-card/35",
        toneClassName,
      )}
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-[var(--exercise-tone)]" />
      <CardContent className="grid grid-cols-[auto_1fr] items-center gap-3 p-4 pl-5">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg border",
            surfaceClassName,
          )}
        >
          {renderExerciseIcon(exercise)}
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "text-[10px] font-bold uppercase tracking-wide",
              textClassName,
            )}
          >
            {getMuscleGroupLabel(exercise.muscle_group)}
          </p>
          <h2 className="truncate text-sm font-semibold text-foreground">
            {exercise.name}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <ExerciseBadge>{getExerciseTypeLabel(exercise.exercise_type)}</ExerciseBadge>
            <ExerciseBadge>{getEquipmentLabel(exercise.equipment)}</ExerciseBadge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ExerciseBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm border border-border bg-secondary/40 px-2 py-0.5 text-[10px] text-muted-foreground">
      {children}
    </span>
  );
}

function getVisibleRange(page: number, perPage: number, total: number) {
  if (total === 0) {
    return "0-0";
  }

  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);

  return `${startItem}-${endItem}`;
}

function renderExerciseIcon(exercise: Exercise) {
  if (exercise.exercise_type === "Cardio") {
    return <Flame className="size-5" />;
  }

  if (exercise.exercise_type === "Balance") {
    return <Accessibility className="size-5" />;
  }

  if (exercise.exercise_type === "Flexibility") {
    return <Activity className="size-5" />;
  }

  return <Dumbbell className="size-5" />;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getEquipmentLabel(equipment: Equipment) {
  return equipmentLabels[equipment] ?? equipment;
}

function getExerciseTypeLabel(exerciseType: ExerciseType) {
  return exerciseTypeLabels[exerciseType] ?? exerciseType;
}

function getMuscleGroupLabel(muscleGroup: MuscleGroup) {
  return muscleGroupLabels[muscleGroup] ?? muscleGroup;
}
