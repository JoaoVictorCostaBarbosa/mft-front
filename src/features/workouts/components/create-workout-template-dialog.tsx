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
import { getApiErrorMessage } from "@/lib/http";

type CreateWorkoutTemplateDialogProps = {
  children: React.ReactNode;
  isSubmitting?: boolean;
  onCreate: (name: string) => Promise<void>;
};

export function CreateWorkoutTemplateDialog({
  children,
  isSubmitting = false,
  onCreate,
}: CreateWorkoutTemplateDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      setError("Informe um nome para o treino.");
      return;
    }

    try {
      await onCreate(name);
      setOpen(false);
    } catch (error) {
      setError(getApiErrorMessage(error));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo treino</DialogTitle>
          <DialogDescription>
            Crie um treino dentro deste plano.
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
            <Label htmlFor="workout-template-name">Nome do treino</Label>
            <Input
              id="workout-template-name"
              name="name"
              placeholder="Ex: Peito e tríceps"
              autoComplete="off"
              disabled={isSubmitting}
            />
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
              {isSubmitting ? "Criando..." : "Criar treino"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
