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
import { useWorkoutPlans } from "@/features/workouts/components/workout-plans-provider";
import type { WorkoutPlanSummary } from "@/features/workouts/types";
import { getApiErrorMessage } from "@/lib/http";

type WorkoutPlanActionsProps = {
  isCurrent: boolean;
  plan: WorkoutPlanSummary;
};

export function WorkoutPlanActions({
  isCurrent,
  plan,
}: WorkoutPlanActionsProps) {
  const { setCurrentPlan, settingCurrentPlanId, updatePlanName } =
    useWorkoutPlans();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isSettingCurrent = settingCurrentPlanId === plan.id;

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

  async function handleSetCurrent() {
    setIsMenuOpen(false);
    await setCurrentPlan(plan.id);
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
      await updatePlanName(plan.id, name);
      setIsEditOpen(false);
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
          className="size-9 rounded-full"
          aria-label={`Ações do plano ${plan.name}`}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <MoreVertical className="size-5" />
        </Button>

        {isMenuOpen ? (
          <div className="absolute right-0 top-11 z-20 grid min-w-48 gap-1 rounded-md border border-border bg-background/95 p-1">
            <button
              type="button"
              className="rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isCurrent || isSettingCurrent}
              onClick={() => void handleSetCurrent()}
            >
              {isCurrent
                ? "Plano atual"
                : isSettingCurrent
                  ? "Salvando..."
                  : "Definir como atual"}
            </button>
            <button
              type="button"
              className="rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"
              onClick={() => {
                setIsMenuOpen(false);
                setError("");
                setIsEditOpen(true);
              }}
            >
              Editar nome
            </button>
          </div>
        ) : null}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar plano</DialogTitle>
            <DialogDescription>Atualize o nome deste plano.</DialogDescription>
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
              <Label htmlFor={`workout-plan-name-${plan.id}`}>
                Nome do plano
              </Label>
              <Input
                id={`workout-plan-name-${plan.id}`}
                name="name"
                defaultValue={plan.name}
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => setIsEditOpen(false)}
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
    </>
  );
}
