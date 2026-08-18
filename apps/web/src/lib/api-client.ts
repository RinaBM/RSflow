// Defaults to whatever host served this page (not a hardcoded "localhost") so the API call stays
// same-site as the page — e.g. on a LAN IP, both page and API are under that IP, keeping
// SameSite=Lax cookies valid. A hardcoded cross-host default would silently break login whenever
// the page and API host don't match.
const API_URL = import.meta.env.VITE_API_URL ?? `${window.location.protocol}//${window.location.hostname}:4000/api`;

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const body = await res.json().catch(() => undefined);

  if (!res.ok) {
    const error = body?.error;
    throw new ApiError(
      res.status,
      error?.code ?? "UNKNOWN_ERROR",
      error?.message ?? "Something went wrong",
      error?.details,
    );
  }

  return body as T;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path, { method: "GET" }),
  post: <T>(path: string, data?: unknown) =>
    apiFetch<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};
