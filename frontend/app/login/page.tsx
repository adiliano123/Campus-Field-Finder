'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(form);
      setAuth(res.user, res.token);
      document.cookie = `token=${res.token}; path=/`;
      document.cookie = `role=${res.user.role}; path=/`;
      const dashMap: Record<string, string> = {
        student: ROUTES.studentDashboard,
        company: ROUTES.companyDashboard,
        admin: ROUTES.adminDashboard,
      };
      router.push(dashMap[res.user.role]);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-2xl border border-gray-100">

        {/* ── Left: Form ── */}
        <div className="flex-1 bg-white px-10 py-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-3xl">🎓</span>
            <span className="text-xl font-bold text-gray-900">
              Field Finder<span className="text-purple-600">.</span>
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Welcome Back</h2>
          <p className="text-gray-400 text-sm mb-7">Let&apos;s login to find amazing opportunities</p>

          {error && (
            <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-100 p-3 rounded-xl">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <label className="absolute top-2 left-4 text-xs text-gray-400">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="absolute top-2 left-4 text-xs text-gray-400">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 pr-12 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-purple-600"
                />
                Remember me
              </label>
              <a href="#" className="text-purple-600 hover:underline font-medium">Forgot Password?</a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 text-white py-3 rounded-xl font-semibold text-sm hover:bg-purple-800 disabled:opacity-50 transition-colors mt-1"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-purple-600 hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </div>

        {/* ── Right: Visual panel ── */}
        <div className="hidden md:flex flex-1 relative bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-r-3xl overflow-hidden flex-col items-center justify-end p-8">
          {/* top caption */}
          <p className="absolute top-8 left-0 right-0 text-center text-white font-semibold text-base px-8 leading-snug drop-shadow">
            Browse thousands of internships,<br />connect with top companies.
          </p>

          {/* decorative blobs */}
          <div className="absolute top-16 left-8 w-40 h-40 rounded-full bg-purple-500 opacity-20 blur-2xl" />
          <div className="absolute bottom-24 right-8 w-48 h-48 rounded-full bg-yellow-400 opacity-15 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-green-400 opacity-10 blur-3xl" />

            {/* big emoji illustration */}
            <p className="text-white/40 text-xs">Your career journey starts here</p>
          </div>
        </div>

      </div>

  );
}
