'use client';
import { useState, useEffect, useCallback } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { internshipService } from '@/services/internship.service';
import { savedService } from '@/services/saved.service';
import InternshipCard from '@/components/cards/InternshipCard';
import { OPPORTUNITY_TYPES } from '@/lib/constants';
import Link from 'next/link';

export default function BrowseSection() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState<number | null>(null);
  const { data: internships, loading } = useFetch(() => internshipService.getAll());

  const loadSaved = useCallback(async () => {
    try {
      const saved = await savedService.getAll();
      setSavedIds(new Set(saved.map((i) => i.id)));
    } catch {
      // not logged in as student
    }
  }, []);

  useEffect(() => { loadSaved(); }, [loadSaved]);

  const toggleSave = async (internshipId: number) => {
    setSaving(internshipId);
    try {
      if (savedIds.has(internshipId)) {
        await savedService.unsave(internshipId);
        setSavedIds((prev) => { const next = new Set(prev); next.delete(internshipId); return next; });
      } else {
        await savedService.save(internshipId);
        setSavedIds((prev) => new Set(prev).add(internshipId));
      }
    } finally {
      setSaving(null);
    }
  };

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
          {filtered.map((i) => {
            const isSaved = savedIds.has(i.id);
            return (
              <div key={i.id} className="bg-[#13151c] border border-white/5 rounded-xl p-5 hover:border-cyan-500/20 transition-colors flex flex-col">
                <InternshipCard internship={i} dark />
                <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                  <Link href={`/internships/${i.id}`}
                    className="flex-1 text-center text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-2 rounded-lg hover:bg-cyan-500/20 transition-colors">
                    View Details
                  </Link>
                  <button
                    disabled={saving === i.id}
                    onClick={() => toggleSave(i.id)}
                    className={`text-xs px-3 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
                      isSaved
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20'
                        : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                    }`}>
                    {saving === i.id ? '...' : isSaved ? '📌 Saved' : '📌 Save'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-white/30 text-sm">No opportunities found.</p>
      )}
    </div>
  );
}
