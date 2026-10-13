// src/lib/eventApi.ts
import { api } from "./api";

// =========================================================
// TYPES
// =========================================================
export type EventCategory = "worship" | "meeting" | "celebration" | "session";

export interface ChurchEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;   // "YYYY-MM-DD"
  event_time: string;   // "HH:MM" or "HH:MM:SS"
  location: string;
  category: EventCategory;
  created_by: string;
  created_by_email: string;
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

export interface EventPayload {
  title: string;
  description?: string;
  event_date: string;
  event_time: string;
  location: string;
  category: EventCategory;
}

const BASE = "/api/events";

// =========================================================
// API
// =========================================================
export const eventApi = {
  list: (params?: {
    q?: string;
    category?: EventCategory | "";
    from?: string;
    to?: string;
    page?: number;
    page_size?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.category) qs.set("category", params.category);
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return api.get<Paginated<ChurchEvent>>(`${BASE}/${suffix}`);
  },

  get: (id: string) => api.get<ChurchEvent>(`${BASE}/${id}/`),

  create: (payload: EventPayload) =>
    api.post<ChurchEvent>(`${BASE}/`, payload),

  update: (id: string, payload: Partial<EventPayload>) =>
    api.patch<ChurchEvent>(`${BASE}/${id}/`, payload),

  replace: (id: string, payload: EventPayload) =>
    api.put<ChurchEvent>(`${BASE}/${id}/`, payload),

  remove: (id: string) =>
    api.delete<{ detail: string }>(`${BASE}/${id}/`),
};