"use client";

import { ArrowRight, Dumbbell, Flame, Heart, Trophy } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const goals = [
  { id: "muscle", label: "Ganhar massa", icon: <Dumbbell className="size-5" /> },
  { id: "loss", label: "Perder gordura", icon: <Flame className="size-5" /> },
  { id: "strength", label: "Ficar mais forte", icon: <Trophy className="size-5" /> },
  { id: "health", label: "Saúde geral", icon: <Heart className="size-5" /> },
];

export function OnboardingScreen() {
  const [selectedGoal, setSelectedGoal] = React.useState<string>("muscle");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 pt-16">
          <div
            className="flex size-[34px] items-center justify-center rounded-[11px] bg-primary"
            style={{ boxShadow: "0 4px 14px -4px var(--primary)" }}
          >
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="var(--primary-foreground)" strokeWidth="2.6"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M4 13l4-1 3 5 3-11 3 7h3" />
            </svg>
          </div>
          <span className="font-display text-[21px] font-bold tracking-[-0.02em] text-foreground">
            fittrack
          </span>
        </div>

        {/* Hero image placeholder */}
        <div className="mx-6 mt-7">
          <div
            className="flex h-48 items-center justify-center rounded-[20px] border border-border"
            style={{
              background: "repeating-linear-gradient(135deg,var(--secondary),var(--secondary) 11px,var(--track) 11px,var(--track) 22px)",
            }}
          >
            <span className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[11px] text-faint">
              hero · atleta treinando
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="px-6 pt-8">
          <h1 className="font-display text-[33px] font-bold leading-[1.08] tracking-[-0.035em] text-foreground">
            Cada série conta.<br />Acompanhe cada uma.
          </h1>
          <p className="mt-3.5 max-w-[320px] text-base leading-[1.5] text-muted-foreground">
            Registre treinos em segundos, veja sua evolução de verdade e bata seus recordes.
          </p>
        </div>

        {/* Goal selector */}
        <div className="px-6 pt-7">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-faint">
            Qual é o seu objetivo?
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {goals.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => setSelectedGoal(goal.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-[13px] border-[1.5px] px-3.5 py-3.5 text-left text-sm font-semibold tracking-[-0.01em] transition-colors",
                  selectedGoal === goal.id
                    ? "border-primary bg-accent-soft text-primary"
                    : "border-border bg-card text-foreground",
                )}
              >
                {goal.icon}
                <span>{goal.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-8" />

        {/* CTAs */}
        <div className="flex flex-col gap-3 px-6 pb-10 pt-6">
          <Link
            href={routes.signUp}
            className="flex h-[58px] items-center justify-center gap-2.5 rounded-[999px] bg-primary text-base font-semibold text-primary-foreground"
            style={{ boxShadow: "0 6px 16px -8px var(--primary)" }}
          >
            Começar agora
            <ArrowRight className="size-5 stroke-[2.2]" />
          </Link>
          <Link
            href={routes.signIn}
            className="flex h-10 items-center justify-center text-[15px] font-semibold text-muted-foreground"
          >
            Já tenho conta{" "}
            <span className="ml-1 text-primary">Entrar</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
