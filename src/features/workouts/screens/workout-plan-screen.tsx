"use client";

import { ArrowLeft, ChevronRight, Dumbbell, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { AppScreen } from "@/components/app/app-screen";
import { ScreenHeader } from "@/components/app/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateWorkoutTemplateDialog } from "@/features/workouts/components/create-workout-template-dialog";
import { useWorkoutPlan } from "@/features/workouts/hooks/use-workout-plan";

type WorkoutPlanScreenProps = {
  planId: string;
};

export function WorkoutPlanScreen({ planId }: WorkoutPlanScreenProps) {
  const router = useRouter();
  const { createTemplate, error, isCreatingTemplate, isLoading, plan, refetch } =
    useWorkoutPlan(planId);

  return (
    <AppScreen className="relative">
      <div className="mb-6 grid grid-cols-[1fr_auto] items-start gap-3">
        <ScreenHeader
          className="mb-0"
          title={plan?.name ?? "Plano de treino"}
          description="Treinos vinculados a este plano."
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

      {!isLoading && !error && plan?.templates.length === 0 ? (
        <EmptyState
          title="Nenhum treino criado"
          description="Crie um treino para começar a organizar este plano."
          icon={<Dumbbell className="size-6" />}
          action={
            <CreateWorkoutTemplateDialog
              isSubmitting={isCreatingTemplate}
              onCreate={createTemplate}
            >
              <Button>Criar treino</Button>
            </CreateWorkoutTemplateDialog>
          }
        />
      ) : null}

      {!isLoading && !error && plan?.templates.length ? (
        <section className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-foreground">Treinos</h2>
            <span className="text-xs text-muted-foreground">
              {plan.templates.length} treino
              {plan.templates.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid gap-2">
            {plan.templates.map((template) => (
              <Card key={template.id} className="border-border bg-transparent">
                <CardContent className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                    <Dumbbell className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {template.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Toque para ver exercícios
                    </p>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <CreateWorkoutTemplateDialog
        isSubmitting={isCreatingTemplate}
        onCreate={createTemplate}
      >
        <Button
          size="icon"
          className="absolute bottom-32 right-6 size-14 rounded-full shadow-none"
          aria-label="Criar treino"
        >
          <Plus className="size-7" />
        </Button>
      </CreateWorkoutTemplateDialog>
    </AppScreen>
  );
}
