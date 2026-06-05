"use client";

import { Dumbbell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/features/auth";
import { getCurrentWorkoutSession } from "@/features/workout-sessions/api/workout-sessions-api";
import type { CurrentWorkoutSession } from "@/features/workout-sessions/types";
import { ApiError } from "@/lib/http";
import { routes } from "@/lib/routes";

type ActiveWorkoutContextValue = {
  currentSession: CurrentWorkoutSession | null;
  isLoading: boolean;
  refetchCurrentSession: () => Promise<void>;
};

const ActiveWorkoutContext =
  React.createContext<ActiveWorkoutContextValue | null>(null);

type ActiveWorkoutProviderProps = {
  children: React.ReactNode;
};

export function ActiveWorkoutProvider({
  children,
}: ActiveWorkoutProviderProps) {
  const pathname = usePathname();
  const { status } = useAuthSession();
  const [currentSession, setCurrentSession] =
    React.useState<CurrentWorkoutSession | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchCurrentSession = React.useCallback(async () => {
    if (status !== "authenticated") {
      setCurrentSession(null);
      return;
    }

    setIsLoading(true);

    try {
      const session = await getCurrentWorkoutSession();
      setCurrentSession(session);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setCurrentSession(null);
        return;
      }

      setCurrentSession(null);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  React.useEffect(() => {
    fetchCurrentSession();
  }, [fetchCurrentSession, pathname]);

  const value = React.useMemo<ActiveWorkoutContextValue>(
    () => ({
      currentSession,
      isLoading,
      refetchCurrentSession: fetchCurrentSession,
    }),
    [currentSession, fetchCurrentSession, isLoading],
  );
  const shouldShowButton =
    status === "authenticated" &&
    currentSession &&
    pathname !== routes.workoutSession;

  return (
    <ActiveWorkoutContext.Provider value={value}>
      {children}
      {shouldShowButton ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] z-30 px-4">
          <div className="mx-auto flex max-w-md justify-start">
            <Button
              asChild
              size="icon"
              className="pointer-events-auto size-12 rounded-full border border-primary/40 bg-primary text-primary-foreground shadow-lg"
            >
              <Link
                aria-label={`Abrir ${
                  currentSession.workout_template?.name ??
                  "treino em andamento"
                }`}
                href={routes.workoutSession}
                title={
                  currentSession.workout_template?.name ??
                  "Treino em andamento"
                }
              >
                <Dumbbell className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </ActiveWorkoutContext.Provider>
  );
}

export function useActiveWorkout() {
  const context = React.useContext(ActiveWorkoutContext);

  if (!context) {
    throw new Error(
      "useActiveWorkout must be used within ActiveWorkoutProvider",
    );
  }

  return context;
}
