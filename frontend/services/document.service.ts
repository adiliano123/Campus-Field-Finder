import axiosInstance from '@/lib/axios';

export interface Document {
  id: number;
  user_id: number;
  type: 'cv' | 'transcript' | 'recommendation' | 'other';
  name: string;
  path: string;
  url: string;
  size: number;
  created_at: string;
}

export const documentService = {
  getAll: () => axiosInstance.get<Document[]>('/documents').then((r) => r.data),

  upload: (file: File, type: Document['type']) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return axiosInstance.post<Document>('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },

  delete: (id: number) => axiosInstance.delete(`/documents/${id}`).then((r) => r.data),
};
