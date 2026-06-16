'use client';
import { useDashboardStore } from '@/store/dashboardStore';

export default function SavedSection() {
  const setActive = useDashboardStore((s) => s.setActive);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-white text-xl font-semibold">Saved Opportunities</h2>
        <p className="text-white/40 text-sm mt-0.5">Opportunities you bookmarked for later</p>
      </div>

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
    </div>
  );
}
