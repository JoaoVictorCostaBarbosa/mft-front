"use client";

import { Check, ChevronRight, Dumbbell, Flame, Play, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AppScreen } from "@/components/app/app-screen";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useAuthSession } from "@/features/auth";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import {
  createWorkoutSession,
  finishWorkoutSession,
} from "@/features/workout-sessions/api/workout-sessions-api";
import { useActiveWorkout } from "@/features/workout-sessions";
import { CreateWorkoutPlanDialog, dayOfWeekLabels } from "@/features/workouts";
import type { DayOfWeek } from "@/features/workouts";
import { getApiErrorMessage } from "@/lib/http";
import { routes } from "@/lib/routes";

const weekDays: Array<{ dayOfWeek: DayOfWeek; label: string }> = [
  { dayOfWeek: "monday", label: "S" },
  { dayOfWeek: "tuesday", label: "T" },
  { dayOfWeek: "wednesday", label: "Q" },
  { dayOfWeek: "thursday", label: "Q" },
  { dayOfWeek: "friday", label: "S" },
  { dayOfWeek: "saturday", label: "S" },
  { dayOfWeek: "sunday", label: "D" },
];

const WEEK_GOAL = 5;
const RING_R = 43;
const RING_STROKE = 10;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;

export function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthSession();
  const { data, error, isLoading, refetch } = useDashboardData();
  const { refetchCurrentSession } = useActiveWorkout();
  const [isSessionActionLoading, setIsSessionActionLoading] = React.useState(false);
  const [todayDayOfWeek, setTodayDayOfWeek] = React.useState<DayOfWeek | null>(null);

  const activePlan = data?.currentWorkoutPlan;
  const currentSession = data?.currentWorkoutSession;
  const todayRoutineItem =
    todayDayOfWeek && activePlan?.routine_mode === "weekly"
      ? activePlan.routine_items.find((item) => item.day_of_week === todayDayOfWeek)
      : undefined;
  const nextSequentialItem =
    activePlan?.routine_mode === "sequential" ? data?.nextRoutineItem : null;
  const displayRoutineItem = todayRoutineItem ?? nextSequentialItem;
  const activeTemplate =
    displayRoutineItem?.item_type === "workout"
      ? displayRoutineItem.workout_template
      : undefined;
  const cardTemplateName = currentSession?.workout_template?.name ?? activeTemplate?.name;
  const isRestDay = displayRoutineItem?.item_type === "rest";
  const isSequentialPlan = activePlan?.routine_mode === "sequential";
  const hasWorkoutPlans = Boolean(data?.workoutPlans.length);
  const todayLabel = todayDayOfWeek ? dayOfWeekLabels[todayDayOfWeek] : "hoje";

  const trainedDays = React.useMemo(
    () =>
      new Set(
        data?.weeklySummary.days
          .filter((day) => day.trained)
          .map((day) => day.day_of_week) ?? [],
      ),
    [data?.weeklySummary.days],
  );

  const weeklyCount = trainedDays.size;
  const weeklyProgress = Math.min(weeklyCount / WEEK_GOAL, 1);
  const ringDash = weeklyProgress * RING_CIRCUMFERENCE;
  const ringGap = RING_CIRCUMFERENCE - ringDash;

  const todayFormatted = React.useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "numeric", month: "short" })
        .format(new Date())
        .replace(/^\w/, (c) => c.toUpperCase()),
    [],
  );

  async function handleFinishWorkout() {
    if (!currentSession) return;
    setIsSessionActionLoading(true);
    try {
      await finishWorkoutSession(currentSession.id, { finished_at: null });
      toast({
        title: "Treino finalizado",
        description: currentSession.workout_template?.name ?? "Treino avulso",
      });
      await refetchCurrentSession();
      await refetch();
    } catch (error) {
      toast({
        title: "Não foi possível finalizar",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsSessionActionLoading(false);
    }
  }

  async function handleStartFreeWorkout() {
    setIsSessionActionLoading(true);
    try {
      await createWorkoutSession({ workout_plan_id: null, workout_template_id: null });
      toast({
        title: "Treino avulso iniciado",
        description: "Adicione exercícios para registrar suas séries.",
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
      setIsSessionActionLoading(false);
    }
  }

  React.useEffect(() => {
    setTodayDayOfWeek(getTodayDayOfWeek());
  }, []);

  return (
    <AppScreen>
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[13.5px] font-medium text-muted-foreground">{todayFormatted}</p>
          <h1 className="mt-0.5 font-display text-[27px] font-bold tracking-[-0.03em] text-foreground">
            Bom treino, {user?.name?.split(" ")[0] ?? "Atleta"}
          </h1>
        </div>
        <div className="flex size-[42px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-primary bg-accent-soft font-display text-base font-bold text-primary">
          {getInitials(user?.name)}
        </div>
      </header>

      {isLoading ? (
        <section className="grid gap-3">
          <Skeleton className="h-36 rounded-[20px]" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-28 rounded-[20px]" />
            <Skeleton className="h-28 rounded-[20px]" />
          </div>
          <Skeleton className="h-20 rounded-[20px]" />
          <Skeleton className="h-20 rounded-[20px]" />
        </section>
      ) : null}

      {!isLoading && error ? (
        <ErrorState
          title="Não foi possível carregar"
          description={error}
          action={<Button onClick={refetch}>Tentar novamente</Button>}
        />
      ) : null}

      {!isLoading && !error ? (
        <section className="grid gap-3">
          {/* Weekly goal card */}
          <div
            className="rounded-[20px] border border-border bg-card p-5"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center gap-5">
              {/* SVG ring */}
              <div className="relative size-24 shrink-0">
                <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
                  <circle cx="48" cy="48" r={RING_R} fill="none" stroke="var(--track)" strokeWidth={RING_STROKE} />
                  <circle
                    cx="48" cy="48" r={RING_R} fill="none" stroke="var(--primary)"
                    strokeWidth={RING_STROKE} strokeLinecap="round"
                    strokeDasharray={`${ringDash} ${ringGap}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-[24px] font-semibold leading-none tracking-[-0.03em] text-foreground">
                    {weeklyCount}
                  </span>
                  <span className="mt-0.5 text-[11px] font-semibold text-muted-foreground">
                    de {WEEK_GOAL}
                  </span>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-bold tracking-[-0.02em] text-foreground">
                  Meta da semana
                </p>
                <p className="mt-1.5 text-[13.5px] leading-[1.4] text-muted-foreground">
                  {weeklyCount >= WEEK_GOAL
                    ? "Meta atingida! 🎉"
                    : `Faltam ${WEEK_GOAL - weeklyCount} treino${WEEK_GOAL - weeklyCount === 1 ? "" : "s"} pra fechar 🔥`}
                </p>
                {/* Day squares */}
                <div className="mt-3.5 flex gap-1.5">
                  {weekDays.map((day) => {
                    const isTrained = trainedDays.has(day.dayOfWeek);
                    const isToday = day.dayOfWeek === todayDayOfWeek;
                    return (
                      <div key={day.dayOfWeek} className="flex-1 text-center">
                        <div
                          className={
                            isTrained
                              ? "flex h-[30px] items-center justify-center rounded-[8px] bg-primary"
                              : isToday
                                ? "flex h-[30px] items-center justify-center rounded-[8px] border-[1.5px] border-primary bg-track"
                                : "h-[30px] rounded-[8px] bg-track"
                          }
                        >
                          {isTrained ? (
                            <Check className="size-3.5 stroke-[3] text-primary-foreground" />
                          ) : null}
                        </div>
                        <span
                          className={`mt-1.5 block text-[10.5px] font-semibold ${isToday && !isTrained ? "text-primary" : "text-faint"}`}
                        >
                          {day.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-[20px] border border-border bg-card p-4"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="mb-3 flex size-[34px] items-center justify-center rounded-[10px] bg-accent-soft text-primary">
                <Flame className="size-[18px]" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-[28px] font-semibold leading-none tracking-[-0.03em] text-foreground">
                  {weeklyCount}
                </span>
                <span className="font-display text-sm font-medium text-muted-foreground">
                  sem
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-[13px] font-medium text-muted-foreground">Sequência</span>
                <span className="inline-flex items-center text-xs font-semibold text-primary">
                  <TrendingUp className="size-[13px]" />
                </span>
              </div>
            </div>
            <div
              className="rounded-[20px] border border-border bg-card p-4"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="mb-3 flex size-[34px] items-center justify-center rounded-[10px] bg-accent-soft text-primary">
                <Dumbbell className="size-[18px]" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-[28px] font-semibold leading-none tracking-[-0.03em] text-foreground">
                  —
                </span>
                <span className="font-display text-sm font-medium text-muted-foreground">
                  t
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-[13px] font-medium text-muted-foreground">Volume semanal</span>
              </div>
            </div>
          </div>

          {/* Continuar de onde parou */}
          <h3 className="font-display text-[17px] font-bold tracking-[-0.02em] text-foreground">
            {currentSession ? "Em andamento" : "Continuar de onde parou"}
          </h3>
          <div
            className="rounded-[20px] border border-border bg-card overflow-hidden"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center gap-3.5 p-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-accent-soft text-primary">
                <Dumbbell className="size-[26px]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-bold tracking-[-0.02em] text-foreground truncate">
                  {cardTemplateName ??
                    (isRestDay ? "Descanso" : null) ??
                    (activePlan ? "Sem treino hoje" : null) ??
                    (hasWorkoutPlans ? "Escolha um plano" : "Nenhum treino")}
                </p>
                <p className="mt-0.5 text-[13px] font-medium text-muted-foreground">
                  {currentSession
                    ? `Iniciado às ${formatTime(currentSession.started_at)}`
                    : hasWorkoutPlans && activePlan
                      ? isRestDay
                        ? "Dia de descanso"
                        : activeTemplate
                          ? isSequentialPlan ? "Próximo na sequência" : `Treino de ${todayLabel}`
                          : `Sem treino para ${todayLabel}`
                      : hasWorkoutPlans
                        ? "Defina um plano atual"
                        : "Crie um plano de treino"}
                </p>
              </div>
              {currentSession ? (
                <Link href={routes.workoutSession}>
                  <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    style={{ boxShadow: "0 6px 14px -6px var(--primary)" }}
                  >
                    <Play className="size-5 ml-0.5" />
                  </div>
                </Link>
              ) : activeTemplate ? (
                <Link href={routes.workoutTemplate(activeTemplate.id, activePlan?.id)}>
                  <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    style={{ boxShadow: "0 6px 14px -6px var(--primary)" }}
                  >
                    <Play className="size-5 ml-0.5" />
                  </div>
                </Link>
              ) : activePlan ? (
                <Link href={routes.workoutPlan(activePlan.id)}>
                  <ChevronRight className="size-5 text-faint" />
                </Link>
              ) : null}
            </div>
            {currentSession ? (
              <div className="flex gap-2 border-t border-border px-4 py-3">
                <Button asChild className="flex-1 h-10 text-sm">
                  <Link href={routes.workoutSession}>
                    <Play className="size-4" />
                    Continuar
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-10 px-4 text-sm"
                  disabled={isSessionActionLoading}
                  onClick={() => void handleFinishWorkout()}
                >
                  {isSessionActionLoading ? "..." : "Finalizar"}
                </Button>
              </div>
            ) : !activePlan && !hasWorkoutPlans ? (
              <div className="border-t border-border px-4 py-3">
                <CreateWorkoutPlanDialog onCreated={refetch}>
                  <Button className="w-full h-10 text-sm">
                    <Plus className="size-4" />
                    Criar plano
                  </Button>
                </CreateWorkoutPlanDialog>
              </div>
            ) : null}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              className="h-11 text-sm justify-center"
              disabled={Boolean(currentSession) || isSessionActionLoading}
              onClick={() => void handleStartFreeWorkout()}
            >
              <Play className="size-4" />
              Treino avulso
            </Button>
            <CreateWorkoutPlanDialog onCreated={refetch}>
              <Button variant="secondary" className="h-11 text-sm justify-center">
                <Plus className="size-4" />
                Novo plano
              </Button>
            </CreateWorkoutPlanDialog>
          </div>
        </section>
      ) : null}
    </AppScreen>
  );
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getTodayDayOfWeek(): DayOfWeek {
  const dayOfWeekByIndex: DayOfWeek[] = [
    "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
  ];
  return dayOfWeekByIndex[new Date().getDay()];
}

function getInitials(name?: string | null) {
  if (!name) return "A";
  const [first, second] = name.trim().split(/\s+/);
  return `${first?.[0] ?? ""}${second?.[0] ?? ""}`.toUpperCase();
}
