import { api } from './api';
import { Application, ApplicationStatus } from '@/types/internship.types';

export const applicationService = {
  getMyApplications: () => api.get<Application[]>('/applications'),
  getByInternship: (internshipId: number) => api.get<Application[]>(`/internships/${internshipId}/applications`),
  apply: (internshipId: number, coverLetter: string) =>
    api.post<Application>('/applications', { internship_id: internshipId, cover_letter: coverLetter }),
  updateStatus: (id: number, status: ApplicationStatus) =>
    api.patch<Application>(`/applications/${id}/status`, { status }),
};
