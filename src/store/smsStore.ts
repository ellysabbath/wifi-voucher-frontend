import { create } from 'zustand';
import type { SMSMessage } from '../types';
import { initialSMS } from '../data/mockData';

interface SMSState {
  messages: SMSMessage[];
  groups: Record<string, string[]>;
  addGroup: (name: string, memberIds: string[]) => void;
  deleteGroup: (name: string) => void;
  sendSMS: (recipients: string[], message: string, group?: string) => void;
}

export const useSMSStore = create<SMSState>((set, get) => ({
  messages: initialSMS,
  groups: {},

  addGroup: (name, memberIds) => set({
    groups: { ...get().groups, [name]: memberIds }
  }),

  deleteGroup: (name) => {
    const { [name]: _, ...rest } = get().groups;
    set({ groups: rest });
  },

  sendSMS: (recipients, message, group) => set({
    messages: [{
      id: crypto.randomUUID(),
      recipients,
      message,
      group,
      sentAt: new Date().toISOString(),
      status: 'sent',
    }, ...get().messages]
  }),
}));