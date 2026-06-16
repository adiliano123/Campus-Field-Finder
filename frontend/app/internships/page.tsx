'use client';
import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { internshipService } from '@/services/internship.service';
import InternshipCard from '@/components/cards/InternshipCard';
import { OPPORTUNITY_TYPES } from '@/lib/constants';

export default function InternshipsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const { data: internships, loading } = useFetch(() => internshipService.getAll());

  const filtered = internships?.filter((i) => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase());
    const matchType = type ? i.type === type : true;
    return matchSearch && matchType;
  }) ?? [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse Opportunities</h2>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Types</option>
          {OPPORTUNITY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading opportunities...</p>
      ) : filtered.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((i) => <InternshipCard key={i.id} internship={i} />)}
        </div>
      ) : (
        <p className="text-gray-400">No opportunities found.</p>
      )}
    </div>
  );
}
