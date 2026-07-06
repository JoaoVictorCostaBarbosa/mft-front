import type { AuthSession, UserGoal } from "@/features/auth";
import { apiRoutes } from "@/lib/api-routes";
import { apiFetch } from "@/lib/http";

type UserResponse = AuthSession["user"];

export function sendChangeCode() {
  return apiFetch<void>(apiRoutes.users.sendCode, {
    method: "POST",
  });
}

export function updateUserName(payload: { name: string; code: number }) {
  return apiFetch<UserResponse>(apiRoutes.users.update, {
    method: "PATCH",
    body: payload,
  });
}

export function updateUserEmail(payload: { email: string; code: number }) {
  return apiFetch<UserResponse>(apiRoutes.users.email, {
    method: "PATCH",
    body: payload,
  });
}

export function updateUserPassword(payload: {
  password: string;
  code: number;
}) {
  return apiFetch<void>(apiRoutes.users.password, {
    method: "PATCH",
    body: payload,
  });
}

export function updateUserGoal(goal: UserGoal) {
  return apiFetch<UserResponse>(apiRoutes.users.goal, {
    method: "PATCH",
    body: { goal },
  });
}

export function updateUserAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<UserResponse>(apiRoutes.users.avatar, {
    method: "PATCH",
    body: formData,
  });
}
