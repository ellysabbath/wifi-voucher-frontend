import { create } from 'zustand';
import type { GalleryItem } from '../types';
import { initialGallery } from '../data/mockData';

interface GalleryState {
  items: GalleryItem[];
  addItem: (item: Omit<GalleryItem, 'id' | 'uploadedAt'>) => void;
  deleteItem: (id: string) => void;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  items: initialGallery,
  addItem: (item) => set({
    items: [{ ...item, id: crypto.randomUUID(), uploadedAt: new Date().toISOString() }, ...get().items]
  }),
  deleteItem: (id) => set({ items: get().items.filter(x => x.id !== id) }),
}));