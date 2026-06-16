'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/services/admin.service';
import { CompanyProfile } from '@/types/user.types';

export default function AdminCompaniesSection() {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setCompanies(await adminService.getCompanies()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id: number) => {
    await adminService.approveCompany(id);
    load();
  };

  const handleReject = async (id: number) => {
    await adminService.rejectCompany(id);
    load();
  };

  const filtered = companies.filter((c) =>
    c.company_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.industry ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-semibold">Companies</h2>
        <p className="text-white/40 text-sm mt-0.5">{companies.length} registered organizations</p>
      </div>

      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 max-w-sm">
        <svg className="w-4 h-4 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies..."
          className="bg-transparent text-sm text-white/70 placeholder-white/30 outline-none w-full" />
      </div>

      <div className="bg-[#13151c] border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-white/30 text-sm p-5">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-white/30 text-sm p-5">No companies found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Company</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Industry</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Location</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Status</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3.5 text-white/80 text-sm font-medium">{c.company_name}</td>
                  <td className="px-5 py-3.5 text-white/50 text-sm">{c.industry ?? '—'}</td>
                  <td className="px-5 py-3.5 text-white/50 text-sm">{c.location ?? '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      c.is_approved
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {c.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      {!c.is_approved ? (
                        <button onClick={() => handleApprove(c.id)}
                          className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-lg hover:bg-green-500/20 transition-colors">
                          Approve
                        </button>
                      ) : (
                        <button onClick={() => handleReject(c.id)}
                          className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-lg hover:bg-red-500/20 transition-colors">
                          Revoke
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
