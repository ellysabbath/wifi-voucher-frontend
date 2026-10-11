// src/types/index.ts
export type Duration = '1h' | '1d' | '1w' | '1m';

export interface Voucher {
  id: string;
  code: string;
  duration: Duration;
  dataLimit: string;
  isUsed: boolean;
  usedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  printed: boolean;
}

export interface VoucherFormData {
  quantity: number;
  duration: Duration;
  dataLimit: string;
  prefix: string;
}

// Hizi ni VALUES (sio types) — zinatumika kama kawaida
export const DURATION_LABELS: Record<Duration, string> = {
  '1h': 'Saa 1',
  '1d': 'Siku 1',
  '1w': 'Wiki 1',
  '1m': 'Mwezi 1',
};

export const DATA_LIMITS = ['500MB', '1GB', '2GB', '5GB', 'Unlimited'];