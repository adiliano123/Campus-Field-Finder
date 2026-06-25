export type OpportunityType = 'internship' | 'field_training' | 'industrial_training' | 'attachment';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Internship {
  id: number;
  company_id: number;
  title: string;
  description: string;
  type: OpportunityType;
  location: string;
  duration: string;
  requirements: string;
  deadline: string;
  created_at: string;
  company?: {
    company_name: string;
    industry: string;
  };
}

export interface Application {
  id: number;
  student_id: number;
  internship_id: number;
  status: ApplicationStatus;
  cover_letter: string;
  applied_at: string;
  created_at: string;
  internship?: Internship;
  student?: {
    id: number;
    university?: string;
    course?: string;
    year_of_study?: number;
    cv_url?: string;
    bio?: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };
}
