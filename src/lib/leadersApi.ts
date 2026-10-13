// src/lib/leadersApi.ts
import { api } from "./api";

export interface Leader {
  id: string;
  user_id: string | null;
  user_email: string | null;
  user_full_name: string | null;
  user_phone: string | null;
  user_photo: string | null;
  position: string;
  bio: string | null;
  display_order: number;
  is_active: boolean;
  appointed_at: string;
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

export interface LeaderPayload {
  user_id: string;
  position: string;
  bio?: string;
  display_order?: number;
  is_active?: boolean;
  appointed_at: string;
}

const BASE = "/api/leaders";

export const leadersApi = {
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
    return api.get<Paginated<Leader>>(`${BASE}/${suffix}`);
  },

  get: (id: string) => api.get<Leader>(`${BASE}/${id}/`),

  create: (payload: LeaderPayload) => api.post<Leader>(`${BASE}/`, payload),

  update: (id: string, payload: Partial<LeaderPayload>) =>
    api.patch<Leader>(`${BASE}/${id}/`, payload),

  replace: (id: string, payload: LeaderPayload) =>
    api.put<Leader>(`${BASE}/${id}/`, payload),

  remove: (id: string) =>
    api.delete<{ detail: string }>(`${BASE}/${id}/`),
};