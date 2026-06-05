"use client";

import {
  ArrowLeft,
  Check,
  Clock3,
  Dumbbell,
  Plus,
  SlidersHorizontal,
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
  addExerciseToWorkoutSession,
  addSetToWorkoutSession,
  finishWorkoutSession,
  getCurrentWorkoutSession,
  useActiveWorkout,
} from "@/features/workout-sessions";
import type {
  CurrentWorkoutSession,
  WorkoutSetType,
} from "@/features/workout-sessions";
import { getWorkoutTemplateById } from "@/features/workouts/api/workout-templates-api";
import { useExercises } from "@/features/workouts/hooks/use-exercises";
import type {
  Equipment,
  Exercise,
  ExerciseType,
  MuscleGroup,
} from "@/features/workouts/types";
import { ApiError, getApiErrorMessage } from "@/lib/http";
import { routes } from "@/lib/routes";

type SessionExercise = Exercise & {
  savedSets: LoggedSet[];
};

type LoggedSet = {
  id: string;
  reps: number;
  setType: WorkoutSetType;
  weight: number;
};

const setTypeLabels: Record<WorkoutSetType, string> = {
  drop: "Drop",
  failure: "Falha",
  warmup: "Aquecimento",
  working: "Trabalho",
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

export function WorkoutSessionScreen() {
  const router = useRouter();
  const [session, setSession] = React.useState<CurrentWorkoutSession | null>(
    null,
  );
  const [sessionExercises, setSessionExercises] = React.useState<
    SessionExercise[]
  >([]);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFinishing, setIsFinishing] = React.useState(false);
  const { refetchCurrentSession } = useActiveWorkout();

  const fetchSession = React.useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const currentSession = await getCurrentWorkoutSession();
      setSession(currentSession);

      if (currentSession.workout_template) {
        const template = await getWorkoutTemplateById(
          currentSession.workout_template.id,
        );
        setSessionExercises(
          template.exercises.map((exercise) => ({
            ...exercise,
            savedSets: [],
          })),
        );
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setSession(null);
        setSessionExercises([]);
        return;
      }

      setError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  async function handleAddExercise(exercise: Exercise) {
    if (!session) {
      return;
    }

    await addExerciseToWorkoutSession(session.id, {
      exercise_id: exercise.id,
    });
    setSessionExercises((currentExercises) => [
      ...currentExercises,
      { ...exercise, savedSets: [] },
    ]);
  }

  async function handleSetSaved(exerciseId: string, loggedSet: LoggedSet) {
    setSessionExercises((currentExercises) =>
      currentExercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, savedSets: [...exercise.savedSets, loggedSet] }
          : exercise,
      ),
    );
  }

  async function handleFinish() {
    if (!session) {
      return;
    }

    setIsFinishing(true);

    try {
      await finishWorkoutSession(session.id, { finished_at: null });
      toast({
        title: "Treino finalizado",
        description: session.workout_template?.name ?? "Treino avulso",
      });
      await refetchCurrentSession();
      router.push(routes.dashboard);
    } catch (error) {
      toast({
        title: "Não foi possível finalizar",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsFinishing(false);
    }
  }

  return (
    <AppScreen>
      <div className="mb-6 grid grid-cols-[1fr_auto] items-start gap-3">
        <ScreenHeader
          className="mb-0"
          title={session?.workout_template?.name ?? "Treino em andamento"}
          description={
            session
              ? `Iniciado às ${formatTime(session.started_at)}`
              : "Nenhum treino em andamento."
          }
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
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </section>
      ) : null}

      {!isLoading && error ? (
        <ErrorState
          title="Não foi possível carregar"
          description={error}
          action={<Button onClick={fetchSession}>Tentar novamente</Button>}
        />
      ) : null}

      {!isLoading && !error && !session ? (
        <EmptyState
          title="Nenhum treino em andamento"
          description="Inicie um treino pela ficha ou comece um treino avulso."
          icon={<Dumbbell className="size-6" />}
          action={
            <Button onClick={() => router.push(routes.dashboard)}>
              Voltar para o dashboard
            </Button>
          }
        />
      ) : null}

      {!isLoading && !error && session ? (
        <section className="grid gap-4">
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="grid gap-4 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="grid gap-1">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/40 px-2.5 py-0.5 text-xs font-medium text-primary">
                    <Clock3 className="size-3.5" />
                    {formatElapsed(session.started_at)}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {sessionExercises.length} exercício
                    {sessionExercises.length === 1 ? "" : "s"} ·{" "}
                    {getTotalSets(sessionExercises)} série
                    {getTotalSets(sessionExercises) === 1 ? "" : "s"}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isFinishing}
                  onClick={() => void handleFinish()}
                >
                  {isFinishing ? "Finalizando..." : "Finalizar"}
                </Button>
              </div>

              <AddSessionExerciseDialog
                existingExerciseIds={
                  new Set(sessionExercises.map((exercise) => exercise.id))
                }
                onAdd={handleAddExercise}
              >
                <Button className="h-11 rounded-lg">
                  <Plus className="size-4" />
                  Adicionar exercício
                </Button>
              </AddSessionExerciseDialog>
            </CardContent>
          </Card>

          {sessionExercises.length === 0 ? (
            <EmptyState
              title="Nenhum exercício adicionado"
              description="Adicione exercícios para registrar séries."
              icon={<Dumbbell className="size-6" />}
            />
          ) : (
            <div className="grid gap-3">
              {sessionExercises.map((exercise) => (
                <SessionExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  sessionId={session.id}
                  onSetSaved={(loggedSet) =>
                    handleSetSaved(exercise.id, loggedSet)
                  }
                />
              ))}
            </div>
          )}
        </section>
      ) : null}
    </AppScreen>
  );
}

