import { create } from 'zustand';
import { Internship } from '@/types/internship.types';

interface InternshipStore {
  internships: Internship[];
  selected: Internship | null;
  setInternships: (data: Internship[]) => void;
  setSelected: (item: Internship | null) => void;
}

export const useInternshipStore = create<InternshipStore>((set) => ({
  internships: [],
  selected: null,
  setInternships: (data) => set({ internships: data }),
  setSelected: (item) => set({ selected: item }),
}));
