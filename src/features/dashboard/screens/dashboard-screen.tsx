import { AppScreen } from "@/components/app/app-screen";
import { ScreenHeader } from "@/components/app/screen-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function DashboardScreen() {
  return (
    <AppScreen>
      <ScreenHeader
        title="Dashboard"
        description="Seu resumo aparecerá aqui quando houver dados registrados."
      />

      <EmptyState
        title="Nenhum dado ainda"
        description="Quando a API retornar seu treino do dia, sequência e resumo semanal, tudo será exibido aqui."
        action={<Button>Atualizar</Button>}
      />

      <section className="mt-5 grid grid-cols-2 gap-3">
        <Button variant="secondary" className="h-12 justify-start text-xs">
          Medidas
        </Button>
        <Button variant="secondary" className="h-12 justify-start text-xs">
          Treino livre
        </Button>
      </section>
    </AppScreen>
  );
}
