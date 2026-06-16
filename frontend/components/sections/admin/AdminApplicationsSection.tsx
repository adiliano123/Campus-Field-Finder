'use client';
import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { adminService } from '@/services/admin.service';
import { formatDate } from '@/lib/helpers';
import { APPLICATION_STATUSES } from '@/lib/constants';

interface AppEntry {
  id: number;
  status: string;
  applied_at: string;
  internship?: { title: string; company?: { company_name: string } };
}

interface StudentEntry {
  id: number;
  name: string;
  student?: { applications?: AppEntry[] };
}

const colorMap: Record<string, string> = {
  yellow: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  green:  'bg-green-500/10 text-green-400 border border-green-500/20',
  red:    'bg-red-500/10 text-red-400 border border-red-500/20',
};

export default function AdminApplicationsSection() {
  const { data, loading } = useFetch(() => adminService.getStudents());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const students = (data as StudentEntry[] | null) ?? [];
  const allApplications = students.flatMap((s) => s.student?.applications ?? []);

  const filtered = allApplications.filter((a) => {
    const matchSearch = !search ||
      a.internship?.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.internship?.company?.company_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-semibold">All Applications</h2>
        <p className="text-white/40 text-sm mt-0.5">Platform-wide application overview</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total',    value: allApplications.length,                                        color: 'text-white' },
          { label: 'Accepted', value: allApplications.filter((a) => a.status === 'accepted').length, color: 'text-green-400' },
          { label: 'Pending',  value: allApplications.filter((a) => a.status === 'pending').length,  color: 'text-yellow-400' },
        ].map((s) => (
          <div key={s.label} className="bg-[#13151c] border border-white/5 rounded-xl p-5">
            <p className="text-white/40 text-xs">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{loading ? '—' : s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <svg className="w-4 h-4 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by opportunity or company..."
            className="bg-transparent text-sm text-white/70 placeholder-white/30 outline-none w-full" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/10 text-white/60 text-sm rounded-lg px-3 py-2 outline-none">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-[#13151c] border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-white/30 text-sm p-5">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-white/30 text-sm">No applications found.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Opportunity</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Company</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Applied</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, idx) => {
                const status = APPLICATION_STATUSES[app.status as keyof typeof APPLICATION_STATUSES];
                return (
                  <tr key={`${app.id}-${idx}`} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5 text-white/80 text-sm font-medium">{app.internship?.title ?? '—'}</td>
                    <td className="px-5 py-3.5 text-cyan-500/70 text-sm">{app.internship?.company?.company_name ?? '—'}</td>
                    <td className="px-5 py-3.5 text-white/40 text-sm">{formatDate(app.applied_at)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorMap[status?.color ?? 'yellow']}`}>
                        {status?.label ?? app.status}
                      </span>
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
