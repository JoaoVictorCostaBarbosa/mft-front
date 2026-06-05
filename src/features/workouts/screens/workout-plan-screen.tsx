"use client";

import { ArrowLeft, Bed, ChevronRight, Dumbbell, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AppScreen } from "@/components/app/app-screen";
import { ScreenHeader } from "@/components/app/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateRoutineRestDialog } from "@/features/workouts/components/create-routine-rest-dialog";
import { CreateWorkoutTemplateDialog } from "@/features/workouts/components/create-workout-template-dialog";
import { WorkoutTemplateActions } from "@/features/workouts/components/workout-template-actions";
import {
  dayOfWeekInitials,
  dayOfWeekLabels,
  dayOfWeekOrder,
  routineModeLabels,
} from "@/features/workouts/constants";
import { useWorkoutPlan } from "@/features/workouts/hooks/use-workout-plan";
import type {
  DayOfWeek,
  WorkoutPlanRoutineItem,
} from "@/features/workouts/types";
import { routes } from "@/lib/routes";

type WorkoutPlanScreenProps = {
  planId: string;
};

export function WorkoutPlanScreen({ planId }: WorkoutPlanScreenProps) {
  const router = useRouter();
  const {
    createRest,
    createTemplate,
    deleteRoutineItem,
    error,
    isCreatingTemplate,
    isLoading,
    plan,
    refetch,
    renameTemplate,
    updateRoutineItemSchedule,
  } = useWorkoutPlan(planId);
  const [isEditingTemplates, setIsEditingTemplates] = React.useState(false);
  const routineItems = React.useMemo(
    () => sortRoutineItems(plan?.routine_items ?? []),
    [plan?.routine_items],
  );
  const nextPosition = getNextPosition(routineItems);

  return (
    <AppScreen className="relative">
      <div className="mb-6 grid grid-cols-[1fr_auto] items-start gap-3">
        <ScreenHeader
          className="mb-0"
          title={plan?.name ?? "Plano de treino"}
          description={
            plan
              ? `Rotina ${routineModeLabels[plan.routine_mode].toLowerCase()} vinculada a este plano.`
              : "Treinos vinculados a este plano."
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

      {!isLoading && !error && plan && routineItems.length === 0 ? (
        <section className="grid gap-5">
          {plan.routine_mode === "weekly" ? (
            <WorkoutWeekOverview routineItems={[]} />
          ) : (
            <WorkoutSequenceOverview routineItems={[]} />
          )}
          <EmptyState
            title="Nenhum item criado"
            description="Crie um treino ou descanso para começar a organizar este plano."
            icon={<Dumbbell className="size-6" />}
            action={
              <div className="flex gap-2">
                <CreateWorkoutTemplateDialog
                  isSubmitting={isCreatingTemplate}
                  nextPosition={nextPosition}
                  onCreate={createTemplate}
                  routineMode={plan.routine_mode}
                >
                  <Button>Criar treino</Button>
                </CreateWorkoutTemplateDialog>
                <CreateRoutineRestDialog
                  isSubmitting={isCreatingTemplate}
                  nextPosition={nextPosition}
                  onCreate={createRest}
                  routineMode={plan.routine_mode}
                >
                  <Button variant="secondary">Descanso</Button>
                </CreateRoutineRestDialog>
              </div>
            }
          />
        </section>
      ) : null}

      {!isLoading && !error && plan && routineItems.length ? (
        <section className="grid gap-3">
          {plan.routine_mode === "weekly" ? (
            <WorkoutWeekOverview routineItems={routineItems} />
          ) : (
            <WorkoutSequenceOverview routineItems={routineItems} />
          )}

          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-foreground">Rotina</h2>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {routineItems.length} item{routineItems.length === 1 ? "" : "s"}
              </span>
              <Button
                type="button"
                variant={isEditingTemplates ? "default" : "secondary"}
                size="sm"
                className="w-20"
                onClick={() =>
                  setIsEditingTemplates((isEditing) => !isEditing)
                }
              >
                {isEditingTemplates ? "Concluir" : "Editar"}
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            {routineItems.map((routineItem) => {
              const template = routineItem.workout_template;
              const isWorkout = routineItem.item_type === "workout";

              return (
                <Card
                  key={routineItem.id}
                  className="border-border bg-transparent"
                >
                  {!isEditingTemplates && isWorkout && template ? (
                    <Link
                      href={routes.workoutTemplate(template.id, plan.id)}
                      className="grid grid-cols-[auto_1fr_2.5rem] items-center gap-3 p-4"
                    >
                      <RoutineItemIcon isWorkout={isWorkout} />
                      <RoutineItemText routineItem={routineItem} />
                      <span className="flex size-10 items-center justify-center">
                        <ChevronRight className="size-5 text-muted-foreground" />
                      </span>
                    </Link>
                  ) : (
                    <CardContent className="grid grid-cols-[auto_1fr_2.5rem] items-center gap-3 p-4">
                      <RoutineItemIcon isWorkout={isWorkout} />
                      <RoutineItemText routineItem={routineItem} />
                      {isEditingTemplates ? (
                        <WorkoutTemplateActions
                          itemId={routineItem.id}
                          itemType={routineItem.item_type}
                          routineMode={plan.routine_mode}
                          scheduledDay={routineItem.day_of_week}
                          scheduledPosition={routineItem.position}
                          template={template}
                          onDelete={deleteRoutineItem}
                          onRename={renameTemplate}
                          onUpdateSchedule={updateRoutineItemSchedule}
                        />
                      ) : (
                        <span className="flex size-10 items-center justify-center" />
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <CreateWorkoutTemplateDialog
              isSubmitting={isCreatingTemplate}
              nextPosition={nextPosition}
              onCreate={createTemplate}
              routineMode={plan.routine_mode}
            >
              <Button variant="secondary">Adicionar treino</Button>
            </CreateWorkoutTemplateDialog>
            <CreateRoutineRestDialog
              isSubmitting={isCreatingTemplate}
              nextPosition={nextPosition}
              onCreate={createRest}
              routineMode={plan.routine_mode}
            >
              <Button variant="secondary">Adicionar descanso</Button>
            </CreateRoutineRestDialog>
          </div>
        </section>
      ) : null}

      {plan ? (
        <CreateWorkoutTemplateDialog
          isSubmitting={isCreatingTemplate}
          nextPosition={nextPosition}
          onCreate={createTemplate}
          routineMode={plan.routine_mode}
        >
          <Button
            size="icon"
            className="absolute bottom-32 right-6 size-14 rounded-full shadow-none"
            aria-label="Criar treino"
          >
            <Plus className="size-7" />
          </Button>
        </CreateWorkoutTemplateDialog>
      ) : null}
    </AppScreen>
  );
}

function RoutineItemIcon({ isWorkout }: { isWorkout: boolean }) {
  return (
    <div
      className={
        isWorkout
          ? "flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary"
          : "flex size-10 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground"
      }
    >
      {isWorkout ? <Dumbbell className="size-5" /> : <Bed className="size-5" />}
    </div>
  );
}

function RoutineItemText({
  routineItem,
}: {
  routineItem: WorkoutPlanRoutineItem;
}) {
  return (
    <div className="min-w-0">
      <h3 className="truncate text-sm font-semibold text-foreground">
        {routineItem.workout_template?.name ?? "Descanso"}
      </h3>
      <p className="text-xs text-muted-foreground">
        {getRoutineItemScheduleLabel(routineItem)}
      </p>
    </div>
  );
}

function WorkoutWeekOverview({
  routineItems,
}: {
  routineItems: WorkoutPlanRoutineItem[];
}) {
  const workoutDays = new Set(
    routineItems
      .filter((item) => item.item_type === "workout" && item.day_of_week)
      .map((item) => item.day_of_week as DayOfWeek),
  );
  const restDays = new Set(
    routineItems
      .filter((item) => item.item_type === "rest" && item.day_of_week)
      .map((item) => item.day_of_week as DayOfWeek),
  );

  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-foreground">Semana</h2>
        <span className="text-xs text-muted-foreground">
          {routineItems.length} item{routineItems.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="flex justify-between gap-2">
        {dayOfWeekOrder.map((dayOfWeek) => {
          const hasWorkout = workoutDays.has(dayOfWeek);
          const hasRest = restDays.has(dayOfWeek);

          return (
            <span
              key={dayOfWeek}
              className={
                hasWorkout
                  ? "flex size-10 items-center justify-center rounded-full border border-primary bg-primary text-xs font-bold text-primary-foreground"
                  : hasRest
                    ? "flex size-10 items-center justify-center rounded-full border border-border bg-secondary text-xs font-bold text-muted-foreground"
                    : "flex size-10 items-center justify-center rounded-full border border-border text-xs font-bold text-muted-foreground"
              }
              title={dayOfWeekLabels[dayOfWeek]}
            >
              {dayOfWeekInitials[dayOfWeek]}
            </span>
          );
        })}
      </div>
    </section>
  );
}

function WorkoutSequenceOverview({
  routineItems,
}: {
  routineItems: WorkoutPlanRoutineItem[];
}) {
  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-foreground">Sequência</h2>
        <span className="text-xs text-muted-foreground">
          {routineItems.length} item{routineItems.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {routineItems.length ? (
          routineItems.map((item) => (
            <span
              key={item.id}
              className={
                item.item_type === "workout"
                  ? "flex size-10 shrink-0 items-center justify-center rounded-full border border-primary bg-primary text-xs font-bold text-primary-foreground"
                  : "flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-bold text-muted-foreground"
              }
              title={item.workout_template?.name ?? "Descanso"}
            >
              {item.position ?? "-"}
            </span>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">
            Nenhum item na sequência.
          </span>
        )}
      </div>
    </section>
  );
}

function getRoutineItemScheduleLabel(item: WorkoutPlanRoutineItem) {
  if (item.day_of_week) {
    return dayOfWeekLabels[item.day_of_week];
  }

  if (item.position) {
    return `Posição ${item.position}`;
  }

  return "Sem posição definida";
}

function sortRoutineItems(items: WorkoutPlanRoutineItem[]) {
  return [...items].sort((firstItem, secondItem) => {
    if (firstItem.day_of_week && secondItem.day_of_week) {
      return (
        dayOfWeekOrder.indexOf(firstItem.day_of_week) -
        dayOfWeekOrder.indexOf(secondItem.day_of_week)
      );
    }

    return (firstItem.position ?? 0) - (secondItem.position ?? 0);
  });
}

function getNextPosition(items: WorkoutPlanRoutineItem[]) {
  return (
    items.reduce(
      (highestPosition, item) =>
        Math.max(highestPosition, item.position ?? 0),
      0,
    ) + 1
  );
}
