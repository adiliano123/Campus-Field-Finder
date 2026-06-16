'use client';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import { applicationService } from '@/services/application.service';
import { internshipService } from '@/services/internship.service';
import StatCard from '@/components/cards/StatCard';
import ApplicationCard from '@/components/cards/ApplicationCard';
import InternshipCard from '@/components/cards/InternshipCard';
import BrowseSection from '@/components/sections/BrowseSection';
import ApplicationsSection from '@/components/sections/ApplicationsSection';
import ProfileSection from '@/components/sections/ProfileSection';
import SettingsSection from '@/components/sections/SettingsSection';
import NotificationsSection from '@/components/sections/NotificationsSection';
import MessagesSection from '@/components/sections/MessagesSection';
import CVSection from '@/components/sections/CVSection';
import SavedSection from '@/components/sections/SavedSection';
import { useDashboardStore } from '@/store/dashboardStore';
import { useChartTheme } from '@/hooks/useChartTheme';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const chartData = [
  { month: 'Jan', applications: 0, accepted: 0 },
  { month: 'Feb', applications: 1, accepted: 0 },
  { month: 'Mar', applications: 2, accepted: 1 },
  { month: 'Apr', applications: 3, accepted: 1 },
  { month: 'May', applications: 2, accepted: 2 },
  { month: 'Jun', applications: 4, accepted: 2 },
];

function DashboardHome() {
  const { user } = useAuth();
  const ct = useChartTheme();
  const { data: applications, loading: loadingApps } = useFetch(() => applicationService.getMyApplications());
  const { data: internships, loading: loadingInternships } = useFetch(() => internshipService.getAll());

  const total    = applications?.length ?? 0;
  const accepted = applications?.filter((a) => a.status === 'accepted').length ?? 0;
  const pending  = applications?.filter((a) => a.status === 'pending').length ?? 0;
  const rejected = applications?.filter((a) => a.status === 'rejected').length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold">Dashboard</h2>
          <p className="text-white/40 text-sm mt-0.5">Welcome back, {user?.name}</p>
        </div>
        <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Applications" value={total}    change="+12% Last month" gradient="bg-gradient-to-br from-[#1a2a3a] to-[#0d1f2d]" />
        <StatCard label="Accepted"           value={accepted} change="+8.0% Last month" gradient="bg-gradient-to-br from-[#2a1a3a] to-[#1a0d2d]" />
        <StatCard label="Pending"            value={pending}  change="+7.0% Last month" gradient="bg-gradient-to-br from-[#1a2a1a] to-[#0d1f0d]" />
        <StatCard label="Rejected"           value={rejected} change="+5.0% Last month" gradient="bg-gradient-to-br from-[#2a1a1a] to-[#1f0d0d]" />
      </div>

      <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold">Application Overview</h3>
            <p className="text-white/40 text-xs mt-1">Monthly application activity</p>
          </div>
          <select className="bg-white/5 border border-white/10 text-white/60 text-xs rounded-lg px-3 py-1.5 outline-none">
            <option>Monthly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} />
            <XAxis dataKey="month" stroke={ct.axis} tick={{ fill: ct.tick, fontSize: 12 }} />
            <YAxis stroke={ct.axis} tick={{ fill: ct.tick, fontSize: 12 }} />
            <Tooltip contentStyle={ct.tooltip} />
            <Legend wrapperStyle={{ color: ct.legendColor, fontSize: '12px' }} />
            <Line type="monotone" dataKey="applications" stroke="#06b6d4" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="accepted"     stroke="#a855f7" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#13151c] border border-white/5 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-1">Recent Applications</h3>
          <p className="text-white/40 text-xs mb-4">Your latest submissions</p>
          {loadingApps ? <p className="text-white/30 text-sm">Loading...</p> : applications?.length ? (
            <div>{applications.slice(0, 4).map((app) => <ApplicationCard key={app.id} application={app} dark />)}</div>
          ) : <p className="text-white/30 text-sm">No applications yet.</p>}
        </div>
        <div className="bg-[#13151c] border border-white/5 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-1">Latest Opportunities</h3>
          <p className="text-white/40 text-xs mb-4">Recently posted listings</p>
          {loadingInternships ? <p className="text-white/30 text-sm">Loading...</p> : (
            <div>{internships?.slice(0, 4).map((i) => <InternshipCard key={i.id} internship={i} dark />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { active } = useDashboardStore();
  if (active === 'browse')        return <BrowseSection />;
  if (active === 'applications')  return <ApplicationsSection />;
  if (active === 'profile')       return <ProfileSection />;
  if (active === 'settings')      return <SettingsSection />;
  if (active === 'notifications') return <NotificationsSection />;
  if (active === 'messages')      return <MessagesSection />;
  if (active === 'cv')            return <CVSection />;
  if (active === 'saved')         return <SavedSection />;
  return <DashboardHome />;
}
