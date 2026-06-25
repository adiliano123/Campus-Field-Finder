'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { Role } from '@/types/auth.types';
import { ROUTES } from '@/lib/constants';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '', role: 'student' as Role,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authService.register(form);
      setAuth(res.user, res.token);
      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `token=${res.token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `role=${res.user.role}; path=/; max-age=${maxAge}; SameSite=Lax`;
      const dashMap = { student: ROUTES.studentDashboard, company: ROUTES.companyDashboard, admin: ROUTES.adminDashboard };
      router.push(dashMap[res.user.role]);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const apiErrors = e?.response?.data?.errors;
      if (apiErrors) {
        setError(Object.values(apiErrors).flat().join(' '));
      } else {
        setError(e?.response?.data?.message ?? 'Registration failed. Please check your details and try again.');
      }
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

          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Create Account</h2>
          <p className="text-gray-400 text-sm mb-7">Join Field Finder and start your journey</p>

          {error && (
            <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-100 p-3 rounded-xl">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <label className="absolute top-2 left-4 text-xs text-gray-400">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

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

            {/* Role */}
            <div className="relative">
              <label className="absolute top-2 left-4 text-xs text-gray-400">I am a</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none"
              >
                <option value="student">Student</option>
                <option value="company">Company / Organization</option>
              </select>
            </div>

            {/* Password */}
            <div className="relative">
              <label className="absolute top-2 left-4 text-xs text-gray-400">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 8 characters"
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

            {/* Confirm Password */}
            <div className="relative">
              <label className="absolute top-2 left-4 text-xs text-gray-400">Confirm Password</label>
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                placeholder="Repeat your password"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pt-6 pb-2 pr-12 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
              >
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 text-white py-3 rounded-xl font-semibold text-sm hover:bg-purple-800 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 hover:underline font-semibold">
              Sign In
            </Link>
          </p>
          <p className="text-center text-sm text-gray-400 mt-2">
            <Link href="/" className="text-purple-600 hover:underline font-semibold">
              Back to home page
            </Link>
          </p>
        </div>

        {/* ── Right: Visual panel ── */}
        <div className="hidden md:flex flex-1 relative bg-linear-to-br from-slate-600 via-slate-700 to-slate-800 rounded-r-3xl overflow-hidden flex-col items-center justify-center p-8">
          <div className="absolute top-16 left-8 w-40 h-40 rounded-full bg-purple-500 opacity-20 blur-2xl" />
          <div className="absolute bottom-24 right-8 w-48 h-48 rounded-full bg-yellow-400 opacity-15 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-green-400 opacity-10 blur-3xl" />
          <div className="relative text-center">
            <p className="text-6xl mb-6">🚀</p>
            <p className="text-white font-semibold text-lg leading-snug">
              Start your career journey<br />with Field Finder
            </p>
            <p className="text-white/40 text-sm mt-3">Connect with top companies today</p>
          </div>
        </div>

      </div>
    </div>
  );
}
