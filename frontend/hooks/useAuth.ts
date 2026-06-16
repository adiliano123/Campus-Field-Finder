import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, token, setAuth, clearAuth } = useAuthStore();
  return {
    user,
    token,
    isAuthenticated: !!token,
    setAuth,
    clearAuth,
  };
};
