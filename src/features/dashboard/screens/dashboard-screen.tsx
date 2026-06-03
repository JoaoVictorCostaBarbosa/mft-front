"use client";

import Link from "next/link";

import { AppScreen } from "@/components/app/app-screen";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthSession } from "@/features/auth";
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import { CreateWorkoutPlanDialog } from "@/features/workouts";
import { routes } from "@/lib/routes";

const weekDays = ["S", "T", "Q", "Q", "S", "S", "D"];

export function DashboardScreen() {
  const { user } = useAuthSession();
  const { data, error, isLoading, refetch } = useDashboardData();
  const activePlan = data?.currentWorkoutPlan;
  const activeTemplate = activePlan?.templates[0];
  const hasWorkoutPlans = Boolean(data?.workoutPlans.length);

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
                    {activeTemplate?.name ??
                      activePlan?.name ??
                      (hasWorkoutPlans
                        ? "Escolha seu plano atual"
                        : "Nenhum treino definido")}
                  </CardTitle>
                  <CardDescription>
                    {activeTemplate
                      ? "Ficha disponível para iniciar."
                      : activePlan
                        ? "Adicione fichas ao plano para começar."
                        : hasWorkoutPlans
                          ? "Defina um plano atual para destacar sua rotina."
                        : "Crie um plano para organizar sua rotina."}
                  </CardDescription>
                </div>
              </div>

              {activePlan || activeTemplate ? (
                <Button className="h-12 w-full rounded-lg text-base">
                  Iniciar treino
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
              <span className="text-xs text-muted-foreground">Sem registros</span>
            </div>
            <div className="flex justify-between gap-2">
              {weekDays.map((day, index) => (
                <span
                  key={`${day}-${index}`}
                  className="flex size-10 items-center justify-center rounded-full border border-border text-xs font-bold text-muted-foreground"
                >
                  {day}
                </span>
              ))}
            </div>
          </section>
        </section>
      ) : null}

      <section className="mt-5 grid grid-cols-2 gap-3">
        <Button variant="secondary" className="h-12 justify-start text-xs">
          Medidas
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
