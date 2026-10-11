import { create } from 'zustand';
import type { ChatMessage } from '../types';
import { initialMessages } from '../data/mockData';

interface ChatState {
  messages: ChatMessage[];
  rooms: string[];
  addRoom: (name: string) => void;
  deleteRoom: (name: string) => void;
  sendMessage: (senderId: string, senderName: string, message: string, room: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: initialMessages,
  rooms: ['general', 'vijana', 'wanawake', 'wazee', 'uongozi'],

  addRoom: (name) => {
    const clean = name.toLowerCase().replace(/\s+/g, '-');
    if (get().rooms.includes(clean)) return;
    set({ rooms: [...get().rooms, clean] });
  },

  deleteRoom: (name) => set({
    rooms: get().rooms.filter(r => r !== name),
    messages: get().messages.filter(m => m.room !== name),
  }),

  sendMessage: (senderId, senderName, message, room) => set({
    messages: [...get().messages, {
      id: crypto.randomUUID(),
      senderId,
      senderName,
      message,
      room,
      timestamp: new Date().toISOString(),
    }]
  }),
}));