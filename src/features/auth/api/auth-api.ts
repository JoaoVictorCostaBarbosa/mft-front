import { apiRoutes } from "@/lib/api-routes";
import { apiFetch } from "@/lib/http";

import type {
  AuthSession,
  SignInCredentials,
  SignUpCredentials,
  VerifyAccountRequest,
} from "../types";

export function signIn(credentials: SignInCredentials) {
  return apiFetch<AuthSession>(apiRoutes.auth.login, {
    method: "POST",
    body: credentials,
  });
}

export function signUp(credentials: SignUpCredentials) {
  return apiFetch<void>(apiRoutes.auth.register, {
    method: "POST",
    body: credentials,
  });
}

export function verifyAccount(payload: VerifyAccountRequest) {
  return apiFetch<AuthSession>(apiRoutes.auth.verify, {
    method: "POST",
    body: payload,
  });
}

export function refreshSession() {
  return apiFetch<void>(apiRoutes.auth.refresh, {
    method: "POST",
  });
}

export function signOut() {
  return apiFetch<void>(apiRoutes.auth.logout, {
    method: "PATCH",
  });
}

export function getCurrentUser() {
  return apiFetch<AuthSession["user"]>(apiRoutes.users.me);
}
