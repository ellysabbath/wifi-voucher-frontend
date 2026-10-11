import { create } from 'zustand';
import type { Book } from '../types';
import { initialBooks } from '../data/mockData';

interface BookState {
  books: Book[];
  addBook: (b: Omit<Book, 'id' | 'uploadedAt'>) => void;
  deleteBook: (id: string) => void;
}

export const useBookStore = create<BookState>((set, get) => ({
  books: initialBooks,
  addBook: (b) => set({
    books: [{ ...b, id: crypto.randomUUID(), uploadedAt: new Date().toISOString() }, ...get().books]
  }),
  deleteBook: (id) => set({ books: get().books.filter(x => x.id !== id) }),
}));