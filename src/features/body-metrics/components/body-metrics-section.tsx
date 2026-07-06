"use client";

import { Plus, Ruler, Trash2 } from "lucide-react";
import * as React from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/http";
import { cn } from "@/lib/utils";

import { deleteBodyMetric } from "../api/body-metrics-api";
import { useBodyMetrics } from "../hooks/use-body-metrics";
import type { BodyMetricEntry } from "../types";
import { LogBodyMetricsDialog } from "./log-body-metrics-dialog";

const entrySummaryFields: Array<{
  key: keyof BodyMetricEntry;
  label: string;
  unit: string;
}> = [
  { key: "weight", label: "Peso", unit: "kg" },
  { key: "height", label: "Altura", unit: "cm" },
  { key: "waist", label: "Cintura", unit: "cm" },
  { key: "chest", label: "Peito", unit: "cm" },
  { key: "hip", label: "Quadril", unit: "cm" },
  { key: "shoulders", label: "Ombros", unit: "cm" },
  { key: "left_arm", label: "Braço E", unit: "cm" },
  { key: "right_arm", label: "Braço D", unit: "cm" },
  { key: "left_forearm", label: "Anteb. E", unit: "cm" },
  { key: "right_forearm", label: "Anteb. D", unit: "cm" },
  { key: "left_quadriceps", label: "Coxa E", unit: "cm" },
  { key: "right_quadriceps", label: "Coxa D", unit: "cm" },
  { key: "left_calf", label: "Pant. E", unit: "cm" },
  { key: "right_calf", label: "Pant. D", unit: "cm" },
];

function formatEntryDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

function formatValue(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 1,
  }).format(value);
}

function getWeightTrend(entries: BodyMetricEntry[]) {
  const withWeight = entries.filter((entry) => entry.weight !== undefined);

  if (withWeight.length === 0) {
    return null;
  }

  // Lista chega ordenada do mais recente para o mais antigo.
  const latest = withWeight[0];
  const previous = withWeight[1];

  return {
    latestWeight: latest.weight as number,
    latestDate: latest.created_at,
    delta:
      previous?.weight !== undefined
        ? (latest.weight as number) - previous.weight
        : null,
  };
}

export function BodyMetricsSection() {
  const { entries, error, isLoading, refetch } = useBodyMetrics();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const weightTrend = getWeightTrend(entries);

  async function handleDelete(entryId: string) {
    setDeletingId(entryId);

    try {
      await deleteBodyMetric(entryId);
      await refetch();
      toast({ title: "Registro de medidas excluído" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha ao excluir registro",
        description: getApiErrorMessage(error),
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[17px] font-bold tracking-[-0.02em] text-foreground">
          Medidas corporais
        </h3>
        <LogBodyMetricsDialog onLogged={refetch}>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-primary bg-accent-soft px-3.5 py-2 text-[13px] font-semibold text-primary"
          >
            <Plus className="size-4" />
            Registrar
          </button>
        </LogBodyMetricsDialog>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          <Skeleton className="h-[76px] rounded-[20px]" />
          <Skeleton className="h-[76px] rounded-[20px]" />
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-[20px] border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<Ruler className="size-6" />}
          title="Nenhuma medida registrada"
          description="Registre peso, altura e medidas corporais para acompanhar sua evolução."
        />
      ) : (
        <div className="grid gap-3">
          {weightTrend ? (
            <div
              className="flex items-center justify-between rounded-[20px] border border-border bg-card px-[18px] py-4"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div>
                <p className="text-[12.5px] font-semibold text-muted-foreground">
                  Peso atual
                </p>
                <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
                  {formatValue(weightTrend.latestWeight)} kg
                </p>
              </div>
              {weightTrend.delta !== null ? (
                <span
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[13px] font-semibold",
                    weightTrend.delta > 0
                      ? "bg-destructive/10 text-destructive"
                      : "bg-accent-soft text-primary",
                  )}
                >
                  {weightTrend.delta > 0 ? "+" : ""}
                  {formatValue(weightTrend.delta)} kg
                </span>
              ) : null}
            </div>
          ) : null}

          {entries.map((entry) => {
            const filledFields = entrySummaryFields.filter(
              (field) => entry[field.key] !== undefined,
            );

            return (
              <div
                key={entry.id}
                className="rounded-[20px] border border-border bg-card px-[18px] py-4"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-[13px] font-bold text-foreground">
                    {formatEntryDate(entry.created_at)}
                  </p>
                  <button
                    type="button"
                    aria-label="Excluir registro"
                    disabled={deletingId === entry.id}
                    onClick={() => void handleDelete(entry.id)}
                    className="flex size-8 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {filledFields.map((field) => (
                    <span
                      key={field.key}
                      className="text-[13px] font-medium text-muted-foreground"
                    >
                      {field.label}:{" "}
                      <span className="font-semibold text-foreground">
                        {formatValue(entry[field.key] as number)} {field.unit}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
