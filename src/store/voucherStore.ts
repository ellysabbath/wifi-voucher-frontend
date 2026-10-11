import { create } from 'zustand';
import { type Voucher, type VoucherFormData } from '../types';
import { initialVouchers } from '../data/mockData';


const generateCode = (prefix: string) => {
  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${rand()}-${rand()}`;
};

interface VoucherState {
  vouchers: Voucher[];
  addVouchers: (form: VoucherFormData) => void;
  markPrinted: (ids: string[]) => void;
  useVoucher: (code: string) => boolean;
}

export const useVoucherStore = create<VoucherState>((set, get) => ({
  vouchers: initialVouchers,

  addVouchers: (form) => {
    const newVouchers: Voucher[] = Array.from({ length: form.quantity }, () => ({
      id: crypto.randomUUID(),
      code: generateCode(form.prefix),
      duration: form.duration,
      dataLimit: form.dataLimit,
      isUsed: false,
      usedAt: null,
      expiresAt: null,
      createdAt: new Date().toISOString(),
      printed: false,
    }));
    set({ vouchers: [...newVouchers, ...get().vouchers] });
  },

  markPrinted: (ids) => {
    set({
      vouchers: get().vouchers.map((v) =>
        ids.includes(v.id) ? { ...v, printed: true } : v
      ),
    });
  },

  useVoucher: (code) => {
    const voucher = get().vouchers.find((v) => v.code === code);
    if (!voucher || voucher.isUsed) return false;
    set({
      vouchers: get().vouchers.map((v) =>
        v.code === code
          ? { ...v, isUsed: true, usedAt: new Date().toISOString() }
          : v
      ),
    });
    return true;
  },
}));