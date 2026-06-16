export interface StudentProfile {
  id: number;
  user_id: number;
  university: string;
  course: string;
  year_of_study: number;
  cv_url?: string;
  bio?: string;
}

export interface CompanyProfile {
  id: number;
  user_id: number;
  company_name: string;
  industry: string;
  location: string;
  website?: string;
  description?: string;
  is_approved: boolean;
}
