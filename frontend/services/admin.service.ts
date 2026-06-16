import { api } from './api';
import { CompanyProfile } from '@/types/user.types';

interface AdminStats {
  total_students: number;
  total_companies: number;
  pending_companies: number;
  total_internships: number;
}

export const adminService = {
  getStats: () => api.get<AdminStats>('/admin/stats'),
  getCompanies: () => api.get<CompanyProfile[]>('/admin/companies'),
  approveCompany: (id: number) => api.patch(`/admin/companies/${id}/approve`),
  rejectCompany: (id: number) => api.patch(`/admin/companies/${id}/reject`),
  getStudents: () => api.get('/admin/students'),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
};
