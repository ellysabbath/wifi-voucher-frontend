// src/lib/smsApi.ts
import { api } from "./api";

// =========================================================
// TYPES
// =========================================================
export interface SMSGroupMember {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone: string;
}

export interface SMSGroup {
  id: string;
  name: string;
  description: string | null;
  created_by_email: string;
  members: SMSGroupMember[];
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface SMSRecipientRow {
  id: string;
  user: string;
  phone: string | null;
  email: string | null;
  sms_status: "pending" | "sent" | "failed";
  email_status: "pending" | "sent" | "failed";
  sms_error: string | null;
  email_error: string | null;
  sms_sent_at: string | null;
  email_sent_at: string | null;
}

export interface SMSMessage {
  id: string;
  message: string;
  subject: string | null;
  group_name: string | null;
  status: "pending" | "sent" | "partial" | "failed";
  sent_by_email: string | null;
  recipient_count: number;
  sms_sent_count: number;
  email_sent_count: number;
  failed_count: number;
  created_at: string;
  updated_at: string;
}

export interface SMSMessageDetail extends SMSMessage {
  recipients: SMSRecipientRow[];
}

export interface Paginated<T> {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: T[];
}

export type SendMode = "all" | "group" | "selected";
export type Channel = "sms" | "email";

export interface SendSMSPayload {
  message: string;
  subject?: string;
  mode: SendMode;
  group_id?: string;
  user_ids?: string[];
  channels: Channel[];
}

const BASE = "/api/sms";

// =========================================================
// API
// =========================================================
export const smsApi = {
  // ----- Groups -----
  listGroups: (params?: { q?: string; page?: number; page_size?: number }) => {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return api.get<Paginated<SMSGroup>>(`${BASE}/groups/${suffix}`);
  },

  getGroup: (id: string) => api.get<SMSGroup>(`${BASE}/groups/${id}/`),

  createGroup: (payload: {
    name: string;
    description?: string;
    user_ids: string[];
  }) => api.post<SMSGroup>(`${BASE}/groups/`, payload),

  removeGroup: (id: string) =>
    api.delete<{ detail: string }>(`${BASE}/groups/${id}/`),

  // ----- Messages -----
  listMessages: (params?: { page?: number; page_size?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.page_size) qs.set("page_size", String(params.page_size));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return api.get<Paginated<SMSMessage>>(`${BASE}/messages/${suffix}`);
  },

  getMessage: (id: string) =>
    api.get<SMSMessageDetail>(`${BASE}/messages/${id}/`),

  // ----- Send -----
  send: (payload: SendSMSPayload) =>
    api.post<{ detail: string; campaign: SMSMessage }>(`${BASE}/send/`, payload),
};