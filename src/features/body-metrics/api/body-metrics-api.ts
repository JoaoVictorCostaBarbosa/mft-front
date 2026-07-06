import { apiRoutes } from "@/lib/api-routes";
import { apiFetch } from "@/lib/http";

import type { BodyMetricEntry, CreateBodyMetricEntry } from "../types";

export function getBodyMetrics() {
  return apiFetch<BodyMetricEntry[]>(apiRoutes.measurements.list);
}

export function createBodyMetric(payload: CreateBodyMetricEntry) {
  return apiFetch<BodyMetricEntry>(apiRoutes.measurements.create, {
    method: "POST",
    body: payload,
  });
}

export function deleteBodyMetric(measurementId: string) {
  return apiFetch<void>(apiRoutes.measurements.byId(measurementId), {
    method: "DELETE",
  });
}
