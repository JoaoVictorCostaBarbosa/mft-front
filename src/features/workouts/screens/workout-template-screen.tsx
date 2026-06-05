"use client";

import {
  ArrowLeft,
  Dumbbell,
  Play,
  Plus,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AppScreen } from "@/components/app/app-screen";
import { ScreenHeader } from "@/components/app/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import {
  createWorkoutSession,
  useActiveWorkout,
} from "@/features/workout-sessions";
import { useExercises } from "@/features/workouts/hooks/use-exercises";
import { useWorkoutTemplate } from "@/features/workouts/hooks/use-workout-template";
import type {
  Equipment,
  Exercise,
  ExerciseType,
  MuscleGroup,
} from "@/features/workouts/types";
import { getApiErrorMessage } from "@/lib/http";
import { routes } from "@/lib/routes";

type WorkoutTemplateScreenProps = {
  planId?: string;
  templateId: string;
};

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

export function WorkoutTemplateScreen({
  planId,
  templateId,
}: WorkoutTemplateScreenProps) {
  const router = useRouter();
  const {
    addExercise,
    error,
    isLoading,
    isMutating,
    refetch,
    removeExercise,
    template,
  } = useWorkoutTemplate(templateId);
  const { refetchCurrentSession } = useActiveWorkout();
  const [isStarting, setIsStarting] = React.useState(false);

  async function handleStartWorkout() {
    if (!template || template.exercises.length === 0) {
      toast({
        title: "Adicione exercícios",
        description: "Este treino precisa ter exercícios antes de iniciar.",
        variant: "destructive",
      });
      return;
    }

    setIsStarting(true);

    try {
      await createWorkoutSession({
        workout_plan_id: planId ?? null,
        workout_template_id: template.id,
      });
      toast({
        title: "Treino iniciado",
        description: template.name,
      });
      await refetchCurrentSession();
      router.push(routes.workoutSession);
    } catch (error) {
      toast({
        title: "Não foi possível iniciar",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <AppScreen>
      <div className="mb-6 grid grid-cols-[1fr_auto] items-start gap-3">
        <ScreenHeader
          className="mb-0"
          title={template?.name ?? "Treino"}
          description="Monte a ficha antes de iniciar a execução."
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

      {isLoading ? (
        <section className="grid gap-3">
          <Skeleton className="h-24" />
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

      {!isLoading && !error && template ? (
        <section className="grid gap-5">
          <Card className="border-border bg-transparent">
            <CardContent className="grid gap-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Exercícios da ficha
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {template.exercises.length} exercício
                    {template.exercises.length === 1 ? "" : "s"}
                  </p>
                </div>
                <AddTemplateExerciseDialog
                  disabled={isMutating}
                  existingExerciseIds={new Set(template.exercises.map((item) => item.id))}
                  onAdd={addExercise}
                >
                  <Button variant="secondary" size="sm">
                    <Plus className="size-4" />
                    Adicionar
                  </Button>
                </AddTemplateExerciseDialog>
              </div>

              <Button
                className="h-12 rounded-lg text-base"
                disabled={isStarting || template.exercises.length === 0}
                onClick={() => void handleStartWorkout()}
              >
                <Play className="size-4" />
                {isStarting ? "Iniciando..." : "Iniciar treino"}
              </Button>
            </CardContent>
          </Card>

          {template.exercises.length === 0 ? (
            <EmptyState
              title="Nenhum exercício na ficha"
              description="Adicione exercícios antes de iniciar este treino."
              icon={<Dumbbell className="size-6" />}
            />
          ) : (
            <div className="grid gap-2">
              {template.exercises.map((exercise) => (
                <Card key={exercise.id} className="border-border bg-transparent">
                  <CardContent className="grid grid-cols-[1fr_auto] items-center gap-3 p-4">
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-semibold text-foreground">
                        {exercise.name}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {exercise.muscle_group} · {exercise.equipment}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-10 rounded-full text-destructive"
                      disabled={isMutating}
                      aria-label={`Remover ${exercise.name}`}
                      onClick={() => void removeExercise(exercise.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </AppScreen>
  );
}

type AddTemplateExerciseDialogProps = {
  children: React.ReactNode;
  disabled?: boolean;
  existingExerciseIds: Set<string>;
  onAdd: (exerciseId: string) => Promise<void>;
};

function AddTemplateExerciseDialog({
  children,
  disabled = false,
  existingExerciseIds,
  onAdd,
}: AddTemplateExerciseDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);
  const [exerciseType, setExerciseType] = React.useState(allFilterValue);
  const [equipment, setEquipment] = React.useState(allFilterValue);
  const [muscleGroup, setMuscleGroup] = React.useState(allFilterValue);
  const [addingExerciseId, setAddingExerciseId] = React.useState<string | null>(
    null,
  );
  const { allExercises, isLoading, error, refetch } = useExercises();
  const visibleExercises = React.useMemo(() => {
    const normalizedQuery = normalize(query);

    return (
      allExercises?.filter(
        (exercise) =>
          !existingExerciseIds.has(exercise.id) &&
          (!normalizedQuery ||
            normalize(exercise.name).includes(normalizedQuery)) &&
          (exerciseType === allFilterValue ||
            exercise.exercise_type === exerciseType) &&
          (equipment === allFilterValue || exercise.equipment === equipment) &&
          (muscleGroup === allFilterValue ||
            exercise.muscle_group === muscleGroup),
      ) ?? []
    );
  }, [allExercises, equipment, exerciseType, existingExerciseIds, muscleGroup, query]);

  async function handleAdd(exercise: Exercise) {
    setAddingExerciseId(exercise.id);

    try {
      await onAdd(exercise.id);
      toast({
        title: "Exercício adicionado",
        description: exercise.name,
      });
      setOpen(false);
      setQuery("");
    } catch (error) {
      toast({
        title: "Não foi possível adicionar",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setAddingExerciseId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Adicionar exercício</DialogTitle>
          <DialogDescription>
            Escolha um exercício para compor esta ficha.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 overflow-hidden">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar exercício"
              autoComplete="off"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="shrink-0"
              aria-label="Filtros"
              aria-expanded={showFilters}
              onClick={() => setShowFilters((isVisible) => !isVisible)}
            >
              <SlidersHorizontal className="size-4" />
            </Button>
          </div>

          {showFilters ? (
            <div className="grid gap-2 rounded-md border border-border p-3">
              <Label>Filtros</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Select value={muscleGroup} onValueChange={setMuscleGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Músculo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={allFilterValue}>Todos músculos</SelectItem>
                  {muscleGroupOptions.map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={exerciseType} onValueChange={setExerciseType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={allFilterValue}>Todos tipos</SelectItem>
                  {exerciseTypeOptions.map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={equipment} onValueChange={setEquipment}>
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

          <div className="grid max-h-[55vh] gap-2 overflow-y-auto pr-1">
            {isLoading ? (
              <>
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </>
            ) : null}

            {!isLoading && error ? (
              <ErrorState
                title="Não foi possível carregar"
                description={error}
                action={<Button onClick={refetch}>Tentar novamente</Button>}
              />
            ) : null}

            {!isLoading && !error && visibleExercises.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum exercício disponível.
              </p>
            ) : null}

            {visibleExercises.map((exercise) => (
              <button
                key={exercise.id}
                type="button"
                className="grid rounded-md border border-border p-3 text-left transition-colors hover:bg-secondary"
                disabled={Boolean(addingExerciseId)}
                onClick={() => void handleAdd(exercise)}
              >
                <span className="text-sm font-semibold text-foreground">
                  {exercise.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {exercise.muscle_group} · {exercise.equipment}
                </span>
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
