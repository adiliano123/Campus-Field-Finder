'use client';
import { useState, useEffect, useCallback } from 'react';
import { internshipService } from '@/services/internship.service';
import { applicationService } from '@/services/application.service';
import { Application, Internship } from '@/types/internship.types';
import { formatDate } from '@/lib/helpers';
import { APPLICATION_STATUSES } from '@/lib/constants';

const colorMap: Record<string, string> = {
  yellow: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  green:  'bg-green-500/10 text-green-400 border border-green-500/20',
  red:    'bg-red-500/10 text-red-400 border border-red-500/20',
};

export default function CompanyApplicationsSection() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await internshipService.getAll();
      setInternships(list);
      if (list.length > 0) {
        const id = selectedId ?? list[0].id;
        setSelectedId(id);
        const apps = await applicationService.getByInternship(id);
        setApplications(apps);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectInternship = async (id: number) => {
    setSelectedId(id);
    setLoading(true);
    try {
      const apps = await applicationService.getByInternship(id);
      setApplications(apps);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (appId: number, status: 'accepted' | 'rejected') => {
    setUpdating(appId);
    try {
      await applicationService.updateStatus(appId, status);
      setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));
    } finally {
      setUpdating(null);
    }
  };

  const total    = applications.length;
  const accepted = applications.filter((a) => a.status === 'accepted').length;
  const pending  = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-semibold">Applications</h2>
        <p className="text-white/40 text-sm mt-0.5">Review and manage applicants</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total',    value: total,    color: 'text-white' },
          { label: 'Accepted', value: accepted, color: 'text-green-400' },
          { label: 'Pending',  value: pending,  color: 'text-yellow-400' },
        ].map((s) => (
          <div key={s.label} className="bg-[#13151c] border border-white/5 rounded-xl p-5">
            <p className="text-white/40 text-xs">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{loading ? '—' : s.value}</p>
          </div>
        ))}
      </div>

      {/* Opportunity selector */}
      {internships.length > 0 && (
        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Select Opportunity</label>
          <select
            value={selectedId ?? ''}
            onChange={(e) => handleSelectInternship(Number(e.target.value))}
            className="bg-white/5 border border-white/10 text-white/70 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500/50 transition-colors w-full max-w-sm"
          >
            {internships.map((i) => (
              <option key={i.id} value={i.id}>{i.title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Applications table */}
      <div className="bg-[#13151c] border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-white/30 text-sm p-5">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-white/30 text-sm">No applications for this opportunity yet.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Applicant</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Applied</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Status</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const status = APPLICATION_STATUSES[app.status as keyof typeof APPLICATION_STATUSES];
                return (
                  <tr key={app.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {(app.student as { user?: { name?: string } })?.user?.name?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <p className="text-white/80 text-sm font-medium">
                            {(app.student as { user?: { name?: string } })?.user?.name ?? 'Student'}
                          </p>
                          <p className="text-white/30 text-xs">
                            {(app.student as { user?: { email?: string } })?.user?.email ?? ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-white/40 text-sm">{formatDate(app.applied_at)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorMap[status?.color ?? 'yellow']}`}>
                        {status?.label ?? app.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {app.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            disabled={updating === app.id}
                            onClick={() => handleStatus(app.id, 'accepted')}
                            className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-lg hover:bg-green-500/20 disabled:opacity-50 transition-colors">
                            Accept
                          </button>
                          <button
                            disabled={updating === app.id}
                            onClick={() => handleStatus(app.id, 'rejected')}
                            className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-lg hover:bg-red-500/20 disabled:opacity-50 transition-colors">
                            Reject
                          </button>
                        </div>
                      )}
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
