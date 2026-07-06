"use client";

import * as React from "react";

import { getApiErrorMessage } from "@/lib/http";

import { getBodyMetrics } from "../api/body-metrics-api";
import type { BodyMetricEntry } from "../types";

type BodyMetricsState = {
  entries: BodyMetricEntry[];
  error: string;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

export function useBodyMetrics(): BodyMetricsState {
  const [entries, setEntries] = React.useState<BodyMetricEntry[]>([]);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchEntries = React.useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const metrics = await getBodyMetrics();
      setEntries(metrics);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return {
    entries,
    error,
    isLoading,
    refetch: fetchEntries,
  };
}
