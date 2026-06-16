'use client';
import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { internshipService } from '@/services/internship.service';
import InternshipCard from '@/components/cards/InternshipCard';
import { OPPORTUNITY_TYPES } from '@/lib/constants';

export default function BrowseSection() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const { data: internships, loading } = useFetch(() => internshipService.getAll());

  const filtered = internships?.filter((i) => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (type ? i.type === type : true);
  }) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-semibold">Browse Opportunities</h2>
        <p className="text-white/40 text-sm mt-0.5">Find your perfect training placement</p>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <svg className="w-4 h-4 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or location..."
            className="bg-transparent text-sm text-white/70 placeholder-white/30 outline-none w-full" />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="bg-white/5 border border-white/10 text-white/60 text-sm rounded-lg px-3 py-2 outline-none">
          <option value="">All Types</option>
          {OPPORTUNITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-white/30 text-sm">Loading opportunities...</p>
      ) : filtered.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((i) => (
            <div key={i.id} className="bg-[#13151c] border border-white/5 rounded-xl p-5 hover:border-cyan-500/20 transition-colors">
              <InternshipCard internship={i} dark />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/30 text-sm">No opportunities found.</p>
      )}
    </div>
  );
}
