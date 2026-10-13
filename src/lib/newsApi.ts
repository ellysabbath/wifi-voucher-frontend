// src/lib/newsApi.ts
import { api } from "./api";

// =========================================================
// TYPES
// =========================================================
export type NewsCategory = "announcement" | "event" | "news";

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string | null;    // raw base64 (no data: prefix)
  author_id: string;
  author_email: string;
  category: NewsCategory;
  is_published: boolean;
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

export interface NewsPayload {
  title: string;
  content: string;
  image?: string | null;
  category: NewsCategory;
  is_published?: boolean;
}

const BASE = "/api/news";

// =========================================================
// API
// =========================================================
export const newsApi = {
  list: (params?: {
    q?: string;
    category?: NewsCategory | "";
    published?: boolean;
    page?: number;
    page_size?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.category) qs.set("category", params.category);
    if (params?.published !== undefined)
      qs.set("published", String(params.published));
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return api.get<Paginated<NewsItem>>(`${BASE}/${suffix}`);
  },

  get: (id: string) => api.get<NewsItem>(`${BASE}/${id}/`),

  create: (payload: NewsPayload) => api.post<NewsItem>(`${BASE}/`, payload),

  update: (id: string, payload: Partial<NewsPayload>) =>
    api.patch<NewsItem>(`${BASE}/${id}/`, payload),

  replace: (id: string, payload: NewsPayload) =>
    api.put<NewsItem>(`${BASE}/${id}/`, payload),

  remove: (id: string) =>
    api.delete<{ detail: string }>(`${BASE}/${id}/`),
};