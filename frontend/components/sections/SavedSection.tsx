'use client';
import { useState } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { useFetch } from '@/hooks/useFetch';
import { savedService } from '@/services/saved.service';
import InternshipCard from '@/components/cards/InternshipCard';
import Link from 'next/link';

export default function SavedSection() {
  const setActive = useDashboardStore((s) => s.setActive);
  const { data: saved, loading, refetch } = useFetch(() => savedService.getAll());
  const [removing, setRemoving] = useState<number | null>(null);

  const handleUnsave = async (internshipId: number) => {
    setRemoving(internshipId);
    try {
      await savedService.unsave(internshipId);
      refetch();
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-white text-xl font-semibold">Saved Opportunities</h2>
        <p className="text-white/40 text-sm mt-0.5">Opportunities you bookmarked for later</p>
      </div>

      {loading ? (
        <p className="text-white/30 text-sm">Loading saved opportunities...</p>
      ) : !saved?.length ? (
        <div className="bg-[#13151c] border border-white/5 rounded-xl p-10 text-center">
          <p className="text-5xl mb-4">📌</p>
          <p className="text-white/60 font-medium mb-1">No saved opportunities yet</p>
          <p className="text-white/30 text-sm mb-6">
            When you find an opportunity you like, save it here to apply later.
          </p>
          <button onClick={() => setActive('browse')}
            className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
            Browse Opportunities
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {saved.map((internship) => (
            <div key={internship.id} className="bg-[#13151c] border border-white/5 rounded-xl p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <InternshipCard internship={internship} dark />
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Link href={`/internships/${internship.id}`}
                  className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-lg hover:bg-cyan-500/20 transition-colors text-center">
                  View
                </Link>
                <button
                  disabled={removing === internship.id}
                  onClick={() => handleUnsave(internship.id)}
                  className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 disabled:opacity-50 transition-colors">
                  {removing === internship.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
