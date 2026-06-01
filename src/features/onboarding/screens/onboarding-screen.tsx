"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AppLogo } from "@/components/app/app-logo";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Treinos organizados, sem ruído.",
    description:
      "Monte sua rotina, registre séries e acompanhe carga sem perder o foco no treino.",
    metric: "01",
  },
  {
    title: "Progresso fácil de enxergar.",
    description:
      "Veja frequência, volume e medidas em gráficos simples para tomar decisões melhores.",
    metric: "02",
  },
  {
    title: "Metas claras para evoluir.",
    description: "Defina objetivos, ajuste o plano e mantenha consistência semana após semana.",
    metric: "03",
  },
];

export function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-5 pb-8 pt-[calc(env(safe-area-inset-top)+1rem)]">
      <div className="flex items-center justify-between">
        <AppLogo textClassName="text-lg" markClassName="size-7" />
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
          <Link href={routes.signIn}>Pular</Link>
        </Button>
      </div>

      <section className="flex flex-1 flex-col justify-center gap-8 py-8">
        <div className="grid gap-5 border-y border-border py-10">
          <span className="text-sm font-medium text-primary">
            Passo {slide.metric}
          </span>
          <div className="h-px w-16 bg-primary" />
          <p className="max-w-[16rem] text-5xl font-bold leading-tight tracking-tight text-foreground">
            {slide.title}
          </p>
        </div>

        <div className="grid gap-3">
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            {slide.description}
          </p>
        </div>
      </section>

      <footer className="grid gap-5">
        <div className="flex items-center justify-center gap-2">
          {slides.map((item, index) => (
            <span
              key={item.title}
              className={cn(
                "h-2 w-2 rounded-full bg-secondary transition-all",
                index === currentSlide && "w-8 bg-primary",
              )}
            />
          ))}
        </div>

        {isLastSlide ? (
          <div className="grid gap-3">
            <Button asChild className="h-12 rounded-lg text-base">
              <Link href={routes.signIn}>Começar evolução</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => setCurrentSlide((slide) => Math.max(slide - 1, 0))}
            >
              <ChevronLeft />
              Voltar
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide((slide) => Math.max(slide - 1, 0))}
            >
              <ChevronLeft />
              Voltar
            </Button>
            <Button
              type="button"
              onClick={() =>
                setCurrentSlide((slide) => Math.min(slide + 1, slides.length - 1))
              }
            >
              Próximo
              <ChevronRight />
            </Button>
          </div>
        )}
      </footer>
    </main>
  );
}
