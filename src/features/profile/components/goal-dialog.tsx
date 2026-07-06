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
import { toast } from "@/components/ui/toast";
import { useAuthSession, type UserGoal } from "@/features/auth";
import { updateUserGoal } from "@/features/profile/api/profile-api";
import { goalOptions } from "@/features/profile/lib/goals";
import { getApiErrorMessage } from "@/lib/http";
import { cn } from "@/lib/utils";

type GoalDialogProps = {
  children: React.ReactNode;
};

export function GoalDialog({ children }: GoalDialogProps) {
  const { user, setAuthenticatedUser } = useAuthSession();
  const [open, setOpen] = React.useState(false);
  const [selectedGoal, setSelectedGoal] = React.useState<UserGoal | null>(null);
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);

    if (isOpen) {
      setSelectedGoal(user?.goal ?? null);
      setError("");
    }
  }

  async function handleSave() {
    if (!selectedGoal) {
      setError("Escolha um objetivo.");
      return;
    }

    if (selectedGoal === user?.goal) {
      setOpen(false);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const updatedUser = await updateUserGoal(selectedGoal);
      setAuthenticatedUser(updatedUser);
      toast({
        title: "Objetivo atualizado",
        description: "Seu objetivo de treino foi salvo.",
      });
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
          <DialogTitle>Metas e objetivos</DialogTitle>
          <DialogDescription>
            Qual é o seu objetivo principal de treino?
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2.5">
          {goalOptions.map((option) => {
            const Icon = option.icon;

            return (
              <button
                key={option.id}
                type="button"
                disabled={isSubmitting}
                onClick={() => setSelectedGoal(option.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-[13px] border-[1.5px] px-3.5 py-3.5 text-left text-sm font-semibold tracking-[-0.01em] transition-colors",
                  selectedGoal === option.id
                    ? "border-primary bg-accent-soft text-primary"
                    : "border-border bg-card text-foreground",
                )}
              >
                <Icon className="size-5" />
                <span>{option.label}</span>
              </button>
            );
          })}
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
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSave()}
          >
            {isSubmitting ? "Salvando..." : "Salvar objetivo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
