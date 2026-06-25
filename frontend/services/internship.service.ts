import { api } from './api';
import { Internship } from '@/types/internship.types';

export const internshipService = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<Internship[]>(`/internships${query}`);
  },
  // Returns only internships belonging to the logged-in company
  getMine: () => api.get<Internship[]>('/company/internships'),
  getById: (id: number) => api.get<Internship>(`/internships/${id}`),
  create: (data: Partial<Internship>) => api.post<Internship>('/internships', data),
  update: (id: number, data: Partial<Internship>) => api.put<Internship>(`/internships/${id}`, data),
  delete: (id: number) => api.delete(`/internships/${id}`),
  getRecommended: () => api.get<Internship[]>('/internships/recommended'),
};
