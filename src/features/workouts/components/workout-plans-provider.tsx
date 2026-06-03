"use client";

import * as React from "react";

import {
  createWorkoutPlan as createWorkoutPlanRequest,
  getCurrentWorkoutPlan,
  getWorkoutPlans,
  setCurrentWorkoutPlan,
  updateWorkoutPlanName,
} from "@/features/workouts/api/workout-plans-api";
import type {
  CreateWorkoutPlanRequest,
  WorkoutPlan,
  WorkoutPlanSummary,
} from "@/features/workouts/types";
import { ApiError, getApiErrorMessage } from "@/lib/http";

type WorkoutPlansContextValue = {
  plans: WorkoutPlanSummary[] | null;
  currentPlanId: string | null;
  error: string;
  isLoading: boolean;
  settingCurrentPlanId: string | null;
  loadPlans: () => Promise<void>;
  refetchPlans: () => Promise<void>;
  createPlan: (payload: CreateWorkoutPlanRequest) => Promise<WorkoutPlanSummary>;
  updatePlanName: (planId: string, name: string) => Promise<WorkoutPlanSummary>;
  setCurrentPlan: (planId: string) => Promise<void>;
};

const WorkoutPlansContext =
  React.createContext<WorkoutPlansContextValue | null>(null);

type WorkoutPlansProviderProps = {
  children: React.ReactNode;
};

export function WorkoutPlansProvider({ children }: WorkoutPlansProviderProps) {
  const [plans, setPlans] = React.useState<WorkoutPlanSummary[] | null>(null);
  const [currentPlanId, setCurrentPlanId] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [settingCurrentPlanId, setSettingCurrentPlanId] = React.useState<
    string | null
  >(null);
  const requestRef = React.useRef<Promise<void> | null>(null);

  const readCurrentPlan = React.useCallback(async () => {
    try {
      return await getCurrentWorkoutPlan();
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }

      throw error;
    }
  }, []);

  const fetchPlans = React.useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [workoutPlans, currentPlan] = await Promise.all([
        getWorkoutPlans(),
        readCurrentPlan(),
      ]);

      setPlans(getPlansWithCurrent(workoutPlans, currentPlan));
      setCurrentPlanId(currentPlan?.id ?? null);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
      requestRef.current = null;
    }
  }, [readCurrentPlan]);

  const loadPlans = React.useCallback(async () => {
    if (plans !== null) {
      return;
    }

    if (!requestRef.current) {
      requestRef.current = fetchPlans();
    }

    await requestRef.current;
  }, [fetchPlans, plans]);

  const refetchPlans = React.useCallback(async () => {
    requestRef.current = fetchPlans();
    await requestRef.current;
  }, [fetchPlans]);

  const createPlan = React.useCallback(
    async (payload: CreateWorkoutPlanRequest) => {
      const createdPlan = await createWorkoutPlanRequest(payload);
      const planSummary = {
        id: createdPlan.id,
        user_id: createdPlan.user_id,
        name: createdPlan.name,
      };

      setPlans((currentPlans) => [planSummary, ...(currentPlans ?? [])]);
      return planSummary;
    },
    [],
  );

  const updatePlanName = React.useCallback(
    async (planId: string, name: string) => {
      const updatedPlan = await updateWorkoutPlanName({
        workout_plan_id: planId,
        name,
      });
      const planSummary = getPlanSummary(updatedPlan);

      setPlans((currentPlans) =>
        currentPlans?.map((plan) =>
          plan.id === planSummary.id ? planSummary : plan,
        ) ?? null,
      );

      return planSummary;
    },
    [],
  );

  const setCurrentPlan = React.useCallback(async (planId: string) => {
    setSettingCurrentPlanId(planId);
    setError("");

    try {
      await setCurrentWorkoutPlan(planId);
      setCurrentPlanId(planId);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setSettingCurrentPlanId(null);
    }
  }, []);

  const value = React.useMemo<WorkoutPlansContextValue>(
    () => ({
      plans,
      currentPlanId,
      error,
      isLoading,
      settingCurrentPlanId,
      loadPlans,
      refetchPlans,
      createPlan,
      updatePlanName,
      setCurrentPlan,
    }),
    [
      createPlan,
      currentPlanId,
      error,
      isLoading,
      loadPlans,
      plans,
      refetchPlans,
      settingCurrentPlanId,
      setCurrentPlan,
      updatePlanName,
    ],
  );

  return (
    <WorkoutPlansContext.Provider value={value}>
      {children}
    </WorkoutPlansContext.Provider>
  );
}

export function useWorkoutPlans() {
  const context = React.useContext(WorkoutPlansContext);

  if (!context) {
    throw new Error("useWorkoutPlans must be used within WorkoutPlansProvider");
  }

  return context;
}

function getPlansWithCurrent(
  plans: WorkoutPlanSummary[],
  currentPlan: WorkoutPlan | null,
) {
  if (!currentPlan || plans.some((plan) => plan.id === currentPlan.id)) {
    return plans;
  }

  return [
    getPlanSummary(currentPlan),
    ...plans,
  ];
}

function getPlanSummary(plan: WorkoutPlan): WorkoutPlanSummary {
  return {
    id: plan.id,
    user_id: plan.user_id,
    name: plan.name,
  };
}
