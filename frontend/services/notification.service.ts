import { api } from './api';

export interface Notification {
  id: number;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  getAll: () => api.get<Notification[]>('/notifications'),
  markRead: (id: number) => api.patch<Notification>(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};
