import { api } from './api';
import { StudentProfile } from '@/types/user.types';

export const studentService = {
  getProfile: () => api.get<StudentProfile>('/student/profile'),
  updateProfile: (data: Partial<StudentProfile>) => api.put<StudentProfile>('/student/profile', data),
};
