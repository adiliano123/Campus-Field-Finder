'use client';
import { useState, useEffect, useCallback } from 'react';
import { internshipService } from '@/services/internship.service';
import { Internship, OpportunityType } from '@/types/internship.types';
import { OPPORTUNITY_TYPES } from '@/lib/constants';
import { formatDate, isDeadlinePassed } from '@/lib/helpers';
import { useDashboardStore } from '@/store/dashboardStore';

type EditForm = {
  title: string; description: string; type: OpportunityType;
  location: string; duration: string; requirements: string; deadline: string;
};

export default function CompanyOpportunitiesSection() {
  const setActive = useDashboardStore((s) => s.setActive);
  const [opportunities, setOpportunities] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Internship | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setOpportunities(await internshipService.getAll()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (i: Internship) => {
    setEditing(i);
    setForm({
      title: i.title, description: i.description, type: i.type,
      location: i.location, duration: i.duration,
      requirements: i.requirements ?? '', deadline: i.deadline,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !form) return;
    setSaving(true);
    setError('');
    try {
      await internshipService.update(editing.id, form);
      setEditing(null);
      load();
    } catch {
      setError('Failed to update opportunity.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this opportunity?')) return;
    await internshipService.delete(id);
    load();
  };

  const set = (field: keyof EditForm, value: string) =>
    setForm((f) => f ? { ...f, [field]: value } : f);

  if (editing && form) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white/70 transition-colors">←</button>
          <div>
            <h2 className="text-white text-xl font-semibold">Edit Opportunity</h2>
            <p className="text-white/40 text-sm mt-0.5">{editing.title}</p>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">{error}</p>}

        <form onSubmit={handleSave} className="bg-[#13151c] border border-white/5 rounded-xl p-6 space-y-4">
          {([
            { field: 'title',    label: 'Title',    type: 'text', required: true },
            { field: 'location', label: 'Location', type: 'text', required: true },
            { field: 'duration', label: 'Duration', type: 'text', required: true },
            { field: 'deadline', label: 'Deadline', type: 'date', required: true },
          ] as const).map(({ field, label, type, required }) => (
            <div key={field}>
              <label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label>
              <input type={type} required={required} value={form[field]}
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
            <button type="submit" disabled={saving}
              className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-6 py-2.5 rounded-lg disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => setEditing(null)}
              className="bg-white/5 border border-white/10 text-white/60 text-sm px-6 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold">Manage Opportunities</h2>
          <p className="text-white/40 text-sm mt-0.5">{opportunities.length} total listings</p>
        </div>
        <button onClick={() => setActive('post')}
          className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + Post New
        </button>
      </div>

      <div className="bg-[#13151c] border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-white/30 text-sm p-5">Loading...</p>
        ) : opportunities.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-3xl mb-2">📌</p>
            <p className="text-white/30 text-sm">No opportunities posted yet.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Title</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Type</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Location</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Deadline</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((i) => {
                const typeLabel = OPPORTUNITY_TYPES.find((t) => t.value === i.type)?.label ?? i.type;
                const expired = isDeadlinePassed(i.deadline);
                return (
                  <tr key={i.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5 text-white/80 text-sm font-medium">{i.title}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                        {typeLabel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/50 text-sm">{i.location}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm ${expired ? 'text-red-400' : 'text-white/50'}`}>
                        {formatDate(i.deadline)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(i)}
                          className="text-xs bg-white/5 border border-white/10 text-white/60 px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(i.id)}
                          className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-lg hover:bg-red-500/20 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
