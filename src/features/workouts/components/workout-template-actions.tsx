"use client";

import { MoreVertical } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import type {
  DayOfWeek,
  RoutineItemType,
  RoutineMode,
  WorkoutTemplateSummary,
} from "@/features/workouts/types";
import { getApiErrorMessage } from "@/lib/http";

type WorkoutTemplateActionsProps = {
  itemId: string;
  itemType: RoutineItemType;
  onDelete: (routineItemId: string) => Promise<void>;
  onRename: (templateId: string, name: string) => Promise<void>;
  onUpdateSchedule: (
    routineItemId: string,
    payload: { dayOfWeek: DayOfWeek } | { position: number },
  ) => Promise<void>;
  routineMode: RoutineMode;
  scheduledDay?: DayOfWeek | null;
  scheduledPosition?: number | null;
  template?: WorkoutTemplateSummary | null;
};

export function WorkoutTemplateActions({
  itemId,
  itemType,
  onDelete,
  onRename,
  onUpdateSchedule,
  routineMode,
  scheduledDay = null,
  scheduledPosition = null,
  template,
}: WorkoutTemplateActionsProps) {
  const itemLabel = itemType === "workout" ? "treino" : "descanso";
  const itemName = template?.name ?? "Descanso";
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isRenameOpen, setIsRenameOpen] = React.useState(false);
  const [isDayOpen, setIsDayOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [dayOfWeek, setDayOfWeek] = React.useState<DayOfWeek>(
    scheduledDay ?? "sunday",
  );
  const [position, setPosition] = React.useState(scheduledPosition ?? 1);

  React.useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  async function handleRenameSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    if (!template) {
      setError("Este item não possui treino para renomear.");
      return;
    }

    if (!name) {
      setError("Informe um nome para o treino.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onRename(template.id, name);
      setIsRenameOpen(false);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    setIsSubmitting(true);
    setError("");

    try {
      await onDelete(itemId);
      setIsDeleteOpen(false);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleScheduleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (routineMode === "sequential" && position < 1) {
      setError("Informe uma posição válida.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdateSchedule(
        itemId,
        routineMode === "weekly" ? { dayOfWeek } : { position },
      );
      setIsDayOpen(false);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div ref={menuRef} className="relative">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 rounded-full"
          aria-label={`Ações do ${itemLabel} ${itemName}`}
          aria-expanded={isMenuOpen}
          disabled={isSubmitting}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <MoreVertical className="size-5" />
        </Button>

        {isMenuOpen ? (
          <div className="absolute right-0 top-11 z-20 grid min-w-48 gap-1 rounded-md border border-border bg-background/95 p-1">
            {template ? (
              <button
                type="button"
                className="rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                onClick={() => {
                  setIsMenuOpen(false);
                  setError("");
                  setIsRenameOpen(true);
                }}
              >
                Trocar nome
              </button>
            ) : null}
            <button
              type="button"
              className="rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"
              onClick={() => {
                setIsMenuOpen(false);
                setError("");
                setDayOfWeek(scheduledDay ?? "sunday");
                setPosition(scheduledPosition ?? 1);
                setIsDayOpen(true);
              }}
            >
              {routineMode === "weekly" ? "Trocar dia" : "Trocar posição"}
            </button>
            <button
              type="button"
              className="rounded-sm px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
              onClick={() => {
                setIsMenuOpen(false);
                setError("");
                setIsDeleteOpen(true);
              }}
            >
              Apagar {itemLabel}
            </button>
          </div>
        ) : null}
      </div>

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar treino</DialogTitle>
            <DialogDescription>Atualize o nome deste treino.</DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleRenameSubmit}>
            {error ? (
              <div
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </div>
            ) : null}

            <div className="grid gap-2">
              <Label htmlFor={`workout-template-name-${itemId}`}>
                Nome do treino
              </Label>
              <Input
                id={`workout-template-name-${itemId}`}
                name="name"
                defaultValue={template?.name}
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => setIsRenameOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDayOpen} onOpenChange={setIsDayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {routineMode === "weekly" ? "Trocar dia" : "Trocar posição"}
            </DialogTitle>
            <DialogDescription>
              Ajuste onde este item entra na rotina.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleScheduleSubmit}>
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
                <Label>Posição</Label>
                <Input
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
                onClick={() => setIsDayOpen(false)}
              >
                Fechar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bottom-0 top-auto w-full max-w-none translate-y-0 rounded-b-none rounded-t-lg sm:bottom-auto sm:top-1/2 sm:max-w-lg sm:-translate-y-1/2 sm:rounded-lg">
          <DialogHeader>
            <DialogTitle>Apagar {itemLabel}?</DialogTitle>
            <DialogDescription>
              Essa ação remove este item da rotina e não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {error ? (
              <div
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </div>
            ) : null}

            <div className="rounded-md border border-border px-3 py-2">
              <p className="truncate text-sm font-semibold text-foreground">
                {itemName}
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isSubmitting}
                onClick={() => void handleDeleteConfirm()}
              >
                {isSubmitting ? "Apagando..." : "Apagar"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
