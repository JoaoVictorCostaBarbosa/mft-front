import { Activity, Dumbbell, LineChart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/ui/page-header";
import { appConfig } from "@/config/app";

const highlights = [
  {
    title: "Treinos",
    description: "Organize exercícios, séries e evolução de carga.",
    icon: Dumbbell,
  },
  {
    title: "Métricas",
    description: "Acompanhe medidas corporais e progresso físico.",
    icon: Activity,
  },
  {
    title: "Evolução",
    description: "Visualize consistência e tendências ao longo do tempo.",
    icon: LineChart,
  },
];

export function HomeScreen() {
  return (
    <PageContainer className="justify-center gap-6">
      <PageHeader className="text-left">
        <Badge className="w-fit" variant="outline">
          Em construção
        </Badge>
        <PageHeaderTitle className="text-4xl">{appConfig.name}</PageHeaderTitle>
        <PageHeaderDescription>
          {appConfig.description}
        </PageHeaderDescription>
      </PageHeader>

      <section className="grid gap-3">
        {highlights.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex-row items-start gap-3 space-y-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                <item.icon className="size-5" />
              </div>
              <div className="grid gap-1">
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="hidden" />
          </Card>
        ))}
      </section>
    </PageContainer>
  );
}
