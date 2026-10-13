// src/lib/booksApi.ts
import { api } from "./api";

// =========================================================
// TYPES
// =========================================================
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  file: string;        // raw base64
  file_name: string;
  category: string;
  uploaded_by: string;
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

export interface BookPayload {
  title: string;
  author: string;
  description?: string;
  file: string;
  file_name: string;
  category: string;
}

const BASE = "/api/books";

// =========================================================
// API
// =========================================================
export const booksApi = {
  list: (params?: {
    q?: string;
    category?: string;
    page?: number;
    page_size?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.category) qs.set("category", params.category);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return api.get<Paginated<Book>>(`${BASE}/${suffix}`);
  },

  get: (id: string) => api.get<Book>(`${BASE}/${id}/`),

  create: (payload: BookPayload) => api.post<Book>(`${BASE}/`, payload),

  update: (id: string, payload: Partial<BookPayload>) =>
    api.patch<Book>(`${BASE}/${id}/`, payload),

  replace: (id: string, payload: BookPayload) =>
    api.put<Book>(`${BASE}/${id}/`, payload),

  remove: (id: string) =>
    api.delete<{ detail: string }>(`${BASE}/${id}/`),
};