"use client";

import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AppScreen } from "@/components/app/app-screen";
import { ScreenHeader } from "@/components/app/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreateWorkoutPlanDialog,
  routineModeLabels,
  WorkoutPlanActions,
  useWorkoutPlans,
} from "@/features/workouts";
import { routes } from "@/lib/routes";

export function WorkoutsScreen() {
  const {
    plans,
    currentPlanId,
    error,
    isLoading,
    loadPlans,
    refetchPlans,
  } = useWorkoutPlans();
  const currentPlan = React.useMemo(() => {
    if (!plans) {
      return null;
    }

    return plans.find((plan) => plan.id === currentPlanId) ?? null;
  }, [currentPlanId, plans]);
  const otherPlans = React.useMemo(
    () =>
      plans
        ?.filter((plan) => plan.id !== currentPlanId)
        .sort((firstPlan, secondPlan) =>
          firstPlan.name.localeCompare(secondPlan.name, "pt-BR", {
            sensitivity: "base",
          }),
        ) ?? null,
    [currentPlanId, plans],
  );

  React.useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  return (
    <AppScreen className="relative">
      <ScreenHeader title="Treinos" description="Planos, fichas e exercícios." />

      <Card className="mb-4 border-border bg-transparent">
        <CardContent className="p-0">
          <Link
            href={routes.workoutExercises}
            className="grid grid-cols-[1fr_auto] items-center gap-4 p-4"
          >
            <div className="min-w-0 text-center">
              <h2 className="text-sm font-semibold text-foreground">
                Biblioteca de exercícios
              </h2>
              <p className="text-xs text-muted-foreground">
                Filtre por músculo, tipo e equipamento.
              </p>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </Link>
        </CardContent>
      </Card>

      {!error && plans && plans.length > 0 ? <Separator className="mb-5" /> : null}

      {isLoading && plans === null ? (
        <section className="grid gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </section>
      ) : null}

      {!isLoading && error ? (
        <ErrorState
          title="Não foi possível carregar"
          description={error}
          action={<Button onClick={refetchPlans}>Tentar novamente</Button>}
        />
      ) : null}

      {!isLoading && !error && plans?.length === 0 ? (
        <EmptyState
          title="Nenhum plano cadastrado"
          description="Crie um plano para organizar sua rotina de treinos."
          action={
            <CreateWorkoutPlanDialog>
              <Button>Criar plano</Button>
            </CreateWorkoutPlanDialog>
          }
        />
      ) : null}

      {!error && plans && plans.length > 0 ? (
        <section className="grid gap-4">
          {currentPlan ? (
            <Card className="border-2 border-primary bg-primary/5">
              <CardContent className="grid grid-cols-[1fr_auto] items-center gap-3 p-4">
                <Link
                  href={routes.workoutPlan(currentPlan.id)}
                  className="min-w-0 text-center"
                >
                  <div>
                    <span className="mb-2 inline-flex rounded-full border border-primary/40 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Plano atual
                    </span>
                    <h2 className="truncate text-base font-semibold text-foreground">
                      {currentPlan.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Rotina {routineModeLabels[currentPlan.routine_mode].toLowerCase()}
                    </p>
                  </div>
                </Link>
                <WorkoutPlanActions isCurrent plan={currentPlan} />
              </CardContent>
            </Card>
          ) : null}

          {currentPlan && otherPlans?.length ? <Separator /> : null}

          {otherPlans?.length ? (
            <div className="grid gap-2">
              {otherPlans.map((plan) => (
                <Card key={plan.id} className="border-border bg-transparent">
                  <CardContent className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3">
                    <Link
                      href={routes.workoutPlan(plan.id)}
                      className="min-w-0 text-center"
                    >
                      <div>
                        <h2 className="truncate text-sm font-semibold text-foreground">
                          {plan.name}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          Rotina {routineModeLabels[plan.routine_mode].toLowerCase()}
                        </p>
                      </div>
                    </Link>
                    <WorkoutPlanActions isCurrent={false} plan={plan} />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <CreateWorkoutPlanDialog>
        <Button
          size="icon"
          className="absolute bottom-32 right-6 size-14 rounded-full shadow-none"
          aria-label="Criar plano"
        >
          <Plus className="size-7" />
        </Button>
      </CreateWorkoutPlanDialog>
    </AppScreen>
  );
}
