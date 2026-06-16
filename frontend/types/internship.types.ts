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
  internship?: Internship;
  student?: {
    name: string;
    email: string;
  };
}
