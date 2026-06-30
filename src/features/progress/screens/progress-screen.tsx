"use client";

import { CalendarDays, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import * as React from "react";

import { AppScreen } from "@/components/app/app-screen";
import { EmptyState } from "@/components/ui/empty-state";
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

export function ProgressScreen() {
  const today = new Date();
  const [viewYear, setViewYear] = React.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(today.getMonth());

  const todayDay = today.getDate();
  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

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
        <button
          type="button"
          className="flex size-[42px] items-center justify-center rounded-full border border-border bg-card text-foreground"
          style={{ boxShadow: "var(--shadow-card)" }}
          aria-label="Filtros"
        >
          <SlidersHorizontal className="size-[19px]" />
        </button>
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
            return (
              <div
                key={cell.day}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-[9px] text-[12.5px] font-semibold border-[1.5px]",
                  isToday
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
            Dia com treino · 0 este mês
          </span>
        </div>
      </div>

      {/* Workout feed */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[17px] font-bold tracking-[-0.02em] text-foreground">
          Treinos do mês
        </h3>
      </div>

      <EmptyState
        icon={<CalendarDays className="size-6" />}
        title="Sem treinos registrados"
        description="Seus treinos concluídos aparecerão aqui com duração, séries e volume."
      />
    </AppScreen>
  );
}
