// src/lib/api.ts
const BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export interface ApiError {
  detail?: string;
  [key: string]: unknown;
}

function buildErrorMessage(err: unknown, status: number): string {
  if (!err || typeof err !== "object") return `Request failed (${status})`;

  const obj = err as Record<string, unknown>;

  if (typeof obj.detail === "string") return obj.detail;

  // DRF often returns { field: ["msg1", "msg2"], ... }
  const parts: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      parts.push(`${key}: ${value.join(", ")}`);
    } else if (value != null && typeof value !== "object") {
      parts.push(`${key}: ${value}`);
    }
  }
  return parts.length ? parts.join(" | ") : `Request failed (${status})`;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("access_token");

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
  };

  // Only attach a real JWT (3 dot-separated parts)
  if (
    token &&
    token !== "null" &&
    token !== "undefined" &&
    token.trim() !== "" &&
    token.split(".").length === 3
  ) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Merge caller-provided headers
  if (options.headers) {
    Object.assign(headers, options.headers as Record<string, string>);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // 204 No Content or empty body
  if (res.status === 204) return {} as T;

  const text = await res.text();
  let data: unknown = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Not JSON — return raw text
      data = { detail: text };
    }
  }

  if (!res.ok) {
    throw new Error(buildErrorMessage(data, res.status));
  }

  return data as T;
}

export const api = {
  get: <T>(p: string) => request<T>(p, { method: "GET" }),
  post: <T>(p: string, body?: unknown) =>
    request<T>(p, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T>(p: string, body?: unknown) =>
    request<T>(p, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(p: string, body?: unknown) =>
    request<T>(p, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(p: string) => request<T>(p, { method: "DELETE" }),
};

export { BASE_URL };