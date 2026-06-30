"use client";

import { ChevronRight, Clock, Dumbbell, Plus, Search } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AppScreen } from "@/components/app/app-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreateWorkoutPlanDialog,
  routineModeLabels,
  WorkoutPlanActions,
  useWorkoutPlans,
} from "@/features/workouts";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type TabValue = "plans" | "exercises";

export function WorkoutsScreen() {
  const { plans, currentPlanId, error, isLoading, loadPlans, refetchPlans } = useWorkoutPlans();
  const [tab, setTab] = React.useState<TabValue>("plans");
  const [query, setQuery] = React.useState("");

  const currentPlan = React.useMemo(
    () => (plans ? (plans.find((plan) => plan.id === currentPlanId) ?? null) : null),
    [currentPlanId, plans],
  );

  const otherPlans = React.useMemo(
    () =>
      plans
        ?.filter((plan) => plan.id !== currentPlanId)
        .sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })) ?? null,
    [currentPlanId, plans],
  );

  const filteredOther = React.useMemo(() => {
    if (!otherPlans || !query.trim()) return otherPlans;
    const q = query.toLowerCase();
    return otherPlans.filter((p) => p.name.toLowerCase().includes(q));
  }, [otherPlans, query]);

  React.useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  return (
    <AppScreen className="relative">
      {/* Header */}
      <div className="mb-[18px] flex items-center justify-between">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.03em] text-foreground">
          Treinos
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex size-[42px] items-center justify-center rounded-full border border-border bg-card text-foreground"
            style={{ boxShadow: "var(--shadow-card)" }}
            aria-label="Buscar"
          >
            <Search className="size-5" />
          </button>
          <CreateWorkoutPlanDialog>
            <button
              type="button"
              className="flex size-[42px] items-center justify-center rounded-full bg-primary text-primary-foreground"
              style={{ boxShadow: "0 4px 12px -4px var(--primary)" }}
              aria-label="Novo plano"
            >
              <Plus className="size-[22px] stroke-[2.2]" />
            </button>
          </CreateWorkoutPlanDialog>
        </div>
      </div>

      {/* Segmented control */}
      <div className="mb-5 flex gap-1 rounded-[999px] border border-border bg-secondary p-1">
        <button
          type="button"
          onClick={() => setTab("plans")}
          className={cn(
            "flex-1 h-[38px] rounded-[999px] text-sm font-semibold transition-all",
            tab === "plans"
              ? "bg-card text-foreground shadow-sm"
              : "bg-transparent text-muted-foreground",
          )}
        >
          Minhas rotinas
        </button>
        <button
          type="button"
          onClick={() => setTab("exercises")}
          className={cn(
            "flex-1 h-[38px] rounded-[999px] text-sm font-semibold transition-all",
            tab === "exercises"
              ? "bg-card text-foreground shadow-sm"
              : "bg-transparent text-muted-foreground",
          )}
        >
          Exercícios
        </button>
      </div>

      {tab === "exercises" ? (
        <Link
          href={routes.workoutExercises}
          className="flex items-center justify-between rounded-[20px] border border-border bg-card p-4"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex size-10 items-center justify-center rounded-[11px] bg-accent-soft text-primary">
              <Dumbbell className="size-[19px]" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Biblioteca de exercícios</p>
              <p className="text-xs text-muted-foreground">
                Filtre por músculo, tipo e equipamento.
              </p>
            </div>
          </div>
          <ChevronRight className="size-5 text-faint shrink-0" />
        </Link>
      ) : (
        <>
          {/* Search */}
          {plans && plans.length > 1 ? (
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                placeholder="Buscar rotina"
                autoComplete="off"
              />
            </div>
          ) : null}

          {isLoading && plans === null ? (
            <div className="grid gap-3">
              <Skeleton className="h-[88px] rounded-[20px]" />
              <Skeleton className="h-[88px] rounded-[20px]" />
              <Skeleton className="h-[88px] rounded-[20px]" />
            </div>
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
            <div className="grid gap-3">
              {/* Iniciar treino vazio — dashed button */}
              <button
                type="button"
                className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[999px] border-[1.5px] border-dashed border-border-strong bg-card text-[15.5px] font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                onClick={() => void undefined}
              >
                <Plus className="size-[19px] stroke-[2.2]" />
                Iniciar treino vazio
              </button>

              {/* Current plan */}
              {currentPlan ? (
                <div
                  className="rounded-[20px] border border-border bg-card p-4"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-1.5 inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                        Plano atual
                      </div>
                      <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-foreground truncate">
                        {currentPlan.name}
                      </h2>
                      <p className="mt-1 text-[13px] font-medium text-muted-foreground">
                        Rotina {routineModeLabels[currentPlan.routine_mode].toLowerCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <WorkoutPlanActions isCurrent plan={currentPlan} />
                      <Link href={routes.workoutPlan(currentPlan.id)}>
                        <ChevronRight className="size-5 text-faint" />
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-t border-border pt-3">
                    <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground">
                      <Clock className="size-[15px]" />
                      Rotina {routineModeLabels[currentPlan.routine_mode].toLowerCase()}
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Other plans */}
              {filteredOther?.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-[20px] border border-border bg-card p-4"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-display text-[17px] font-bold tracking-[-0.02em] text-foreground truncate">
                        {plan.name}
                      </h2>
                      <p className="mt-1 text-[13px] font-medium text-muted-foreground">
                        Rotina {routineModeLabels[plan.routine_mode].toLowerCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <WorkoutPlanActions isCurrent={false} plan={plan} />
                      <Link href={routes.workoutPlan(plan.id)}>
                        <ChevronRight className="size-5 text-faint" />
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-t border-border pt-3">
                    <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground">
                      <Clock className="size-[15px]" />
                      Rotina {routineModeLabels[plan.routine_mode].toLowerCase()}
                    </span>
                  </div>
                </div>
              ))}

              {filteredOther?.length === 0 && query ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Nenhum plano encontrado para &ldquo;{query}&rdquo;.
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </AppScreen>
  );
}
