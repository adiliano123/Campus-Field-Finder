'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';

export default function SettingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) {
      setStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await authService.changePassword(form.current_password, form.new_password);
      setStatus({ type: 'success', message: 'Password updated successfully.' });
      setForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setStatus({ type: 'error', message: msg ?? 'Failed to update password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Account Info</h3>
        <p className="text-sm text-gray-500">Name: <span className="text-gray-800">{user?.name}</span></p>
        <p className="text-sm text-gray-500 mt-1">Email: <span className="text-gray-800">{user?.email}</span></p>
        <p className="text-sm text-gray-500 mt-1">Role: <span className="text-gray-800 capitalize">{user?.role}</span></p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Change Password</h3>
        {status && (
          <p className={`text-sm mb-4 p-3 rounded-lg ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {status.message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {(['current_password', 'new_password', 'confirm_password'] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field.replace(/_/g, ' ')}
              </label>
              <input
                type="password"
                required
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
