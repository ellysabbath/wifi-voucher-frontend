// src/lib/api.ts
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export interface ApiError {
  detail?: string;
  [key: string]: unknown;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("access_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Parse body safely
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    const err: ApiError = data;
    const message =
      typeof err === "object" && err && "detail" in err
        ? String(err.detail)
        : Object.entries(err)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
            .join(" | ") || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

export const api = {
  get: <T>(p: string) => request<T>(p, { method: "GET" }),
  post: <T>(p: string, body?: unknown) =>
    request<T>(p, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(p: string, body?: unknown) =>
    request<T>(p, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(p: string, body?: unknown) =>
    request<T>(p, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(p: string) => request<T>(p, { method: "DELETE" }),
};

export { BASE_URL };