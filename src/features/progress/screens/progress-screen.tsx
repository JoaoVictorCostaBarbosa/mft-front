"use client";

import { CalendarDays, ChevronLeft, ChevronRight, Clock, Dumbbell } from "lucide-react";
import * as React from "react";

import { AppScreen } from "@/components/app/app-screen";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { BodyMetricsSection } from "@/features/body-metrics";
import { useWorkoutSessionHistory } from "@/features/workout-sessions";
import type { WorkoutSessionHistoryItem } from "@/features/workout-sessions";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"];

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;

  const cells: Array<{ day: number | null }> = [];
  for (let i = 0; i < startDow; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });

  return cells;
}

function isInMonth(isoDate: string, year: number, month: number) {
  const date = new Date(isoDate);
  return date.getFullYear() === year && date.getMonth() === month;
}

function formatSessionDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date(isoDate));
}

function formatVolume(volumeKg: number) {
  if (volumeKg >= 1000) {
    const formatted = new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: 1,
    }).format(volumeKg / 1000);
    return `${formatted} t`;
  }

  const formatted = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(volumeKg);
  return `${formatted} kg`;
}

function formatSessionDetails(item: WorkoutSessionHistoryItem) {
  const details = [formatSessionDate(item.started_at)];

  if (item.total_sets > 0) {
    details.push(`${item.total_sets} série${item.total_sets === 1 ? "" : "s"}`);
  }

  if (item.total_volume_kg > 0) {
    details.push(formatVolume(item.total_volume_kg));
  }

  return details.join(" · ");
}

function formatDuration(item: WorkoutSessionHistoryItem) {
  if (!item.finished_at) {
    return "Em andamento";
  }

  const elapsedMinutes = Math.max(
    Math.round(
      (new Date(item.finished_at).getTime() -
        new Date(item.started_at).getTime()) /
        60_000,
    ),
    0,
  );

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} min`;
  }

  const hours = Math.floor(elapsedMinutes / 60);
  const minutes = elapsedMinutes % 60;

  return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
}

export function ProgressScreen() {
  const today = new Date();
  const [viewYear, setViewYear] = React.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(today.getMonth());
  const { items, error, isLoading, refetch } = useWorkoutSessionHistory();

  const todayDay = today.getDate();
  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const monthSessions = React.useMemo(
    () =>
      items
        .filter((item) => isInMonth(item.started_at, viewYear, viewMonth))
        .sort(
          (first, second) =>
            new Date(second.started_at).getTime() -
            new Date(first.started_at).getTime(),
        ),
    [items, viewMonth, viewYear],
  );

  const trainedDays = React.useMemo(
    () =>
      new Set(
        monthSessions.map((item) => new Date(item.started_at).getDate()),
      ),
    [monthSessions],
  );

  const calendarCells = React.useMemo(
    () => buildCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })
    .format(new Date(viewYear, viewMonth, 1))
    .replace(/^\w/, (c) => c.toUpperCase());

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  return (
    <AppScreen>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.03em] text-foreground">
          Histórico
        </h1>
      </div>

      {/* Calendar card */}
      <div
        className="mb-[22px] rounded-[20px] border border-border bg-card p-[18px]"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Month nav */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={prevMonth}
            className="flex size-8 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="size-[18px]" />
          </button>
          <span className="font-display text-base font-bold tracking-[-0.02em] text-foreground">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="flex size-8 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground"
            aria-label="Próximo mês"
          >
            <ChevronRight className="size-[18px]" />
          </button>
        </div>

        {/* Weekday labels */}
        <div className="mb-1.5 grid grid-cols-7 gap-1.5">
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={i} className="text-center text-[10.5px] font-bold text-faint">
              {label}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarCells.map((cell, i) => {
            if (!cell.day) {
              return <div key={`empty-${i}`} />;
            }
            const isToday = isCurrentMonth && cell.day === todayDay;
            const hasWorkout = trainedDays.has(cell.day);
            return (
              <div
                key={cell.day}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-[9px] text-[12.5px] font-semibold border-[1.5px]",
                  hasWorkout
                    ? "border-primary bg-primary text-primary-foreground"
                    : isToday
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground",
                )}
              >
                {cell.day}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3.5 flex items-center gap-2 border-t border-border pt-3.5">
          <span className="size-3 rounded-[4px] bg-primary" />
          <span className="text-xs font-semibold text-muted-foreground">
            Dia com treino · {trainedDays.size} este mês
          </span>
        </div>
      </div>

      {/* Workout feed */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[17px] font-bold tracking-[-0.02em] text-foreground">
          Treinos do mês
        </h3>
        {monthSessions.length ? (
          <span className="text-xs font-semibold text-muted-foreground">
            {monthSessions.length} treino{monthSessions.length === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          <Skeleton className="h-[72px] rounded-[20px]" />
          <Skeleton className="h-[72px] rounded-[20px]" />
        </div>
      ) : error ? (
        <ErrorState
          title="Não foi possível carregar o histórico"
          description={error}
          action={
            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded-full border border-primary bg-accent-soft px-4 py-2 text-sm font-semibold text-primary"
            >
              Tentar novamente
            </button>
          }
        />
      ) : monthSessions.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="size-6" />}
          title="Sem treinos neste mês"
          description="Seus treinos concluídos aparecerão aqui com duração, séries e volume."
        />
      ) : (
        <div className="grid gap-2.5">
          {monthSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-3.5 rounded-[20px] border border-border bg-card px-[18px] py-4"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[13px] bg-accent-soft text-primary">
                <Dumbbell className="size-[21px]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-foreground">
                  {session.workout_template.name}
                </p>
                <p className="mt-0.5 text-[13px] font-medium text-muted-foreground">
                  {formatSessionDetails(session)}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-muted-foreground">
                <Clock className="size-[15px]" />
                {formatDuration(session)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-[26px]">
        <BodyMetricsSection />
      </div>
    </AppScreen>
  );
}
