"use client";

import { Dumbbell, Home, LineChart, User } from "lucide-react";

import { BottomNav } from "@/components/ui/bottom-nav";
import { routes } from "@/lib/routes";

const items = [
  {
    href: routes.dashboard,
    label: "Home",
    icon: <Home />,
  },
  {
    href: routes.workouts,
    label: "Treinos",
    icon: <Dumbbell />,
  },
  {
    href: routes.progress,
    label: "Progresso",
    icon: <LineChart />,
  },
  {
    href: routes.profile,
    label: "Perfil",
    icon: <User />,
  },
];

export function AppBottomNav() {
  return <BottomNav items={items} />;
}
