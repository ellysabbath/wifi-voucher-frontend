// src/lib/auth.ts
import { api } from "./api";

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  photo?: string | null;
  bio?: string | null;
  address?: string | null;
  role: string;
  email_verified: boolean;
  joined_at?: string;
}

// ===== Token storage =====
export const tokenStore = {
  getAccess: () => localStorage.getItem("access_token"),
  getRefresh: () => localStorage.getItem("refresh_token"),
  set: (t: AuthTokens) => {
    localStorage.setItem("access_token", t.access);
    localStorage.setItem("refresh_token", t.refresh);
  },
  clear: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};

// ===== Auth endpoints =====
export const authApi = {
  register: (payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    photo?: string;
  }) =>
    api.post<{ detail: string; email: string }>(
      "/api/accounts/register/",
      payload
    ),

  verifyOtp: (payload: { email: string; code: string }) =>
    api.post<{ detail: string } & AuthTokens>(
      "/api/accounts/verify-otp/",
      payload
    ),

  resendOtp: (payload: { email: string; purpose: "verify" | "reset" }) =>
    api.post<{ detail: string }>("/api/accounts/resend-otp/", payload),

  login: (payload: { email: string; password: string }) =>
    api.post<
      { detail: string } & Partial<AuthTokens> & {
        needs_verification?: boolean;
        email?: string;
      }
    >("/api/accounts/login/", payload),

  forgotPassword: (email: string) =>
    api.post<{ detail: string }>("/api/accounts/forgot-password/", { email }),

  resetPassword: (payload: {
    email: string;
    code: string;
    password: string;
    confirmPassword: string;
  }) => api.post<{ detail: string }>("/api/accounts/reset-password/", payload),

  // ===== PROFILE =====
  me: () => api.get<UserProfile>("/api/accounts/me/"),

  updateMe: (patch: Partial<UserProfile>) =>
    api.patch<{ detail: string } & UserProfile>("/api/accounts/me/", patch),
};