type SessionExerciseCardProps = {
  exercise: SessionExercise;
  onSetSaved: (loggedSet: LoggedSet) => void;
  sessionId: string;
};

function SessionExerciseCard({
  exercise,
  onSetSaved,
  sessionId,
}: SessionExerciseCardProps) {
  const [setType, setSetType] = React.useState<WorkoutSetType>("working");
  const [weight, setWeight] = React.useState("");
  const [reps, setReps] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedReps = Number(reps);
    const parsedWeight = Number(weight || 0);

    if (!parsedReps || parsedReps < 1 || parsedWeight < 0) {
      toast({
        title: "Série inválida",
        description: "Informe repetições e uma carga válida.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const savedSet = await addSetToWorkoutSession(sessionId, {
        exercise_id: exercise.id,
        reps: parsedReps,
        set_type: setType,
        weight: parsedWeight,
      });
      setReps("");
      setWeight("");
      onSetSaved({
        id: savedSet.id,
        reps: savedSet.reps,
        setType: savedSet.set_type,
        weight: savedSet.weight,
      });
      toast({
        title: "Série registrada",
        description: exercise.name,
      });
    } catch (error) {
      toast({
        title: "Não foi possível registrar",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="overflow-hidden border-border bg-transparent">
      <CardContent className="grid gap-0 p-0">
        <div className="grid gap-1 border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            {exercise.name}
          </h2>
          <p className="text-xs text-muted-foreground">
            {exercise.muscle_group} · {exercise.equipment}
          </p>
        </div>

        <div className="grid px-4 py-3">
          <div className="grid grid-cols-[2.25rem_minmax(0,1fr)_minmax(0,1fr)_2.5rem] items-center gap-2 border-b border-border pb-2 text-xs font-semibold uppercase text-muted-foreground">
            <span>Set</span>
            <span>kg</span>
            <span>reps</span>
            <span className="text-center">ok</span>
          </div>

          {exercise.savedSets.map((set, index) => (
            <div
              key={set.id}
              className="grid grid-cols-[2.25rem_minmax(0,1fr)_minmax(0,1fr)_2.5rem] items-center gap-2 border-b border-border/60 py-2 text-sm"
            >
              <span className="font-semibold text-primary">
                {getSetTypeShortLabel(set.setType)}
                {index + 1}
              </span>
              <span className="text-foreground">{set.weight}</span>
              <span className="text-foreground">{set.reps}</span>
              <span className="flex justify-center text-primary">
                <Check className="size-4" />
              </span>
            </div>
          ))}

          <form
            className="grid grid-cols-[2.25rem_minmax(0,1fr)_minmax(0,1fr)_2.5rem] items-end gap-2 pt-3"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-1">
              <Label className="sr-only">Tipo</Label>
              <Select
                value={setType}
                onValueChange={(value) => setSetType(value as WorkoutSetType)}
                disabled={isSaving}
              >
                <SelectTrigger className="size-10 px-0 text-center text-xs font-bold">
                  <SelectValue>
                    {getSetTypeShortLabel(setType)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(setTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {getSetTypeShortLabel(value as WorkoutSetType)} · {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="number"
              min={0}
              step="0.5"
              inputMode="decimal"
              value={weight}
              placeholder="0"
              onChange={(event) => setWeight(event.target.value)}
              disabled={isSaving}
            />
            <Input
              type="number"
              min={1}
              inputMode="numeric"
              value={reps}
              placeholder="0"
              onChange={(event) => setReps(event.target.value)}
              disabled={isSaving}
            />
            <Button
              type="submit"
              size="icon"
              className="size-10 rounded-full"
              disabled={isSaving}
              aria-label="Registrar série"
            >
              <Check className="size-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

type AddSessionExerciseDialogProps = {
  children: React.ReactNode;
  existingExerciseIds: Set<string>;
  onAdd: (exercise: Exercise) => Promise<void>;
};

function AddSessionExerciseDialog({
  children,
  existingExerciseIds,
  onAdd,
}: AddSessionExerciseDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);
  const [exerciseType, setExerciseType] = React.useState(allFilterValue);
  const [equipment, setEquipment] = React.useState(allFilterValue);
  const [muscleGroup, setMuscleGroup] = React.useState(allFilterValue);
  const [addingExerciseId, setAddingExerciseId] = React.useState<string | null>(
    null,
  );
  const { allExercises, error, isLoading, refetch } = useExercises();
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
      await onAdd(exercise);
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Adicionar exercício</DialogTitle>
          <DialogDescription>
            Escolha um exercício para registrar nesta sessão.
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

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatElapsed(startedAt: string) {
  const elapsedMilliseconds = Math.max(
    Date.now() - new Date(startedAt).getTime(),
    0,
  );
  const elapsedMinutes = Math.floor(elapsedMilliseconds / 60000);
  const hours = Math.floor(elapsedMinutes / 60);
  const minutes = elapsedMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}min`;
  }

  return `${minutes}min`;
}

function getTotalSets(exercises: SessionExercise[]) {
  return exercises.reduce(
    (totalSets, exercise) => totalSets + exercise.savedSets.length,
    0,
  );
}

function getSetTypeShortLabel(setType: WorkoutSetType) {
  const labels: Record<WorkoutSetType, string> = {
    drop: "D",
    failure: "F",
    warmup: "A",
    working: "T",
  };

  return labels[setType];
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
