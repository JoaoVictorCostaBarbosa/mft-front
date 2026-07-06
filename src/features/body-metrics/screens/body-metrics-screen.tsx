"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AppScreen } from "@/components/app/app-screen";
import { Button } from "@/components/ui/button";

import { BodyMetricsSection } from "../components/body-metrics-section";

export function BodyMetricsScreen() {
  const router = useRouter();

  return (
    <AppScreen>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.03em] text-foreground">
          Medidas corporais
        </h1>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 rounded-full"
          aria-label="Voltar"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-5" />
        </Button>
      </div>

      <BodyMetricsSection />
    </AppScreen>
  );
}
