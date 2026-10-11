import { create } from 'zustand';
import type { ChurchEvent } from '../types';
import { initialEvents } from '../data/mockData';

interface EventState {
  events: ChurchEvent[];
  addEvent: (e: Omit<ChurchEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: initialEvents,
  addEvent: (e) => set({ events: [...get().events, { ...e, id: crypto.randomUUID() }] }),
  deleteEvent: (id) => set({ events: get().events.filter(x => x.id !== id) }),
}));