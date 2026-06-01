import { ChevronRight } from "lucide-react";

import { AppScreen } from "@/components/app/app-screen";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Edit profile",
  },
  {
    label: "My goals",
  },
  {
    label: "Settings",
  },
  {
    label: "Exit",
    danger: true,
  },
];

export function ProfileScreen() {
  return (
    <AppScreen>
      <EmptyState
        className="mb-6"
        title="Perfil não carregado"
        description="Os dados do usuário serão exibidos aqui após a requisição para /api/users/me."
      />

      <section className="grid w-full gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="secondary"
            className={cn(
              "h-14 justify-start rounded-lg px-4 text-base font-medium",
              action.danger && "text-destructive hover:text-destructive",
            )}
          >
            {action.label}
            <ChevronRight className="ml-auto size-4 opacity-60" />
          </Button>
        ))}
      </section>
    </AppScreen>
  );
}
