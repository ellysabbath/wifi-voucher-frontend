import { create } from 'zustand';
import type { Member } from '../types';
import { initialMembers } from '../data/mockData';

interface MemberState {
  members: Member[];
  addMember: (m: Omit<Member, 'id' | 'joinedAt'>) => void;
  updateMember: (id: string, m: Partial<Member>) => void;
  deleteMember: (id: string) => void;
}

export const useMemberStore = create<MemberState>((set, get) => ({
  members: initialMembers,
  addMember: (m) => set({
    members: [...get().members, { ...m, id: crypto.randomUUID(), joinedAt: new Date().toISOString() }]
  }),
  updateMember: (id, m) => set({
    members: get().members.map(x => x.id === id ? { ...x, ...m } : x)
  }),
  deleteMember: (id) => set({
    members: get().members.filter(x => x.id !== id)
  }),
}));