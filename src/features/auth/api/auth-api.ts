import { apiRoutes } from "@/lib/api-routes";
import { apiFetch } from "@/lib/http";

import type {
  AuthSession,
  GoogleSignInRequest,
  SignInCredentials,
  SignUpCredentials,
  VerifyAccountRequest,
} from "../types";

export function signIn(credentials: SignInCredentials) {
  return apiFetch<AuthSession>(apiRoutes.auth.login, {
    method: "POST",
    body: credentials,
    skipAuthRefresh: true,
  });
}

export function signInWithGoogle(payload: GoogleSignInRequest) {
  return apiFetch<AuthSession>(apiRoutes.auth.google, {
    method: "POST",
    body: payload,
    skipAuthRefresh: true,
  });
}

export function signUp(credentials: SignUpCredentials) {
  return apiFetch<void>(apiRoutes.auth.register, {
    method: "POST",
    body: credentials,
    skipAuthRefresh: true,
  });
}

export function verifyAccount(payload: VerifyAccountRequest) {
  return apiFetch<AuthSession>(apiRoutes.auth.verify, {
    method: "POST",
    body: payload,
    skipAuthRefresh: true,
  });
}

export function refreshSession() {
  return apiFetch<void>(apiRoutes.auth.refresh, {
    method: "POST",
    skipAuthRefresh: true,
  });
}

export function signOut() {
  return apiFetch<void>(apiRoutes.auth.logout, {
    method: "PATCH",
    skipAuthRefresh: true,
  });
}

export function getCurrentUser() {
  return apiFetch<AuthSession["user"]>(apiRoutes.users.me);
}
