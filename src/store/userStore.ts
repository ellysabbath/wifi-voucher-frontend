import { create } from 'zustand';

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  photo: string;
  bio: string;
  address: string;
  joinedAt: string;
}

interface UserState {
  user: UserProfile;
  updateUser: (data: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: {
    fullName: 'Msimamizi',
    email: 'admin@bahisda.org',
    phone: '+255712345678',
    role: 'Msimamizi Mkuu',
    photo: 'https://i.pravatar.cc/150?u=admin',
    bio: 'Msimamizi wa mfumo wa kanisa la Bahi SDA.',
    address: 'Bahi, Tanzania',
    joinedAt: '2024-01-15',
  },
  updateUser: (data) => set({ user: { ...get().user, ...data } }),
}));