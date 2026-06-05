"use client";

import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Check,
  Clock3,
  Dumbbell,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  SlidersHorizontal,
  Trash2,
  X,
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
  cancelWorkoutSession,
  deleteWorkoutSessionSet,
  finishWorkoutSession,
  getCurrentWorkoutSession,
  removeExerciseFromWorkoutSession,
  reorderWorkoutSessionExercises,
  updateWorkoutSessionSet,
  useActiveWorkout,
} from "@/features/workout-sessions";
import type {
  CurrentWorkoutSession,
  CurrentWorkoutSessionExercise,
  WorkoutSessionSet,
  WorkoutSetType,
} from "@/features/workout-sessions";
import {
  clearActiveWorkoutSession,
  readActiveWorkoutSession,
  writeActiveWorkoutSession,
} from "@/features/workout-sessions/lib/workout-session-storage";
import type {
  LocalSyncStatus,
  LocalWorkoutExercise,
  LocalWorkoutSet,
  PendingWorkoutOperation,
} from "@/features/workout-sessions/lib/workout-session-storage";
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
import { cn } from "@/lib/utils";

type SessionExercise = Exercise & {
  clientOperationId?: string | null;
  order: number;
  savedSets: LoggedSet[];
  sessionExerciseId: string;
  syncStatus: LocalSyncStatus;
};

