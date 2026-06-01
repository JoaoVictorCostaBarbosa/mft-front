import { ChevronRight, Plus } from "lucide-react";

import { AppScreen } from "@/components/app/app-screen";
import { ScreenHeader } from "@/components/app/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export function WorkoutsScreen() {
  return (
    <AppScreen className="relative">
      <ScreenHeader title="Treinos" description="Planos, fichas e exercícios." />

      <Card className="mb-5 border-border bg-transparent">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div>
              <h2 className="text-sm font-semibold text-foreground">
                Biblioteca de exercícios
              </h2>
              <p className="text-xs text-muted-foreground">
                Filtre por músculo, tipo e equipamento.
              </p>
          </div>
          <ChevronRight className="size-5 text-muted-foreground" />
        </CardContent>
      </Card>

      <EmptyState
        title="Nenhum plano cadastrado"
        description="Os planos e modelos de treino retornados pela API serão listados aqui."
        action={<Button>Criar plano</Button>}
      />

      <Button
        size="icon"
        className="absolute bottom-32 right-6 size-14 rounded-full shadow-[0_0_28px_rgba(0,229,229,0.75)]"
        aria-label="Criar treino"
      >
        <Plus className="size-7" />
      </Button>
    </AppScreen>
  );
}
