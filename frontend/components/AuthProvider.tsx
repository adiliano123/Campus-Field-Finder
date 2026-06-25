'use client';
// AuthProvider is intentionally minimal.
// It does NOT call the API on mount — the user + token are already persisted
// in Zustand (localStorage). Calling /auth/me here caused a reload loop:
//   me() → 401 → clearAuth() → cookie cleared → middleware → /login → reload → repeat
//
// Token validity is enforced by the axios interceptors returning 401 on real
// API calls. The middleware enforces route protection via cookies set at login.

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
