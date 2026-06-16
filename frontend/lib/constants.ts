export const OPPORTUNITY_TYPES = [
  { value: 'internship', label: 'Internship' },
  { value: 'field_training', label: 'Field Training' },
  { value: 'industrial_training', label: 'Industrial Practical Training' },
  { value: 'attachment', label: 'Attachment' },
];

export const APPLICATION_STATUSES = {
  pending: { label: 'Pending', color: 'yellow' },
  accepted: { label: 'Accepted', color: 'green' },
  rejected: { label: 'Rejected', color: 'red' },
};

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  studentDashboard: '/dashboard/student',
  companyDashboard: '/dashboard/company',
  adminDashboard: '/dashboard/admin',
  internships: '/internships',
  applications: '/applications',
  profile: '/profile',
  settings: '/settings',
};
