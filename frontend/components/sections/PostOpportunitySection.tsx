'use client';
import { useState } from 'react';
import { internshipService } from '@/services/internship.service';
import { OPPORTUNITY_TYPES } from '@/lib/constants';
import { OpportunityType } from '@/types/internship.types';
import { useDashboardStore } from '@/store/dashboardStore';

export default function PostOpportunitySection() {
  const setActive = useDashboardStore((s) => s.setActive);
  const [form, setForm] = useState({
    title: '', description: '', type: 'internship' as OpportunityType,
    location: '', duration: '', requirements: '', deadline: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await internshipService.create(form);
      setActive('dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Failed to post opportunity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-white text-xl font-semibold">Post New Opportunity</h2>
        <p className="text-white/40 text-sm mt-0.5">Create a new listing for students to apply</p>
      </div>

      {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-[#13151c] border border-white/5 rounded-xl p-6 space-y-4">
        {[
          { field: 'title', label: 'Title', type: 'text', required: true },
          { field: 'location', label: 'Location', type: 'text', required: true },
          { field: 'duration', label: 'Duration (e.g. 3 months)', type: 'text', required: true },
          { field: 'deadline', label: 'Application Deadline', type: 'date', required: true },
        ].map(({ field, label, type, required }) => (
          <div key={field}>
            <label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label>
            <input type={type} required={required} value={(form as Record<string, string>)[field]}
              onChange={(e) => set(field, e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500/50 transition-colors" />
          </div>
        ))}

        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Type</label>
          <select value={form.type} onChange={(e) => set('type', e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500/50 transition-colors">
            {OPPORTUNITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Description</label>
          <textarea required rows={4} value={form.description} onChange={(e) => set('description', e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500/50 transition-colors resize-none" />
        </div>

        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Requirements</label>
          <textarea rows={3} value={form.requirements} onChange={(e) => set('requirements', e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500/50 transition-colors resize-none" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-6 py-2.5 rounded-lg disabled:opacity-50 transition-colors">
            {loading ? 'Posting...' : 'Post Opportunity'}
          </button>
          <button type="button" onClick={() => setActive('dashboard')}
            className="bg-white/5 border border-white/10 text-white/60 text-sm px-6 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
