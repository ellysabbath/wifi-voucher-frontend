// src/lib/adminApi.ts
import { api } from "./api";

// =========================================================
// TYPES
// =========================================================
export interface AdminUserListItem {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  email_verified: boolean;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface AdminUserDetail extends AdminUserListItem {
  photo?: string | null;
  bio?: string | null;
  address?: string | null;
}

export interface Paginated<T> {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: T[];
}

export interface DashboardStats {
  total_users: number;
  verified_users: number;
  unverified_users: number;
  active_users: number;
  staff_users: number;
  recent_signups_7d: number;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role?: string;
  email_verified?: boolean;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface UpdateUserPayload {
  email?: string;
  password?: string;
  full_name?: string;
  phone?: string;
  photo?: string | null;
  bio?: string | null;
  address?: string | null;
  role?: string;
  email_verified?: boolean;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}

const BASE = "/api/admin/accounts";

// =========================================================
// ADMIN API
// =========================================================
export const adminApi = {
  // -------- Dashboard --------
  stats: () => api.get<DashboardStats>(`${BASE}/dashboard/stats/`),

  // -------- Users --------
  listUsers: (params?: {
    q?: string;
    role?: string;
    verified?: boolean;
    active?: boolean;
    page?: number;
    page_size?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.role) qs.set("role", params.role);
    if (params?.verified !== undefined) qs.set("verified", String(params.verified));
    if (params?.active !== undefined) qs.set("active", String(params.active));
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return api.get<Paginated<AdminUserListItem>>(`${BASE}/users/${suffix}`);
  },

  getUser: (id: string) =>
    api.get<AdminUserDetail>(`${BASE}/users/${id}/`),

  createUser: (payload: CreateUserPayload) =>
    api.post<AdminUserDetail>(`${BASE}/users/`, payload),

  updateUser: (id: string, payload: UpdateUserPayload) =>
    api.patch<AdminUserDetail>(`${BASE}/users/${id}/`, payload),

  replaceUser: (id: string, payload: UpdateUserPayload) =>
    api.put<AdminUserDetail>(`${BASE}/users/${id}/`, payload),

  deleteUser: (id: string) =>
    api.delete<{ detail: string }>(`${BASE}/users/${id}/`),

  // -------- User actions --------
  verifyUser: (id: string) =>
    api.post<{ detail: string }>(`${BASE}/users/${id}/verify/`),

  unverifyUser: (id: string) =>
    api.post<{ detail: string }>(`${BASE}/users/${id}/unverify/`),

  activateUser: (id: string) =>
    api.post<{ detail: string }>(`${BASE}/users/${id}/activate/`),

  deactivateUser: (id: string) =>
    api.post<{ detail: string }>(`${BASE}/users/${id}/deactivate/`),

  setUserRole: (id: string, role: string, is_staff: boolean) =>
    api.post<{ detail: string }>(`${BASE}/users/${id}/set-role/`, {
      role,
      is_staff,
    }),

  resendOtp: (id: string, purpose: "verify" | "reset") =>
    api.post<{ detail: string }>(`${BASE}/users/${id}/resend-otp/`, {
      purpose,
    }),

  resetUserPassword: (id: string, new_password?: string) =>
    api.post<{ detail: string; new_password: string }>(
      `${BASE}/users/${id}/reset-password/`,
      new_password ? { new_password } : {}
    ),

  makeSuperuser: (id: string) =>
    api.post<{ detail: string }>(`${BASE}/users/${id}/make-superuser/`),

  removeSuperuser: (id: string) =>
    api.post<{ detail: string }>(`${BASE}/users/${id}/remove-superuser/`),

  // -------- Bulk --------
  bulkVerify: (user_ids: string[]) =>
    api.post<{ detail: string }>(`${BASE}/bulk/verify/`, { user_ids }),

  bulkActivate: (user_ids: string[], is_active: boolean) =>
    api.post<{ detail: string }>(`${BASE}/bulk/activate/`, {
      user_ids,
      is_active,
    }),
};