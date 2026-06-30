"use client";

import { CalendarDays, Dumbbell, House, UserRound } from "lucide-react";

import { BottomNav } from "@/components/ui/bottom-nav";
import { routes } from "@/lib/routes";

const items = [
  {
    href: routes.dashboard,
    label: "Home",
    icon: <House />,
  },
  {
    href: routes.workouts,
    label: "Treinos",
    icon: <Dumbbell />,
  },
  {
    href: routes.progress,
    label: "Histórico",
    icon: <CalendarDays />,
  },
  {
    href: routes.profile,
    label: "Perfil",
    icon: <UserRound />,
  },
];

export function AppBottomNav() {
  return <BottomNav items={items} />;
}
