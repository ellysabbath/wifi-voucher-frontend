import { create } from 'zustand';
import type { Leader } from '../types';
import { initialLeaders } from '../data/mockData';

interface LeaderState {
  leaders: Leader[];
  addLeader: (l: Omit<Leader, 'id'>) => void;
  updateLeader: (id: string, l: Partial<Leader>) => void;
  deleteLeader: (id: string) => void;
}

export const useLeaderStore = create<LeaderState>((set, get) => ({
  leaders: initialLeaders,
  addLeader: (l) => set({
    leaders: [...get().leaders, { ...l, id: crypto.randomUUID() }]
  }),
  updateLeader: (id, l) => set({
    leaders: get().leaders.map(x => x.id === id ? { ...x, ...l } : x)
  }),
  deleteLeader: (id) => set({
    leaders: get().leaders.filter(x => x.id !== id)
  }),
}));