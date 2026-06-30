"use client";

import { Bell, ChevronRight, CircleHelp, LogOut, Monitor, Moon, Pencil, Ruler, Settings, Sun, Target } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

import { AppScreen } from "@/components/app/app-screen";
import { useAuthSession } from "@/features/auth";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type ThemeOption = "system" | "light" | "dark";

const themeOptions: Array<{ value: ThemeOption; label: string; icon: React.ReactNode }> = [
  { value: "system", label: "Auto", icon: <Monitor className="size-[17px]" /> },
  { value: "light", label: "Claro", icon: <Sun className="size-[17px]" /> },
  { value: "dark", label: "Escuro", icon: <Moon className="size-[17px]" /> },
];

const settingsItems = [
  { label: "Metas e objetivos", icon: <Target className="size-[18px]" /> },
  { label: "Unidades · kg / cm", icon: <Ruler className="size-[18px]" /> },
  { label: "Notificações", icon: <Bell className="size-[18px]" /> },
  { label: "Ajuda e suporte", icon: <CircleHelp className="size-[18px]" /> },
];

function getInitials(name?: string | null) {
  if (!name) return "U";
  const [first, second] = name.trim().split(/\s+/);
  return `${first?.[0] ?? ""}${second?.[0] ?? ""}`.toUpperCase();
}

export function ProfileScreen() {
  const router = useRouter();
  const { user, clearSession } = useAuthSession();
  const { theme, setTheme } = useTheme();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await clearSession();
    router.replace(routes.signIn);
  }

  return (
    <AppScreen>
      {/* Header */}
      <div className="mb-[22px] flex items-center justify-between">
        <h1 className="font-display text-[28px] font-bold tracking-[-0.03em] text-foreground">
          Perfil
        </h1>
        <button
          type="button"
          className="flex size-[42px] items-center justify-center rounded-full border border-border bg-card text-foreground"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <Settings className="size-[21px]" />
        </button>
      </div>

      {/* Identity */}
      <div className="mb-[22px] flex items-center gap-4">
        <div className="flex size-[72px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-primary bg-accent-soft font-display text-[28px] font-semibold text-primary">
          {getInitials(user?.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[21px] font-bold tracking-[-0.02em] text-foreground truncate">
            {user?.name ?? "Usuário"}
          </p>
          <p className="mt-0.5 text-[13.5px] font-medium text-muted-foreground">
            {user?.email ?? ""}
          </p>
        </div>
        <button
          type="button"
          className="flex size-[38px] shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-foreground"
        >
          <Pencil className="size-[17px]" />
        </button>
      </div>

      {/* Stats bar */}
      <div
        className="mb-[26px] overflow-hidden rounded-[20px] border border-border bg-card"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex">
          {[
            { label: "Treinos", value: "—" },
            { label: "Sequência", value: "—" },
            { label: "Recordes", value: "—" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "flex-1 py-4 text-center",
                i > 0 && "border-l border-border",
              )}
            >
              <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[12.5px] font-semibold text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <h3 className="mb-3 font-display text-[17px] font-bold tracking-[-0.02em] text-foreground">
        Aparência
      </h3>
      <div
        className="mb-[26px] rounded-[20px] border border-border bg-card p-1.5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex gap-1.5">
          {themeOptions.map((option) => {
            const isActive = theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-[14px] border-[1.5px] py-3 text-[13.5px] font-semibold transition-colors",
                  isActive
                    ? "border-primary bg-accent-soft text-primary"
                    : "border-transparent bg-transparent text-muted-foreground",
                )}
              >
                {option.icon}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings list */}
      <div
        className="mb-5 overflow-hidden rounded-[20px] border border-border bg-card"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {settingsItems.map((item, i) => (
          <button
            key={item.label}
            type="button"
            className={cn(
              "flex w-full items-center gap-3.5 px-4 py-[15px] text-left",
              i < settingsItems.length - 1 && "border-b border-border",
            )}
          >
            <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] border border-border bg-secondary text-muted-foreground">
              {item.icon}
            </div>
            <span className="flex-1 text-[15px] font-semibold text-foreground">
              {item.label}
            </span>
            <ChevronRight className="size-[18px] text-faint" />
          </button>
        ))}
      </div>

      {/* Sign out */}
      <button
        type="button"
        disabled={isSigningOut}
        onClick={() => void handleSignOut()}
        className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[999px] border border-destructive/40 bg-transparent text-[15.5px] font-semibold text-destructive transition-colors hover:bg-destructive/5 disabled:opacity-50"
      >
        <LogOut className="size-[19px] stroke-[2.2]" />
        {isSigningOut ? "Saindo..." : "Sair da conta"}
      </button>
    </AppScreen>
  );
}
