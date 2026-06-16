'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/services/admin.service';
import { CompanyProfile } from '@/types/user.types';
import StatCard from '@/components/cards/StatCard';
import SettingsSection from '@/components/sections/SettingsSection';
import AdminApplicationsSection from '@/components/sections/admin/AdminApplicationsSection';
import AdminReportsSection from '@/components/sections/admin/AdminReportsSection';
import AdminNotificationsSection from '@/components/sections/admin/AdminNotificationsSection';
import AdminMessagesSection from '@/components/sections/admin/AdminMessagesSection';
import AdminCompaniesSection from '@/components/sections/admin/AdminCompaniesSection';
import AdminStudentsSection from '@/components/sections/admin/AdminStudentsSection';
import AdminOpportunitiesSection from '@/components/sections/admin/AdminOpportunitiesSection';
import { useDashboardStore } from '@/store/dashboardStore';
import { useChartTheme } from '@/hooks/useChartTheme';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';

interface Stats {
  total_students: number;
  total_companies: number;
  pending_companies: number;
  total_internships: number;
}

const chartData = [
  { month: 'Jan', students: 4, companies: 2, internships: 3 },
  { month: 'Feb', students: 8, companies: 3, internships: 5 },
  { month: 'Mar', students: 12, companies: 5, internships: 8 },
  { month: 'Apr', students: 18, companies: 6, internships: 12 },
  { month: 'May', students: 22, companies: 8, internships: 15 },
  { month: 'Jun', students: 28, companies: 10, internships: 20 },
];

function AdminHome() {
  const ct = useChartTheme();
  const [stats, setStats] = useState<Stats | null>(null);
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([adminService.getStats(), adminService.getCompanies()]);
      setStats(s);
      setCompanies(c);
    } catch {
      // 403 — not admin
    } finally {
      setLoading(false);
    }
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

  const pending = companies.filter((c) => !c.is_approved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold">Dashboard</h2>
          <p className="text-white/40 text-sm mt-0.5">Platform overview and management</p>
        </div>
        <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={loading ? '—' : (stats?.total_students ?? 0)} change="+12% Last month" gradient="bg-gradient-to-br from-[#1a2a3a] to-[#0d1f2d]" />
        <StatCard label="Total Companies" value={loading ? '—' : (stats?.total_companies ?? 0)} change="+8.0% Last month" gradient="bg-gradient-to-br from-[#2a1a3a] to-[#1a0d2d]" />
        <StatCard label="Pending Approvals" value={loading ? '—' : (stats?.pending_companies ?? 0)} change="+7.0% Last month" gradient="bg-gradient-to-br from-[#2a2a1a] to-[#1f1f0d]" />
        <StatCard label="Opportunities" value={loading ? '—' : (stats?.total_internships ?? 0)} change="+5.0% Last month" gradient="bg-gradient-to-br from-[#1a2a1a] to-[#0d1f0d]" />
      </div>

      {/* Chart */}
      <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold">Platform Overview</h3>
            <p className="text-white/40 text-xs mt-1">Monthly growth across all metrics</p>
          </div>
          <select className="bg-white/5 border border-white/10 text-white/60 text-xs rounded-lg px-3 py-1.5 outline-none">
            <option>Monthly</option>
            <option>Weekly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} />
            <XAxis dataKey="month" stroke={ct.axis} tick={{ fill: ct.tick, fontSize: 12 }} />
            <YAxis stroke={ct.axis} tick={{ fill: ct.tick, fontSize: 12 }} />
            <Tooltip contentStyle={ct.tooltip} />
            <Legend wrapperStyle={{ color: ct.legendColor, fontSize: '12px' }} />
            <Line type="monotone" dataKey="students"     stroke="#06b6d4" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="companies"    stroke="#a855f7" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="internships"  stroke="#f97316" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending approvals */}
        <div className="bg-[#13151c] border border-white/5 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-1">
            Pending Approvals
            {pending.length > 0 && <span className="ml-2 text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">{pending.length}</span>}
          </h3>
          <p className="text-white/40 text-xs mb-4">Companies awaiting review</p>
          {loading ? (
            <p className="text-white/30 text-sm">Loading...</p>
          ) : pending.length === 0 ? (
            <p className="text-white/30 text-sm">No pending approvals.</p>
          ) : (
            <div className="space-y-2">
              {pending.map((company) => (
                <div key={company.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{company.company_name}</p>
                    <p className="text-white/30 text-xs mt-0.5">{company.industry} · {company.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(company.id)}
                      className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-lg hover:bg-green-500/20 transition-colors">
                      Approve
                    </button>
                    <button onClick={() => handleReject(company.id)}
                      className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-lg hover:bg-red-500/20 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All companies */}
        <div className="bg-[#13151c] border border-white/5 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-1">All Companies</h3>
          <p className="text-white/40 text-xs mb-4">Registered organizations</p>
          {loading ? (
            <p className="text-white/30 text-sm">Loading...</p>
          ) : (
            <div className="space-y-0">
              {companies.slice(0, 6).map((company) => (
                <div key={company.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{company.company_name}</p>
                    <p className="text-white/30 text-xs mt-0.5">{company.industry}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                    company.is_approved
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {company.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { active } = useDashboardStore();
  if (active === 'settings')      return <SettingsSection />;
  if (active === 'applications')  return <AdminApplicationsSection />;
  if (active === 'reports')       return <AdminReportsSection />;
  if (active === 'notifications') return <AdminNotificationsSection />;
  if (active === 'messages')      return <AdminMessagesSection />;
  if (active === 'companies')     return <AdminCompaniesSection />;
  if (active === 'students')      return <AdminStudentsSection />;
  if (active === 'opportunities') return <AdminOpportunitiesSection />;
  return <AdminHome />;
}