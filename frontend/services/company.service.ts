import { api } from './api';
import { CompanyProfile } from '@/types/user.types';

export interface CompanyStats {
  active_listings: number;
  total_applications: number;
  accepted: number;
  pending: number;
}

export const companyService = {
  getAll: () => api.get<CompanyProfile[]>('/companies'),
  getById: (id: number) => api.get<CompanyProfile>(`/companies/${id}`),
  getProfile: () => api.get<CompanyProfile>('/company/profile'),
  updateProfile: (data: Partial<CompanyProfile>) => api.put<CompanyProfile>('/company/profile', data),
  getStats: () => api.get<CompanyStats>('/company/stats'),
};
