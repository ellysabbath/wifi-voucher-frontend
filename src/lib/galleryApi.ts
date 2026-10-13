// src/lib/galleryApi.ts
import { api } from "./api";

// =========================================================
// TYPES
// =========================================================
export interface GalleryItem {
  id: string;
  title: string;
  image: string;       // raw base64 (no data: prefix)
  album: string;
  uploaded_by_id: string;
  uploaded_by_email: string;
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

export interface GalleryPayload {
  title: string;
  image: string;
  album: string;
}

const BASE = "/api/gallery";

// =========================================================
// API
// =========================================================
export const galleryApi = {
  list: (params?: {
    q?: string;
    album?: string;
    page?: number;
    page_size?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.album) qs.set("album", params.album);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return api.get<Paginated<GalleryItem>>(`${BASE}/${suffix}`);
  },

  get: (id: string) => api.get<GalleryItem>(`${BASE}/${id}/`),

  create: (payload: GalleryPayload) =>
    api.post<GalleryItem>(`${BASE}/`, payload),

  update: (id: string, payload: Partial<GalleryPayload>) =>
    api.patch<GalleryItem>(`${BASE}/${id}/`, payload),

  replace: (id: string, payload: GalleryPayload) =>
    api.put<GalleryItem>(`${BASE}/${id}/`, payload),

  remove: (id: string) =>
    api.delete<{ detail: string }>(`${BASE}/${id}/`),
};