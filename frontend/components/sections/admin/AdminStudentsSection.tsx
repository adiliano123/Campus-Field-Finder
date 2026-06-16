'use client';
import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { adminService } from '@/services/admin.service';

interface StudentUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  student?: { university?: string; course?: string; year_of_study?: number };
}

export default function AdminStudentsSection() {
  const { data: students, loading } = useFetch(() => adminService.getStudents()) as { data: StudentUser[] | null; loading: boolean };
  const [search, setSearch] = useState('');

  const filtered = (students ?? []).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.student?.university ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-semibold">Students</h2>
        <p className="text-white/40 text-sm mt-0.5">{students?.length ?? 0} registered students</p>
      </div>

      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 max-w-sm">
        <svg className="w-4 h-4 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students..."
          className="bg-transparent text-sm text-white/70 placeholder-white/30 outline-none w-full" />
      </div>

      <div className="bg-[#13151c] border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-white/30 text-sm p-5">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-white/30 text-sm p-5">No students found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Name</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Email</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">University</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Course</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Year</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white/80 text-sm font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-white/50 text-sm">{s.email}</td>
                  <td className="px-5 py-3.5 text-white/50 text-sm">{s.student?.university ?? '—'}</td>
                  <td className="px-5 py-3.5 text-white/50 text-sm">{s.student?.course ?? '—'}</td>
                  <td className="px-5 py-3.5 text-white/50 text-sm">{s.student?.year_of_study ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
