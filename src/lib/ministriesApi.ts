// src/lib/ministriesApi.ts
import { api } from "./api";

// =========================================================
// TYPES
// =========================================================
export interface Ministry {
  id: string;
  name: string;
  description: string | null;
  leader_name: string | null;
  meeting_day: string;
  meeting_time: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: T[];
}

export interface MinistryPayload {
  name: string;
  description?: string;
  leader_name?: string;
  meeting_day: string;
  meeting_time?: string | null;
  icon?: string;
  is_active?: boolean;
}

const BASE = "/api/ministries";

// =========================================================
// API
// =========================================================
export const ministriesApi = {
  list: (params?: {
    q?: string;
    active?: boolean;
    page?: number;
    page_size?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.active !== undefined) qs.set("active", String(params.active));
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return api.get<Paginated<Ministry>>(`${BASE}/${suffix}`);
  },

  get: (id: string) => api.get<Ministry>(`${BASE}/${id}/`),

  create: (payload: MinistryPayload) =>
    api.post<Ministry>(`${BASE}/`, payload),

  update: (id: string, payload: Partial<MinistryPayload>) =>
    api.patch<Ministry>(`${BASE}/${id}/`, payload),

  replace: (id: string, payload: MinistryPayload) =>
    api.put<Ministry>(`${BASE}/${id}/`, payload),

  remove: (id: string) =>
    api.delete<{ detail: string }>(`${BASE}/${id}/`),
};