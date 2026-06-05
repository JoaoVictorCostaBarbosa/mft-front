"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkoutPlans } from "@/features/workouts/components/workout-plans-provider";
import { routineModeLabels } from "@/features/workouts/constants";
import type { RoutineMode } from "@/features/workouts/types";
import { getApiErrorMessage } from "@/lib/http";

type CreateWorkoutPlanDialogProps = {
  children: React.ReactNode;
  onCreated?: () => void | Promise<void>;
};

export function CreateWorkoutPlanDialog({
  children,
  onCreated,
}: CreateWorkoutPlanDialogProps) {
  const { createPlan } = useWorkoutPlans();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [routineMode, setRoutineMode] = React.useState<RoutineMode>("weekly");

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    setError("");

    if (!isOpen) {
      setRoutineMode("weekly");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      setError("Informe um nome para o plano.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createPlan({ name, routine_mode: routineMode });
      await onCreated?.();
      setOpen(false);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo plano de treino</DialogTitle>
          <DialogDescription>
            Dê um nome simples para organizar seus treinos.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {error ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="workout-plan-name">Nome do plano</Label>
            <Input
              id="workout-plan-name"
              name="name"
              placeholder="Ex: Hipertrofia ABC"
              autoComplete="off"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <Label>Modo da rotina</Label>
            <Select
              value={routineMode}
              onValueChange={(value) => setRoutineMode(value as RoutineMode)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o modo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(routineModeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs leading-5 text-muted-foreground">
              Semanal usa dias da semana. Sequencial segue a ordem dos itens.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar plano"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