type LoggedSet = {
  clientOperationId: string;
  completedAt: string;
  id: string;
  reps: number;
  serverId?: string;
  setType: WorkoutSetType;
  syncStatus: LocalSyncStatus;
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
const setRowGridClassName =
  "grid-cols-[2.25rem_minmax(0,1fr)_minmax(0,1fr)_4.5rem]";

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
  const [isCancelOpen, setIsCancelOpen] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [isFinishing, setIsFinishing] = React.useState(false);
  const [isSessionMenuOpen, setIsSessionMenuOpen] = React.useState(false);
  const [pendingOperations, setPendingOperations] = React.useState<
    PendingWorkoutOperation[]
  >([]);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const { refetchCurrentSession } = useActiveWorkout();
  const syncLockRef = React.useRef(false);

  const persistWorkoutSession = React.useCallback(
    (
      nextSession: CurrentWorkoutSession | null,
      nextExercises: SessionExercise[],
      nextPendingOperations: PendingWorkoutOperation[],
    ) => {
      if (!nextSession) {
        clearActiveWorkoutSession();
        return;
      }

      writeActiveWorkoutSession({
        exercises: nextExercises.map(toLocalWorkoutExercise),
        pendingOperations: nextPendingOperations,
        session: nextSession,
      });
    },
    [],
  );

  const syncWorkoutQueue = React.useCallback(async () => {
    if (!session || syncLockRef.current) {
      return;
    }

    syncLockRef.current = true;
    setIsSyncing(true);

    let nextExercises = sessionExercises;
    let nextPendingOperations = pendingOperations;

    try {
      for (const operation of pendingOperations) {
        nextPendingOperations = markOperationStatus(
          nextPendingOperations,
          operation.id,
          "syncing",
        );
        setPendingOperations(nextPendingOperations);
        persistWorkoutSession(session, nextExercises, nextPendingOperations);

        if (operation.type === "ADD_EXERCISE") {
          const sessionExercise = await addExerciseToWorkoutSession(session.id, {
            client_operation_id: operation.clientOperationId,
            exercise_id: operation.exerciseId,
          });
          nextExercises = nextExercises.map((exercise) =>
            exercise.sessionExerciseId === operation.localExerciseId
              ? {
                  ...exercise,
                  clientOperationId: sessionExercise.client_operation_id,
                  order: sessionExercise.order ?? exercise.order,
                  sessionExerciseId: sessionExercise.id,
                  syncStatus: "synced",
                }
              : exercise,
          );
        }

        if (operation.type === "ADD_SET") {
          const savedSet = await addSetToWorkoutSession(session.id, {
            client_operation_id: operation.clientOperationId,
            completed_at: operation.payload.completedAt,
            exercise_id: operation.exerciseId,
            reps: operation.payload.reps,
            set_type: operation.payload.setType,
            weight: operation.payload.weight,
          });
          nextExercises = nextExercises.map((exercise) => ({
            ...exercise,
            savedSets: exercise.savedSets.map((set) =>
              set.id === operation.localSetId
                ? mapWorkoutSet(savedSet, operation.localSetId)
                : set,
            ),
          }));
          nextPendingOperations = nextPendingOperations.map((pendingOperation) =>
            pendingOperation.type !== "UPDATE_SET" &&
            pendingOperation.type !== "DELETE_SET"
              ? pendingOperation
              : pendingOperation.localSetId === operation.localSetId
                ? { ...pendingOperation, serverSetId: savedSet.id }
                : pendingOperation,
          );
        }

        if (operation.type === "UPDATE_SET") {
          const serverSetId = operation.serverSetId ?? findServerSetId(
            nextExercises,
            operation.localSetId,
          );

          if (!serverSetId) {
            throw new Error("Série ainda não sincronizada.");
          }

          const updatedSet = await updateWorkoutSessionSet(
            session.id,
            serverSetId,
            {
              reps: operation.payload.reps,
              set_type: operation.payload.setType,
              weight: operation.payload.weight,
            },
          );
          nextExercises = nextExercises.map((exercise) => ({
            ...exercise,
            savedSets: exercise.savedSets.map((set) =>
              set.id === operation.localSetId || set.serverId === serverSetId
                ? mapWorkoutSet(updatedSet, operation.localSetId)
                : set,
            ),
          }));
        }

        if (operation.type === "DELETE_SET") {
          const serverSetId = operation.serverSetId ?? findServerSetId(
            nextExercises,
            operation.localSetId,
          );

          if (serverSetId) {
            await deleteWorkoutSessionSet(session.id, serverSetId);
          }

          nextExercises = nextExercises.map((exercise) => ({
            ...exercise,
            savedSets: exercise.savedSets.filter(
              (set) => set.id !== operation.localSetId,
            ),
          }));
        }

        nextPendingOperations = nextPendingOperations.filter(
          (pendingOperation) => pendingOperation.id !== operation.id,
        );
        setSessionExercises(nextExercises);
        setPendingOperations(nextPendingOperations);
        persistWorkoutSession(session, nextExercises, nextPendingOperations);
      }
    } catch {
      nextPendingOperations = markOperationStatus(
        nextPendingOperations,
        nextPendingOperations.find((operation) => operation.status === "syncing")
          ?.id,
        "failed",
      );
      setPendingOperations(nextPendingOperations);
      persistWorkoutSession(session, nextExercises, nextPendingOperations);
    } finally {
      syncLockRef.current = false;
      setIsSyncing(false);
    }
  }, [
    pendingOperations,
    persistWorkoutSession,
    session,
    sessionExercises,
  ]);

  const fetchSession = React.useCallback(async () => {
    const localWorkoutSession = readActiveWorkoutSession();

    if (localWorkoutSession) {
      setSession(localWorkoutSession.session);
      setSessionExercises(
        localWorkoutSession.exercises.map(fromLocalWorkoutExercise),
      );
      setPendingOperations(localWorkoutSession.pendingOperations);
    }

    setIsLoading(true);
    setError("");

    try {
      let currentSession = await getCurrentWorkoutSession();

      if (
        currentSession.workout_template &&
        currentSession.exercises.length === 0
      ) {
        const template = await getWorkoutTemplateById(
          currentSession.workout_template.id,
        );

        for (const exercise of template.exercises) {
          await addExerciseToWorkoutSession(currentSession.id, {
            client_operation_id: crypto.randomUUID(),
            exercise_id: exercise.id,
          });
        }

        currentSession = await getCurrentWorkoutSession();
      }

      const serverExercises = mergeServerSessionExercises(
        currentSession.exercises,
        localWorkoutSession?.exercises.map(fromLocalWorkoutExercise) ?? [],
        localWorkoutSession?.pendingOperations ?? [],
      );
      const nextPendingOperations =
        localWorkoutSession?.session.id === currentSession.id
          ? localWorkoutSession.pendingOperations
          : [];

      setSession(currentSession);
      setSessionExercises(serverExercises);
      setPendingOperations(nextPendingOperations);
      persistWorkoutSession(currentSession, serverExercises, nextPendingOperations);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setSession(null);
        setSessionExercises([]);
        setPendingOperations([]);
        clearActiveWorkoutSession();
        return;
      }

      if (!localWorkoutSession) {
        setError(getApiErrorMessage(error));
      }
    } finally {
      setIsLoading(false);
    }
  }, [persistWorkoutSession]);

  React.useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  React.useEffect(() => {
    if (pendingOperations.length > 0) {
      void syncWorkoutQueue();
    }
  }, [pendingOperations.length, syncWorkoutQueue]);

  React.useEffect(() => {
    function handleOnline() {
      void syncWorkoutQueue();
    }

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [syncWorkoutQueue]);

  async function handleAddExercise(exercise: Exercise) {
    if (!session) {
      return;
    }

    const clientOperationId = crypto.randomUUID();
    const localExerciseId = `local-exercise-${clientOperationId}`;
    const operation = createPendingOperation({
      clientOperationId,
      exerciseId: exercise.id,
      localExerciseId,
      type: "ADD_EXERCISE",
    });
    const nextExercises = [
      ...sessionExercises,
      {
        clientOperationId,
        ...exercise,
        order: sessionExercises.length + 1,
        savedSets: [],
        sessionExerciseId: localExerciseId,
        syncStatus: "pending" as const,
      },
    ];
    const nextPendingOperations = [...pendingOperations, operation];

    setSessionExercises(nextExercises);
    setPendingOperations(nextPendingOperations);
    persistWorkoutSession(session, nextExercises, nextPendingOperations);
  }

  function handleSetCreated(
    exerciseId: string,
    payload: {
      reps: number;
      setType: WorkoutSetType;
      weight: number;
    },
  ) {
    if (!session) {
      return;
    }

    const clientOperationId = crypto.randomUUID();
    const completedAt = new Date().toISOString();
    const localSetId = `local-set-${clientOperationId}`;
    const loggedSet: LoggedSet = {
      clientOperationId,
      completedAt,
      id: localSetId,
      reps: payload.reps,
      setType: payload.setType,
      syncStatus: "pending",
      weight: payload.weight,
    };
    const operation = createPendingOperation({
      clientOperationId,
      exerciseId,
      localSetId,
      payload: {
        completedAt,
        reps: payload.reps,
        setType: payload.setType,
        weight: payload.weight,
      },
      type: "ADD_SET",
    });
    const nextExercises = sessionExercises.map((exercise) =>
      exercise.id === exerciseId
        ? { ...exercise, savedSets: [...exercise.savedSets, loggedSet] }
        : exercise,
    );
    const nextPendingOperations = [...pendingOperations, operation];

    setSessionExercises(nextExercises);
    setPendingOperations(nextPendingOperations);
    persistWorkoutSession(session, nextExercises, nextPendingOperations);
  }

  function handleSetUpdated(
    exerciseId: string,
    set: LoggedSet,
    payload: {
      reps: number;
      setType: WorkoutSetType;
      weight: number;
    },
  ) {
    if (!session) {
      return;
    }

    const updatedSet: LoggedSet = {
      ...set,
      reps: payload.reps,
      setType: payload.setType,
      syncStatus: set.syncStatus === "synced" ? "pending" : set.syncStatus,
      weight: payload.weight,
    };
    const operation = createPendingOperation({
      localSetId: set.id,
      payload: {
        reps: payload.reps,
        setType: payload.setType,
        weight: payload.weight,
      },
      serverSetId: set.serverId,
      type: "UPDATE_SET",
    });
    const nextExercises = sessionExercises.map((exercise) =>
      exercise.id === exerciseId
        ? {
            ...exercise,
            savedSets: exercise.savedSets.map((currentSet) =>
              currentSet.id === set.id ? updatedSet : currentSet,
            ),
          }
        : exercise,
    );
    const nextPendingOperations = [...pendingOperations, operation];

    setSessionExercises(nextExercises);
    setPendingOperations(nextPendingOperations);
    persistWorkoutSession(session, nextExercises, nextPendingOperations);
  }

  function handleSetDeleted(exerciseId: string, set: LoggedSet) {
    if (!session) {
      return;
    }

    const relatedPendingAdd = pendingOperations.find(
      (operation) =>
        operation.type === "ADD_SET" && operation.localSetId === set.id,
    );
    const nextExercises = sessionExercises.map((exercise) =>
      exercise.id === exerciseId
        ? {
            ...exercise,
            savedSets: exercise.savedSets.filter(
              (currentSet) => currentSet.id !== set.id,
            ),
          }
        : exercise,
    );
    const nextPendingOperations = relatedPendingAdd
      ? pendingOperations.filter(
          (operation) =>
            !(
              "localSetId" in operation &&
              operation.localSetId === set.id
            ),
        )
      : [
          ...pendingOperations,
          createPendingOperation({
            localSetId: set.id,
            serverSetId: set.serverId,
            type: "DELETE_SET",
          }),
        ];

    setSessionExercises(nextExercises);
    setPendingOperations(nextPendingOperations);
    persistWorkoutSession(session, nextExercises, nextPendingOperations);
  }

  async function handleRemoveExercise(sessionExerciseId: string) {
    if (!session) {
      return;
    }

    const exerciseToRemove = sessionExercises.find(
      (exercise) => exercise.sessionExerciseId === sessionExerciseId,
    );

    if (!exerciseToRemove) {
      return;
    }

    if (exerciseToRemove.syncStatus !== "synced") {
      const nextExercises = sessionExercises.filter(
        (exercise) => exercise.sessionExerciseId !== sessionExerciseId,
      );
      const localSetIds = new Set(
        exerciseToRemove.savedSets.map((set) => set.id),
      );
      const nextPendingOperations = pendingOperations.filter((operation) => {
        if (
          operation.type === "ADD_EXERCISE" &&
          operation.localExerciseId === sessionExerciseId
        ) {
          return false;
        }

        if ("localSetId" in operation && localSetIds.has(operation.localSetId)) {
          return false;
        }

        return true;
      });

      setSessionExercises(nextExercises);
      setPendingOperations(nextPendingOperations);
      persistWorkoutSession(session, nextExercises, nextPendingOperations);
      return;
    }

    await removeExerciseFromWorkoutSession(session.id, sessionExerciseId);
    const nextExercises = sessionExercises.filter(
      (exercise) => exercise.sessionExerciseId !== sessionExerciseId,
    );
    setSessionExercises(nextExercises);
    persistWorkoutSession(session, nextExercises, pendingOperations);
    await fetchSession();
  }

  async function handleMoveExercise(sessionExerciseId: string, direction: -1 | 1) {
    if (!session) {
      return;
    }

    const currentIndex = sessionExercises.findIndex(
      (exercise) => exercise.sessionExerciseId === sessionExerciseId,
    );
    const targetIndex = currentIndex + direction;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= sessionExercises.length) {
      return;
    }

    const nextExercises = [...sessionExercises];
    const [movedExercise] = nextExercises.splice(currentIndex, 1);
    nextExercises.splice(targetIndex, 0, movedExercise);

    const reorderedExercises = nextExercises.map((exercise, index) => ({
      ...exercise,
      order: index + 1,
    }));

    setSessionExercises(reorderedExercises);
    persistWorkoutSession(session, reorderedExercises, pendingOperations);

    try {
      await reorderWorkoutSessionExercises(session.id, {
        ordered_session_exercise_ids: reorderedExercises.map(
          (exercise) => exercise.sessionExerciseId,
        ),
      });
    } catch (error) {
      setSessionExercises(sessionExercises);
      persistWorkoutSession(session, sessionExercises, pendingOperations);
      toast({
        title: "Não foi possível reordenar",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
    }
  }

  async function handleFinish() {
    if (!session) {
      return;
    }

    if (pendingOperations.length > 0) {
      await syncWorkoutQueue();

      if (pendingOperations.length > 0) {
        toast({
          title: "Sincronização pendente",
          description:
            "Existem séries pendentes. Conecte-se à internet para sincronizar antes de finalizar.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsFinishing(true);

    try {
      await finishWorkoutSession(session.id, { finished_at: null });
      toast({
        title: "Treino finalizado",
        description: session.workout_template?.name ?? "Treino avulso",
      });
      clearActiveWorkoutSession();
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

  async function handleCancel() {
    if (!session) {
      return;
    }

    setIsCancelling(true);

    try {
      await cancelWorkoutSession(session.id);
      toast({
        title: "Treino cancelado",
        description: session.workout_template?.name ?? "Treino avulso",
      });
      setIsCancelOpen(false);
      setSession(null);
      setSessionExercises([]);
      setPendingOperations([]);
      clearActiveWorkoutSession();
      await refetchCurrentSession();
      router.push(routes.dashboard);
    } catch (error) {
      toast({
        title: "Não foi possível cancelar",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
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
              {pendingOperations.length > 0 ? (
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-3 py-2 text-xs",
                    isSyncing
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-destructive/30 bg-destructive/10 text-destructive",
                  )}
                >
                  {isSyncing ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : null}
                  {isSyncing
                    ? "Sincronizando alterações..."
                    : "Alterações pendentes de sincronização"}
                </div>
              ) : null}
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
                <div className="flex items-center gap-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isFinishing || pendingOperations.length > 0}
                    onClick={() => void handleFinish()}
                  >
                    {isFinishing ? "Finalizando..." : "Finalizar"}
                  </Button>
                  <div className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-9 rounded-full"
                      aria-label="Ações do treino"
                      aria-expanded={isSessionMenuOpen}
                      disabled={isFinishing || isCancelling}
                      onClick={() =>
                        setIsSessionMenuOpen((current) => !current)
                      }
                    >
                      <MoreVertical className="size-5" />
                    </Button>
                    {isSessionMenuOpen ? (
                      <div className="absolute right-0 top-10 z-20 grid min-w-44 gap-1 rounded-md border border-border bg-background/95 p-1">
                        <button
                          type="button"
                          className="flex items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                          onClick={() => {
                            setIsSessionMenuOpen(false);
                            setIsCancelOpen(true);
                          }}
                        >
                          <Trash2 className="size-4" />
                          Cancelar treino
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
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
              {sessionExercises.map((exercise, index) => (
                <SessionExerciseCard
                  key={exercise.id}
                  canMoveDown={index < sessionExercises.length - 1}
                  canMoveUp={index > 0}
                  exercise={exercise}
                  onMove={(direction) =>
                    void handleMoveExercise(exercise.sessionExerciseId, direction)
                  }
                  onRemove={() =>
                    void handleRemoveExercise(exercise.sessionExerciseId)
                  }
                  onSetCreate={(payload) =>
                    handleSetCreated(exercise.id, payload)
                  }
                  onSetDelete={(set) => handleSetDeleted(exercise.id, set)}
                  onSetUpdate={(set, payload) =>
                    handleSetUpdated(exercise.id, set, payload)
                  }
                />
              ))}
            </div>
          )}
        </section>
      ) : null}

      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar treino?</DialogTitle>
            <DialogDescription>
              As séries registradas neste treino serão descartadas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              disabled={isCancelling}
              onClick={() => setIsCancelOpen(false)}
            >
              Voltar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isCancelling}
              onClick={() => void handleCancel()}
            >
              {isCancelling ? "Cancelando..." : "Cancelar treino"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppScreen>
  );
}

type SessionExerciseCardProps = {
  canMoveDown: boolean;
  canMoveUp: boolean;
  exercise: SessionExercise;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  onSetCreate: (payload: {
    reps: number;
    setType: WorkoutSetType;
    weight: number;
  }) => void;
  onSetDelete: (set: LoggedSet) => void;
  onSetUpdate: (
    set: LoggedSet,
    payload: {
      reps: number;
      setType: WorkoutSetType;
      weight: number;
    },
  ) => void;
};

function SessionExerciseCard({
  canMoveDown,
  canMoveUp,
  exercise,
  onMove,
  onRemove,
  onSetCreate,
  onSetDelete,
  onSetUpdate,
}: SessionExerciseCardProps) {
  const [setType, setSetType] = React.useState<WorkoutSetType>("working");
  const [weight, setWeight] = React.useState("");
  const [reps, setReps] = React.useState("");
  const [isAddingSet, setIsAddingSet] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isRemovingExercise, setIsRemovingExercise] = React.useState(false);

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

    onSetCreate({
      reps: parsedReps,
      setType,
      weight: parsedWeight,
    });
    setReps("");
    setWeight("");
    setIsAddingSet(false);
    setIsSaving(false);
  }

  async function handleRemoveExerciseConfirm() {
    setIsRemovingExercise(true);

    try {
      await onRemove();
      toast({
        title: "Exercício removido",
        description: exercise.name,
      });
      setIsRemoveOpen(false);
    } catch (error) {
      toast({
        title: "Não foi possível remover",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsRemovingExercise(false);
    }
  }

  return (
    <>
    <Card className="overflow-visible border-border bg-transparent">
      <CardContent className="grid gap-0 p-0">
        <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-border px-4 py-3">
          <div className="grid gap-1">
            <h2 className="text-base font-semibold text-foreground">
              {exercise.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              {exercise.muscle_group} · {exercise.equipment}
            </p>
          </div>
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 rounded-full"
              aria-label={`Ações de ${exercise.name}`}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              <MoreVertical className="size-5" />
            </Button>
            {isMenuOpen ? (
              <div className="absolute right-0 top-10 z-20 grid min-w-44 gap-1 rounded-md border border-border bg-background/95 p-1">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!canMoveUp}
                  onClick={() => {
                    setIsMenuOpen(false);
                    onMove(-1);
                  }}
                >
                  <ArrowUp className="size-4" />
                  Subir
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!canMoveDown}
                  onClick={() => {
                    setIsMenuOpen(false);
                    onMove(1);
                  }}
                >
                  <ArrowDown className="size-4" />
                  Descer
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsRemoveOpen(true);
                  }}
                >
                  <Trash2 className="size-4" />
                  Remover
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid px-4 py-3">
          <div
            className={cn(
              "grid items-center gap-2 border-b border-border pb-2 text-xs font-semibold uppercase text-muted-foreground",
              setRowGridClassName,
            )}
          >
            <span>Set</span>
            <span>kg</span>
            <span>reps</span>
            <span className="text-right">ações</span>
          </div>

          {exercise.savedSets.map((set, index) => (
            <SavedSetRow
              key={set.id}
              index={index}
              set={set}
              onDeleted={() => onSetDelete(set)}
              onUpdated={(payload) => onSetUpdate(set, payload)}
            />
          ))}

          {isAddingSet ? (
            <form
              className={cn("grid items-end gap-2 pt-3", setRowGridClassName)}
              onSubmit={handleSubmit}
            >
              <SetTypeInlineSelect
                disabled={isSaving}
                value={setType}
                onValueChange={setSetType}
              />
              <SetInlineInput
                type="number"
                min={0}
                step="0.5"
                inputMode="decimal"
                value={weight}
                placeholder="0"
                onChange={(event) => setWeight(event.target.value)}
                disabled={isSaving}
                aria-label="Peso"
              />
              <SetInlineInput
                type="number"
                min={1}
                inputMode="numeric"
                value={reps}
                placeholder="0"
                onChange={(event) => setReps(event.target.value)}
                disabled={isSaving}
                aria-label="Repetições"
              />
              <span className="flex justify-end gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-10 rounded-full"
                  disabled={isSaving}
                  aria-label="Cancelar nova série"
                  onClick={() => {
                    setIsAddingSet(false);
                    setReps("");
                    setWeight("");
                  }}
                >
                  <X className="size-4" />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  className="size-10 rounded-full"
                  disabled={isSaving}
                  aria-label="Registrar série"
                >
                  <Check className="size-4" />
                </Button>
              </span>
            </form>
          ) : (
            <Button
              type="button"
              variant="secondary"
              className="mt-3 h-10 justify-center rounded-lg"
              onClick={() => setIsAddingSet(true)}
            >
              <Plus className="size-4" />
              Adicionar série
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
    <Dialog open={isRemoveOpen} onOpenChange={setIsRemoveOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover exercício?</DialogTitle>
          <DialogDescription>
            As séries deste exercício também serão removidas da sessão.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            disabled={isRemovingExercise}
            onClick={() => setIsRemoveOpen(false)}
          >
            Voltar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isRemovingExercise}
            onClick={() => void handleRemoveExerciseConfirm()}
          >
            {isRemovingExercise ? "Removendo..." : "Remover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

type SavedSetRowProps = {
  index: number;
  onDeleted: () => void;
  onUpdated: (payload: {
    reps: number;
    setType: WorkoutSetType;
    weight: number;
  }) => void;
  set: LoggedSet;
};

function SavedSetRow({
  index,
  onDeleted,
  onUpdated,
  set,
}: SavedSetRowProps) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [setType, setSetType] = React.useState<WorkoutSetType>(set.setType);
  const [weight, setWeight] = React.useState(String(set.weight));
  const [reps, setReps] = React.useState(String(set.reps));
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!isEditOpen) {
      return;
    }

    setSetType(set.setType);
    setWeight(String(set.weight));
    setReps(String(set.reps));
  }, [isEditOpen, set.reps, set.setType, set.weight]);

  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
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

    setIsSubmitting(true);
    onUpdated({
      reps: parsedReps,
      setType,
      weight: parsedWeight,
    });
    setIsEditOpen(false);
    setIsSubmitting(false);
  }

  function handleDeleteConfirm() {
    setIsSubmitting(true);
    onDeleted();
    setIsDeleteOpen(false);
    setIsSubmitting(false);
  }

  return (
    <>
      {isEditOpen ? (
        <form
          className={cn(
            "grid items-end gap-2 border-b border-border/60 py-2",
            setRowGridClassName,
          )}
          onSubmit={handleEditSubmit}
        >
          <SetTypeInlineSelect
            disabled={isSubmitting}
            value={setType}
            onValueChange={setSetType}
          />
          <SetInlineInput
            type="number"
            min={0}
            step="0.5"
            inputMode="decimal"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            disabled={isSubmitting}
            aria-label="Peso"
          />
          <SetInlineInput
            type="number"
            min={1}
            inputMode="numeric"
            value={reps}
            onChange={(event) => setReps(event.target.value)}
            disabled={isSubmitting}
            aria-label="Repetições"
          />
          <span className="flex justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-10 rounded-full"
              disabled={isSubmitting}
              aria-label="Cancelar edição"
              onClick={() => setIsEditOpen(false)}
            >
              <X className="size-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="size-10 rounded-full"
              disabled={isSubmitting}
              aria-label="Salvar série"
            >
              <Check className="size-4" />
            </Button>
          </span>
        </form>
      ) : (
        <div
          className={cn(
            "grid items-center gap-2 border-b border-border/60 py-2 text-sm",
            setRowGridClassName,
          )}
        >
          <span className="font-semibold text-primary">
            {getSetTypeShortLabel(set.setType)}
            {index + 1}
          </span>
          <span className="text-foreground">{set.weight}</span>
          <span className="text-foreground">{set.reps}</span>
          <span className="flex justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full"
              aria-label="Editar série"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-destructive hover:bg-destructive/10"
              aria-label="Remover série"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </span>
        </div>
      )}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover série?</DialogTitle>
            <DialogDescription>
              Esta ação remove a série registrada deste treino.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => setIsDeleteOpen(false)}
            >
              Voltar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isSubmitting}
              onClick={() => void handleDeleteConfirm()}
            >
              {isSubmitting ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

type AddSessionExerciseDialogProps = {
  children: React.ReactNode;
  existingExerciseIds: Set<string>;
  onAdd: (exercise: Exercise) => Promise<void>;
};

type SetTypeInlineSelectProps = {
  disabled?: boolean;
  onValueChange: (value: WorkoutSetType) => void;
  value: WorkoutSetType;
};

function SetInlineInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "h-10 w-full rounded-none border-x-0 border-b border-t-0 border-border bg-transparent px-0 text-center shadow-none focus-visible:ring-0",
        className,
      )}
      {...props}
    />
  );
}

