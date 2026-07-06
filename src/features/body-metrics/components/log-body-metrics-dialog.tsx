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

import { createBodyMetric } from "../api/body-metrics-api";
import type { CreateBodyMetricEntry } from "../types";

type MetricField = keyof CreateBodyMetricEntry;

type FieldConfig = {
  name: MetricField;
  label: string;
  min: number;
  max: number;
};

const primaryFields: FieldConfig[] = [
  { name: "weight", label: "Peso (kg)", min: 30, max: 400 },
  { name: "height", label: "Altura (cm)", min: 100, max: 272 },
];

const bodyPartFields: FieldConfig[] = [
  { name: "shoulders", label: "Ombros (cm)", min: 15, max: 250 },
  { name: "chest", label: "Peito (cm)", min: 15, max: 250 },
  { name: "waist", label: "Cintura (cm)", min: 15, max: 250 },
  { name: "hip", label: "Quadril (cm)", min: 15, max: 250 },
  { name: "left_arm", label: "Braço esq. (cm)", min: 15, max: 250 },
  { name: "right_arm", label: "Braço dir. (cm)", min: 15, max: 250 },
  { name: "left_forearm", label: "Antebraço esq. (cm)", min: 15, max: 250 },
  { name: "right_forearm", label: "Antebraço dir. (cm)", min: 15, max: 250 },
  { name: "left_quadriceps", label: "Coxa esq. (cm)", min: 15, max: 250 },
  { name: "right_quadriceps", label: "Coxa dir. (cm)", min: 15, max: 250 },
  { name: "left_calf", label: "Panturrilha esq. (cm)", min: 15, max: 250 },
  { name: "right_calf", label: "Panturrilha dir. (cm)", min: 15, max: 250 },
];

const allFields = [...primaryFields, ...bodyPartFields];

type LogBodyMetricsDialogProps = {
  children: React.ReactNode;
  onLogged?: () => void | Promise<void>;
};

export function LogBodyMetricsDialog({
  children,
  onLogged,
}: LogBodyMetricsDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showBodyParts, setShowBodyParts] = React.useState(false);

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    setError("");

    if (!isOpen) {
      setShowBodyParts(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload: CreateBodyMetricEntry = {};

    for (const field of allFields) {
      const rawValue = String(formData.get(field.name) ?? "")
        .trim()
        .replace(",", ".");

      if (!rawValue) {
        continue;
      }

      const value = Number(rawValue);

      if (!Number.isFinite(value)) {
        setError(`Valor inválido em "${field.label}".`);
        return;
      }

      if (value < field.min || value > field.max) {
        setError(
          `"${field.label}" deve estar entre ${field.min} e ${field.max}.`,
        );
        return;
      }

      payload[field.name] = value;
    }

    if (Object.keys(payload).length === 0) {
      setError("Preencha pelo menos uma medida.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createBodyMetric(payload);
      await onLogged?.();
      setOpen(false);
      setShowBodyParts(false);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar medidas</DialogTitle>
          <DialogDescription>
            Preencha apenas o que mediu hoje — todos os campos são opcionais.
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

          <div className="grid grid-cols-2 gap-3">
            {primaryFields.map((field) => (
              <div key={field.name} className="grid gap-2">
                <Label htmlFor={`body-metric-${field.name}`}>
                  {field.label}
                </Label>
                <Input
                  id={`body-metric-${field.name}`}
                  name={field.name}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="—"
                  disabled={isSubmitting}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowBodyParts((current) => !current)}
            className="text-left text-sm font-semibold text-primary"
            disabled={isSubmitting}
          >
            {showBodyParts
              ? "Ocultar medidas detalhadas"
              : "Adicionar medidas detalhadas (braços, cintura...)"}
          </button>

          {showBodyParts ? (
            <div className="grid grid-cols-2 gap-3">
              {bodyPartFields.map((field) => (
                <div key={field.name} className="grid gap-2">
                  <Label htmlFor={`body-metric-${field.name}`}>
                    {field.label}
                  </Label>
                  <Input
                    id={`body-metric-${field.name}`}
                    name={field.name}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="—"
                    disabled={isSubmitting}
                  />
                </div>
              ))}
            </div>
          ) : null}

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
              {isSubmitting ? "Salvando..." : "Salvar medidas"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
