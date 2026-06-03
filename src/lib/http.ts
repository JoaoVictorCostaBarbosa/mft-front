import { appConfig } from "@/config/app";
import { apiRoutes } from "@/lib/api-routes";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  skipAuthRefresh?: boolean;
};

export const authSessionExpiredEvent = "mft:auth-session-expired";

let refreshAccessTokenRequest: Promise<void> | null = null;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getApiErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "Sua sessão expirou. Entre novamente.";
    }

    if (error.status === 409) {
      return "Este e-mail já está em uso.";
    }

    if (error.status >= 500) {
      return "Erro inesperado. Tente novamente mais tarde.";
    }

    return error.message;
  }

  return "Erro inesperado. Tente novamente mais tarde.";
}

export async function apiFetch<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { body, headers, skipAuthRefresh = false, ...init } = options;
  const baseUrl = appConfig.apiUrl.replace(/\/$/, "");
  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const requestInit = {
    ...init,
    credentials: init.credentials ?? "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  } satisfies RequestInit;

  const response = await fetch(url, requestInit);

  if (
    response.status === 401 &&
    !skipAuthRefresh &&
    shouldAttemptAuthRefresh(path)
  ) {
    await refreshAccessToken();
    const retryResponse = await fetch(url, requestInit);

    return parseResponse<TResponse>(retryResponse);
  }

  return parseResponse<TResponse>(response);
}

async function refreshAccessToken() {
  if (refreshAccessTokenRequest) {
    return refreshAccessTokenRequest;
  }

  refreshAccessTokenRequest = requestAccessTokenRefresh();

  try {
    await refreshAccessTokenRequest;
  } finally {
    refreshAccessTokenRequest = null;
  }
}

async function requestAccessTokenRefresh() {
  const baseUrl = appConfig.apiUrl.replace(/\/$/, "");
  const response = await fetch(`${baseUrl}${apiRoutes.auth.refresh}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(authSessionExpiredEvent));
    }

    throw await createApiError(response);
  }
}

function shouldAttemptAuthRefresh(path: string) {
  const pathname = getPathname(path);
  const authRefreshSkippedPaths: readonly string[] = [
    apiRoutes.auth.login,
    apiRoutes.auth.logout,
    apiRoutes.auth.refresh,
    apiRoutes.auth.register,
    apiRoutes.auth.verify,
  ];

  return !authRefreshSkippedPaths.includes(pathname);
}

function getPathname(path: string) {
  if (!path.startsWith("http")) {
    return path;
  }

  return new URL(path).pathname;
}

async function parseResponse<TResponse>(
  response: Response,
): Promise<TResponse> {
  if (!response.ok) {
    throw await createApiError(response);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const text = await response.text();

  if (!text) {
    return undefined as TResponse;
  }

  return JSON.parse(text) as TResponse;
}

async function createApiError(response: Response) {
  const text = await response.text();
  let message = "Falha ao comunicar com a API.";

  if (text) {
    try {
      const json = JSON.parse(text);
      message = json.message ?? json.error ?? message;
    } catch {
      message = text || message;
    }
  }

  return new ApiError(message, response.status);
}
