'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';

export default function SettingsSection() {
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
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-white text-xl font-semibold">Settings</h2>
        <p className="text-white/40 text-sm mt-0.5">Manage your account preferences</p>
      </div>

      <div className="bg-[#13151c] border border-white/5 rounded-xl p-5">
        <h3 className="text-white/70 text-sm font-medium mb-4">Account Info</h3>
        <div className="space-y-2">
          <p className="text-white/40 text-sm">Name: <span className="text-white/70">{user?.name}</span></p>
          <p className="text-white/40 text-sm">Email: <span className="text-white/70">{user?.email}</span></p>
          <p className="text-white/40 text-sm">Role: <span className="text-cyan-500 capitalize">{user?.role}</span></p>
        </div>
      </div>

      <div className="bg-[#13151c] border border-white/5 rounded-xl p-5">
        <h3 className="text-white/70 text-sm font-medium mb-4">Change Password</h3>
        {status && (
          <p className={`text-sm mb-4 p-3 rounded-lg ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {status.message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {(['current_password', 'new_password', 'confirm_password'] as const).map((field) => (
            <div key={field}>
              <label className="block text-white/50 text-xs font-medium mb-1.5 capitalize">
                {field.replace(/_/g, ' ')}
              </label>
              <input type="password" required value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500/50 transition-colors" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-6 py-2.5 rounded-lg disabled:opacity-50 transition-colors">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