function SetTypeInlineSelect({
  disabled = false,
  onValueChange,
  value,
}: SetTypeInlineSelectProps) {
  return (
    <div className="grid w-full gap-1">
      <Label className="sr-only">Tipo</Label>
      <Select
        value={value}
        onValueChange={(nextValue) => onValueChange(nextValue as WorkoutSetType)}
        disabled={disabled}
      >
        <SelectTrigger className="h-10 w-full justify-center rounded-none border-x-0 border-b border-t-0 border-border bg-transparent px-0 text-center text-xs font-bold shadow-none focus:ring-0 focus-visible:ring-0 [&>svg]:hidden">
          <SelectValue>{getSetTypeShortLabel(value)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(setTypeLabels).map(([setType, label]) => (
            <SelectItem key={setType} value={setType}>
              {getSetTypeShortLabel(setType as WorkoutSetType)} · {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

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

        <div className="grid gap-3 overflow-visible">
          <div className="flex gap-2 px-0.5">
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

            {visibleExercises.map((exercise) => {
              const isAdding = addingExerciseId === exercise.id;

              return (
                <button
                  key={exercise.id}
                  type="button"
                  aria-busy={isAdding}
                  className={cn(
                    "grid rounded-md border border-border p-3 text-left transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70",
                    isAdding &&
                      "border-primary/60 bg-primary/10 text-primary opacity-100",
                  )}
                  disabled={Boolean(addingExerciseId)}
                  onClick={() => void handleAdd(exercise)}
                >
                  <span className="flex items-center justify-between gap-3 text-sm font-semibold text-foreground">
                    <span>{exercise.name}</span>
                    {isAdding ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-primary">
                        <Loader2 className="size-3.5 animate-spin" />
                        Adicionando
                      </span>
                    ) : null}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {exercise.muscle_group} · {exercise.equipment}
                  </span>
                </button>
              );
            })}
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

function mapSessionExercises(
  exercises: CurrentWorkoutSessionExercise[],
): SessionExercise[] {
  return [...exercises]
    .sort((firstExercise, secondExercise) => firstExercise.order - secondExercise.order)
    .map((sessionExercise) => ({
      ...sessionExercise.exercise,
      clientOperationId: sessionExercise.client_operation_id,
      order: sessionExercise.order,
      savedSets: sessionExercise.sets.map((set) => mapWorkoutSet(set)),
      sessionExerciseId: sessionExercise.id,
      syncStatus: "synced",
    }));
}

function mapWorkoutSet(set: WorkoutSessionSet, localId = set.id): LoggedSet {
  return {
    clientOperationId: set.client_operation_id ?? crypto.randomUUID(),
    completedAt: set.completed_at ?? set.created_at,
    id: localId,
    reps: set.reps,
    serverId: set.id,
    setType: set.set_type,
    syncStatus: "synced",
    weight: set.weight,
  };
}

function mergeServerSessionExercises(
  serverExercises: CurrentWorkoutSessionExercise[],
  localExercises: SessionExercise[],
  pendingOperations: PendingWorkoutOperation[],
) {
  const pendingDeletedSetIds = new Set(
    pendingOperations
      .filter((operation) => operation.type === "DELETE_SET")
      .flatMap((operation) => [
        operation.localSetId,
        operation.serverSetId ?? "",
      ]),
  );
  const mappedServerExercises = mapSessionExercises(serverExercises).map(
    (serverExercise) => {
      const localExercise = localExercises.find(
        (exercise) =>
          exercise.sessionExerciseId === serverExercise.sessionExerciseId ||
          exercise.id === serverExercise.id,
      );

      if (!localExercise) {
        return serverExercise;
      }

      const pendingSets = localExercise.savedSets.filter(
        (set) => set.syncStatus !== "synced",
      );
      const savedSets = serverExercise.savedSets
        .filter(
          (serverSet) =>
            !pendingDeletedSetIds.has(serverSet.id) &&
            !pendingDeletedSetIds.has(serverSet.serverId ?? "") &&
            !pendingSets.some(
              (pendingSet) => pendingSet.serverId === serverSet.serverId,
            ),
        )
        .concat(pendingSets);

      return {
        ...serverExercise,
        savedSets,
      };
    },
  );
  const pendingLocalExercises = localExercises.filter(
    (exercise) => exercise.syncStatus !== "synced",
  );

  return [...mappedServerExercises, ...pendingLocalExercises].sort(
    (firstExercise, secondExercise) => firstExercise.order - secondExercise.order,
  );
}

function toLocalWorkoutExercise(
  exercise: SessionExercise,
): LocalWorkoutExercise {
  return {
    clientOperationId: exercise.clientOperationId,
    exercise,
    localId: exercise.sessionExerciseId,
    order: exercise.order,
    serverId:
      exercise.syncStatus === "synced" ? exercise.sessionExerciseId : undefined,
    sets: exercise.savedSets.map(toLocalWorkoutSet),
    syncStatus: exercise.syncStatus,
  };
}

function toLocalWorkoutSet(set: LoggedSet): LocalWorkoutSet {
  return {
    clientOperationId: set.clientOperationId,
    completedAt: set.completedAt,
    localId: set.id,
    reps: set.reps,
    serverId: set.serverId,
    setType: set.setType,
    syncStatus: set.syncStatus,
    weight: set.weight,
  };
}

function fromLocalWorkoutExercise(
  localExercise: LocalWorkoutExercise,
): SessionExercise {
  return {
    ...localExercise.exercise,
    clientOperationId: localExercise.clientOperationId,
    order: localExercise.order,
    savedSets: localExercise.sets.map(fromLocalWorkoutSet),
    sessionExerciseId: localExercise.serverId ?? localExercise.localId,
    syncStatus: localExercise.syncStatus,
  };
}

function fromLocalWorkoutSet(localSet: LocalWorkoutSet): LoggedSet {
  return {
    clientOperationId: localSet.clientOperationId,
    completedAt: localSet.completedAt,
    id: localSet.localId,
    reps: localSet.reps,
    serverId: localSet.serverId,
    setType: localSet.setType,
    syncStatus: localSet.syncStatus,
    weight: localSet.weight,
  };
}

function createPendingOperation(
  operation:
    | Omit<PendingWorkoutOperation, "createdAt" | "id" | "retryCount" | "status">
    | (Partial<PendingWorkoutOperation> & { type: PendingWorkoutOperation["type"] }),
): PendingWorkoutOperation {
  return {
    ...operation,
    createdAt: new Date().toISOString(),
    id: crypto.randomUUID(),
    retryCount: 0,
    status: "pending",
  } as PendingWorkoutOperation;
}

function markOperationStatus(
  operations: PendingWorkoutOperation[],
  operationId: string | undefined,
  status: PendingWorkoutOperation["status"],
) {
  if (!operationId) {
    return operations;
  }

  return operations.map((operation) =>
    operation.id === operationId
      ? {
          ...operation,
          retryCount:
            status === "failed" ? operation.retryCount + 1 : operation.retryCount,
          status,
        }
      : operation,
  );
}

function findServerSetId(exercises: SessionExercise[], localSetId: string) {
  for (const exercise of exercises) {
    const set = exercise.savedSets.find(
      (savedSet) => savedSet.id === localSetId,
    );

    if (set?.serverId) {
      return set.serverId;
    }
  }

  return undefined;
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
