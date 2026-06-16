'use client';
import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { internshipService } from '@/services/internship.service';
import { OPPORTUNITY_TYPES } from '@/lib/constants';
import { formatDate, isDeadlinePassed } from '@/lib/helpers';

export default function AdminOpportunitiesSection() {
  const { data: internships, loading } = useFetch(() => internshipService.getAll());
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  const filtered = (internships ?? []).filter((i) => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (type ? i.type === type : true);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-semibold">Opportunities</h2>
        <p className="text-white/40 text-sm mt-0.5">{internships?.length ?? 0} total listings</p>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <svg className="w-4 h-4 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search opportunities..."
            className="bg-transparent text-sm text-white/70 placeholder-white/30 outline-none w-full" />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="bg-white/5 border border-white/10 text-white/60 text-sm rounded-lg px-3 py-2 outline-none">
          <option value="">All Types</option>
          {OPPORTUNITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      <div className="bg-[#13151c] border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-white/30 text-sm p-5">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-white/30 text-sm p-5">No opportunities found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Title</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Company</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Type</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Location</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => {
                const typeLabel = OPPORTUNITY_TYPES.find((t) => t.value === i.type)?.label ?? i.type;
                const expired = isDeadlinePassed(i.deadline);
                return (
                  <tr key={i.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5 text-white/80 text-sm font-medium">{i.title}</td>
                    <td className="px-5 py-3.5 text-cyan-500/70 text-sm">{i.company?.company_name ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                        {typeLabel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/50 text-sm">{i.location}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs ${expired ? 'text-red-400' : 'text-white/50'}`}>
                        {formatDate(i.deadline)}
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
