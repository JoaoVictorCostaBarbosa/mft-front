import { routes } from "@/lib/routes";

const authEntrySeenKey = "mft:auth-entry-seen";

export function getUnauthenticatedEntryRoute() {
  if (typeof window === "undefined") {
    return routes.signUp;
  }

  return window.localStorage.getItem(authEntrySeenKey) === "true"
    ? routes.signIn
    : routes.signUp;
}

export function markAuthEntrySeen() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(authEntrySeenKey, "true");
}
