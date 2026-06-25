import { api } from './api';
import { Internship } from '@/types/internship.types';

export const savedService = {
  getAll: () => api.get<Internship[]>('/saved-internships'),
  save: (internshipId: number) =>
    api.post('/saved-internships', { internship_id: internshipId }),
  unsave: (internshipId: number) =>
    api.delete(`/saved-internships/${internshipId}`),
};
