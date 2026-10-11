import { create } from 'zustand';
import type { NewsItem } from '../types';
import { initialNews } from '../data/mockData';

interface NewsState {
  news: NewsItem[];
  addNews: (n: Omit<NewsItem, 'id' | 'publishedAt'>) => void;
  deleteNews: (id: string) => void;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  news: initialNews,
  addNews: (n) => set({
    news: [{ ...n, id: crypto.randomUUID(), publishedAt: new Date().toISOString() }, ...get().news]
  }),
  deleteNews: (id) => set({ news: get().news.filter(x => x.id !== id) }),
}));