import { useAuth } from './useAuth';
import { Role } from '@/types/auth.types';

export const useRole = () => {
  const { user } = useAuth();
  return {
    role: user?.role ?? null,
    isStudent: user?.role === 'student',
    isCompany: user?.role === 'company',
    isAdmin: user?.role === 'admin',
    hasRole: (role: Role) => user?.role === role,
  };
};
