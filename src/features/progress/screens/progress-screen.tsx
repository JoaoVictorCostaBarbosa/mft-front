import { AppScreen } from "@/components/app/app-screen";
import { ScreenHeader } from "@/components/app/screen-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProgressScreen() {
  return (
    <AppScreen>
      <ScreenHeader title="Progresso" description="Evolução em treinos e medidas." />

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
        </TabsList>
      </Tabs>

      <EmptyState
        title="Sem histórico por enquanto"
        description="Gráficos de treinos, exercícios e medidas aparecerão quando houver dados retornados pela API."
      />
    </AppScreen>
  );
}
