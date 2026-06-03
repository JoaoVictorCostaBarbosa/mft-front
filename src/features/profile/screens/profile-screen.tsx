"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AppScreen } from "@/components/app/app-screen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthSession } from "@/features/auth";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Editar perfil",
  },
  {
    label: "Meus objetivos",
  },
  {
    label: "Configurações",
  },
];

function getInitials(name?: string | null) {
  if (!name) {
    return "U";
  }

  const [firstName, secondName] = name.trim().split(/\s+/);
  return `${firstName?.[0] ?? ""}${secondName?.[0] ?? ""}`.toUpperCase();
}

export function ProfileScreen() {
  const router = useRouter();
  const { user, clearSession } = useAuthSession();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await clearSession();
    router.replace(routes.signIn);
  }

  return (
    <AppScreen>
      <section className="mb-6 rounded-xl border border-border bg-transparent p-5">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-xl font-extrabold text-primary">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold text-foreground">
              {user?.name ?? "Usuário"}
            </h1>
            <p className="truncate text-sm text-muted-foreground">
              {user?.email ?? "E-mail não disponível"}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Card className="border-border bg-transparent p-3">
            <p className="text-xs text-muted-foreground">Perfil</p>
            <p className="font-semibold text-foreground">
              {user?.role === "Admin" ? "Admin" : "Usuário"}
            </p>
          </Card>
          <Card className="border-border bg-transparent p-3">
            <p className="text-xs text-muted-foreground">Conta</p>
            <p className="font-semibold text-foreground">Ativa</p>
          </Card>
        </div>
      </section>

      <section className="grid w-full gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="secondary"
            className="h-14 justify-start rounded-lg px-4 text-base font-medium"
          >
            {action.label}
            <ChevronRight className="ml-auto size-4 opacity-60" />
          </Button>
        ))}

        <Button
          variant="secondary"
          className={cn(
            "h-14 justify-start rounded-lg px-4 text-base font-medium text-destructive hover:text-destructive",
          )}
          disabled={isSigningOut}
          onClick={handleSignOut}
        >
          {isSigningOut ? "Saindo..." : "Sair"}
        </Button>
      </section>
    </AppScreen>
  );
}
