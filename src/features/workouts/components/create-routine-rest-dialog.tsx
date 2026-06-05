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
import { dayOfWeekOptions } from "@/features/workouts/constants";
import type { DayOfWeek, RoutineMode } from "@/features/workouts/types";
import { ApiError, getApiErrorMessage } from "@/lib/http";

const defaultDayOfWeek: DayOfWeek = "sunday";

type CreateRoutineRestDialogProps = {
  children: React.ReactNode;
  isSubmitting?: boolean;
  nextPosition?: number;
  onCreate: (
    payload: { dayOfWeek: DayOfWeek } | { position: number },
  ) => Promise<void>;
  routineMode: RoutineMode;
};

export function CreateRoutineRestDialog({
  children,
  isSubmitting = false,
  nextPosition = 1,
  onCreate,
  routineMode,
}: CreateRoutineRestDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [dayOfWeek, setDayOfWeek] =
    React.useState<DayOfWeek>(defaultDayOfWeek);
  const [position, setPosition] = React.useState(nextPosition);

  function resetForm() {
    setDayOfWeek(defaultDayOfWeek);
    setPosition(nextPosition);
    setError("");
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    setError("");

    if (!isOpen) {
      resetForm();
    }
  }

  React.useEffect(() => {
    if (open) {
      setPosition(nextPosition);
    }
  }, [nextPosition, open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (routineMode === "sequential" && position < 1) {
      setError("Informe uma posição válida.");
      return;
    }

    try {
      await onCreate(
        routineMode === "weekly" ? { dayOfWeek } : { position },
      );
      resetForm();
      setOpen(false);
    } catch (error) {
      setError(getCreateRestErrorMessage(error, routineMode));
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo descanso</DialogTitle>
          <DialogDescription>
            Adicione um dia ou posição de descanso à rotina.
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

          {routineMode === "weekly" ? (
            <div className="grid gap-2">
              <Label>Dia da semana</Label>
              <Select
                value={dayOfWeek}
                onValueChange={(value) => setDayOfWeek(value as DayOfWeek)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um dia" />
                </SelectTrigger>
                <SelectContent>
                  {dayOfWeekOptions.map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="routine-rest-position">Posição</Label>
              <Input
                id="routine-rest-position"
                type="number"
                min={1}
                value={position}
                onChange={(event) =>
                  setPosition(Number(event.currentTarget.value))
                }
                disabled={isSubmitting}
              />
            </div>
          )}

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
              {isSubmitting ? "Criando..." : "Criar descanso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function getCreateRestErrorMessage(error: unknown, routineMode: RoutineMode) {
  if (error instanceof ApiError && error.status === 409) {
    return routineMode === "weekly"
      ? "Já existe um item para este dia."
      : "Já existe um item nesta posição da rotina.";
  }

  return getApiErrorMessage(error);
}
