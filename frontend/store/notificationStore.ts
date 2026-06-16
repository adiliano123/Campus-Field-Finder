import { create } from 'zustand';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationStore {
  notifications: Notification[];
  add: (message: string, type?: Notification['type']) => void;
  remove: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  add: (message, type = 'info') => {
    const id = Date.now().toString();
    set((s) => ({ notifications: [...s.notifications, { id, message, type }] }));
    setTimeout(() => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })), 4000);
  },
  remove: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
}));
