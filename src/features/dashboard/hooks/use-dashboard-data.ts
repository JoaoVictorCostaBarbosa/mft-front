"use client";

import * as React from "react";

import { getDashboardData } from "@/features/dashboard/api/dashboard-api";
import type { DashboardData } from "@/features/dashboard/types";
import { getApiErrorMessage } from "@/lib/http";

type DashboardDataState = {
  data: DashboardData | null;
  error: string;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

export function useDashboardData(): DashboardDataState {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const dashboardData = await getDashboardData();
      setData(dashboardData);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    isLoading,
    refetch: fetchData,
  };
}
