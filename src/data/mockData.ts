// src/data/mockData.ts
import type { Voucher, Duration } from '../types';
import { DATA_LIMITS } from '../types';

const durations: Duration[] = ['1h', '1d', '1w', '1m'];

const randomCode = (prefix: string) => {
  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${rand()}-${rand()}`;
};

export const generateMockVouchers = (count: number): Voucher[] => {
  return Array.from({ length: count }, () => ({
    id: crypto.randomUUID(),
    code: randomCode('WIFI'),
    duration: durations[Math.floor(Math.random() * durations.length)],
    dataLimit: DATA_LIMITS[Math.floor(Math.random() * DATA_LIMITS.length)],
    isUsed: Math.random() > 0.7,
    usedAt: Math.random() > 0.7 ? new Date().toISOString() : null,
    expiresAt: null,
    createdAt: new Date().toISOString(),
    printed: Math.random() > 0.5,
  }));
};

export const initialVouchers = generateMockVouchers(20);