import { create } from 'zustand';

export type StudentSection = 'dashboard' | 'browse' | 'applications' | 'profile' | 'settings' | 'notifications' | 'messages' | 'cv' | 'saved';
export type CompanySection = 'dashboard' | 'post' | 'profile' | 'settings' | 'notifications' | 'messages' | 'applications' | 'opportunities' | 'reports' | 'students';
export type AdminSection = 'dashboard' | 'companies' | 'students' | 'opportunities' | 'settings' | 'notifications' | 'messages' | 'applications' | 'reports';

export type DashboardSection = StudentSection | CompanySection | AdminSection;

interface DashboardStore {
  active: DashboardSection;
  setActive: (section: DashboardSection) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  active: 'dashboard',
  setActive: (section) => set({ active: section }),
}));
