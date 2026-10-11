import { create } from 'zustand';
import type { Ministry } from '../types';
import { initialMinistries } from '../data/mockData';

interface MinistryState {
  ministries: Ministry[];
  addMinistry: (m: Omit<Ministry, 'id'>) => void;
  updateMinistry: (id: string, m: Partial<Ministry>) => void;
  deleteMinistry: (id: string) => void;
}

export const useMinistryStore = create<MinistryState>((set, get) => ({
  ministries: initialMinistries,
  addMinistry: (m) => set({
    ministries: [...get().ministries, { ...m, id: crypto.randomUUID() }]
  }),
  updateMinistry: (id, m) => set({
    ministries: get().ministries.map(x => x.id === id ? { ...x, ...m } : x)
  }),
  deleteMinistry: (id) => set({
    ministries: get().ministries.filter(x => x.id !== id)
  }),
}));