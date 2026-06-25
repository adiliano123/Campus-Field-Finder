'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { internshipService } from '@/services/internship.service';
import { companyService } from '@/services/company.service';
import { Internship } from '@/types/internship.types';
import StatCard from '@/components/cards/StatCard';
import InternshipCard from '@/components/cards/InternshipCard';
import PostOpportunitySection from '@/components/sections/PostOpportunitySection';
import ProfileSection from '@/components/sections/ProfileSection';
import SettingsSection from '@/components/sections/SettingsSection';
import NotificationsSection from '@/components/sections/NotificationsSection';
import MessagesSection from '@/components/sections/MessagesSection';
import CompanyApplicationsSection from '@/components/sections/company/CompanyApplicationsSection';
import CompanyOpportunitiesSection from '@/components/sections/company/CompanyOpportunitiesSection';
import CompanyReportsSection from '@/components/sections/company/CompanyReportsSection';
import AdminStudentsSection from '@/components/sections/admin/AdminStudentsSection';
import { useDashboardStore } from '@/store/dashboardStore';
import { useChartTheme } from '@/hooks/useChartTheme';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const chartData = [
  { month: 'Jan', applications: 2 },
  { month: 'Feb', applications: 5 },
  { month: 'Mar', applications: 8 },
  { month: 'Apr', applications: 6 },
  { month: 'May', applications: 12 },
  { month: 'Jun', applications: 9 },
];

function CompanyHome() {
  const { user } = useAuth();
  const ct = useChartTheme();
  const setActive = useDashboardStore((s) => s.setActive);
  const [opportunities, setOpportunities] = useState<Internship[]>([]);
  const [stats, setStats] = useState<{ total_applications: number; accepted: number; pending: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([
        internshipService.getAll(),
        companyService.getStats().catch(() => null),
      ]);
      setOpportunities(list);
      setStats(s);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this opportunity?')) return;
    await internshipService.delete(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold">Dashboard</h2>
          <p className="text-white/40 text-sm mt-0.5">Welcome, {user?.name}</p>
        </div>
        <button onClick={() => setActive('post')}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + Post Opportunity
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Listings"    value={opportunities.length}              change="Total posted"       gradient="bg-gradient-to-br from-[#1a2a3a] to-[#0d1f2d]" />
        <StatCard label="Total Applications" value={stats?.total_applications ?? '—'}  change="Across all listings" gradient="bg-gradient-to-br from-[#2a1a3a] to-[#1a0d2d]" />
        <StatCard label="Accepted"           value={stats?.accepted ?? '—'}          change="This month"          gradient="bg-gradient-to-br from-[#1a2a1a] to-[#0d1f0d]" />
        <StatCard label="Pending Review"     value={stats?.pending ?? '—'}           change="Awaiting decision"   gradient="bg-gradient-to-br from-[#2a2a1a] to-[#1f1f0d]" />
      </div>

      <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-1">Applications Overview</h3>
        <p className="text-white/40 text-xs mb-6">Monthly applications received</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1a1d27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="applications" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#13151c] border border-white/5 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-1">Your Opportunities</h3>
        <p className="text-white/40 text-xs mb-4">Manage your posted listings</p>
        {loading ? <p className="text-white/30 text-sm">Loading...</p> : opportunities.length === 0 ? (
          <p className="text-white/30 text-sm">No opportunities posted yet.</p>
        ) : (
          <div>
            {opportunities.map((i) => (
              <div key={i.id} className="flex items-center gap-2 border-b border-white/5 last:border-0">
                <div className="flex-1"><InternshipCard internship={i} dark /></div>
                <button onClick={() => handleDelete(i.id)}
                  className="text-xs text-red-400/50 hover:text-red-400 transition-colors shrink-0 px-2">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompanyDashboard() {
  const { active } = useDashboardStore();
  if (active === 'post')          return <PostOpportunitySection />;
  if (active === 'opportunities') return <CompanyOpportunitiesSection />;
  if (active === 'applications')  return <CompanyApplicationsSection />;
  if (active === 'reports')       return <CompanyReportsSection />;
  if (active === 'students')      return <AdminStudentsSection />;
  if (active === 'profile')       return <ProfileSection />;
  if (active === 'settings')      return <SettingsSection />;
  if (active === 'notifications') return <NotificationsSection />;
  if (active === 'messages')      return <MessagesSection />;
  return <CompanyHome />;
}
