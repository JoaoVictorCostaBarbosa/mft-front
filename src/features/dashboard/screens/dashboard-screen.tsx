"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AppScreen } from "@/components/app/app-screen";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  { dayOfWeek: "sunday", label: "D" },
  { dayOfWeek: "monday", label: "S" },
  { dayOfWeek: "tuesday", label: "T" },
  { dayOfWeek: "wednesday", label: "Q" },
  { dayOfWeek: "thursday", label: "Q" },
  { dayOfWeek: "friday", label: "S" },
  { dayOfWeek: "saturday", label: "S" },
];

export function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthSession();
  const { data, error, isLoading, refetch } = useDashboardData();
  const { refetchCurrentSession } = useActiveWorkout();
  const [isSessionActionLoading, setIsSessionActionLoading] =
    React.useState(false);
  const [todayDayOfWeek, setTodayDayOfWeek] =
    React.useState<DayOfWeek | null>(null);
  const activePlan = data?.currentWorkoutPlan;
  const currentSession = data?.currentWorkoutSession;
  const todayRoutineItem =
    todayDayOfWeek && activePlan?.routine_mode === "weekly"
      ? activePlan.routine_items.find(
          (item) => item.day_of_week === todayDayOfWeek,
        )
      : undefined;
  const nextSequentialItem =
    activePlan?.routine_mode === "sequential" ? data?.nextRoutineItem : null;
  const displayRoutineItem = todayRoutineItem ?? nextSequentialItem;
  const activeTemplate =
    displayRoutineItem?.item_type === "workout"
      ? displayRoutineItem.workout_template
      : undefined;
  const cardTemplateName =
    currentSession?.workout_template?.name ?? activeTemplate?.name;
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

  async function handleFinishWorkout() {
    if (!currentSession) {
      return;
    }

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
      await createWorkoutSession({});
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
      <header className="mb-7 grid gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Olá, {user?.name ?? "User"}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Pronto para o treino de hoje?
        </p>
      </header>

      {isLoading ? (
        <section className="grid gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-24" />
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
        <section className="grid gap-6">
          <Card className="border-border bg-transparent">
            <CardHeader className="gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="grid gap-1">
                  <span className="w-fit rounded-full border border-primary/40 px-2.5 py-0.5 text-xs font-medium text-primary">
                    Treino de hoje
                  </span>
                  <CardTitle className="text-xl">
                    {cardTemplateName ??
                      (isRestDay && isSequentialPlan
                        ? "Próximo descanso"
                        : null) ??
                      (isRestDay ? "Descanso hoje" : null) ??
                      (isSequentialPlan ? "Rotina sequencial" : null) ??
                      (activePlan
                        ? "Sem treino para hoje"
                        : null) ??
                      (hasWorkoutPlans
                        ? "Escolha seu plano atual"
                        : "Nenhum treino definido")}
                  </CardTitle>
                  <CardDescription>
                    {currentSession
                      ? `Em andamento desde ${formatTime(currentSession.started_at)}.`
                      : activeTemplate
                      ? isSequentialPlan
                        ? "Próximo treino disponível na sequência."
                        : `Treino cadastrado para ${todayLabel}.`
                      : isRestDay && isSequentialPlan
                        ? "O próximo item da sequência é um descanso."
                        : isRestDay
                        ? `Este plano marca ${todayLabel} como descanso.`
                        : isSequentialPlan
                          ? nextSequentialItem
                            ? "Próximo treino disponível na sequência."
                            : "Abra o plano para organizar a sequência."
                      : activePlan
                        ? `O plano atual não tem treino cadastrado para ${todayLabel}.`
                        : hasWorkoutPlans
                          ? "Defina um plano atual para destacar sua rotina."
                        : "Crie um plano para organizar sua rotina."}
                  </CardDescription>
                </div>
              </div>

              {currentSession ? (
                <Button
                  className="h-12 w-full rounded-lg text-base"
                  disabled={isSessionActionLoading}
                  onClick={() => void handleFinishWorkout()}
                >
                  {isSessionActionLoading ? "Finalizando..." : "Finalizar treino"}
                </Button>
              ) : activeTemplate ? (
                <Button asChild className="h-12 w-full rounded-lg text-base">
                  <Link
                    href={routes.workoutTemplate(
                      activeTemplate.id,
                      activePlan?.id,
                    )}
                  >
                    Ver treino
                  </Link>
                </Button>
              ) : activePlan ? (
                <Button asChild className="h-12 w-full rounded-lg text-base">
                  <Link href={routes.workoutPlan(activePlan.id)}>
                    Ver plano
                  </Link>
                </Button>
              ) : hasWorkoutPlans ? (
                <Button asChild className="h-12 w-full rounded-lg text-base">
                  <Link href={routes.workouts}>Ver planos</Link>
                </Button>
              ) : (
                <CreateWorkoutPlanDialog onCreated={refetch}>
                  <Button className="h-12 w-full rounded-lg text-base">
                    Criar plano
                  </Button>
                </CreateWorkoutPlanDialog>
              )}
            </CardHeader>
          </Card>

          <section className="grid gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Resumo semanal</h2>
              <span className="text-xs text-muted-foreground">
                {trainedDays.size
                  ? `${trainedDays.size} dia${trainedDays.size === 1 ? "" : "s"}`
                  : "Sem registros"}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              {weekDays.map((day) => (
                <span
                  key={day.dayOfWeek}
                  className={
                    trainedDays.has(day.dayOfWeek)
                      ? "flex size-10 items-center justify-center rounded-full border border-primary bg-primary text-xs font-bold text-primary-foreground"
                      : "flex size-10 items-center justify-center rounded-full border border-border text-xs font-bold text-muted-foreground"
                  }
                  title={dayOfWeekLabels[day.dayOfWeek]}
                >
                  {day.label}
                </span>
              ))}
            </div>
          </section>
        </section>
      ) : null}

      <section className="mt-5 grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          className="h-12 justify-start text-xs"
          disabled={Boolean(currentSession) || isSessionActionLoading}
          onClick={() => void handleStartFreeWorkout()}
        >
          Treino avulso
        </Button>
        <CreateWorkoutPlanDialog onCreated={refetch}>
          <Button variant="secondary" className="h-12 justify-start text-xs">
            Criar plano
          </Button>
        </CreateWorkoutPlanDialog>
      </section>
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
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return dayOfWeekByIndex[new Date().getDay()];
}
