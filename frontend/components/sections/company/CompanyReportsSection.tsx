'use client';
import { useFetch } from '@/hooks/useFetch';
import { internshipService } from '@/services/internship.service';
import { companyService } from '@/services/company.service';
import { applicationService } from '@/services/application.service';
import { useState, useEffect } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const typeColors = ['#06b6d4', '#a855f7', '#f97316', '#22c55e'];

const tooltipStyle = {
  backgroundColor: '#1a1d27',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
};

export default function CompanyReportsSection() {
  const { data: internships } = useFetch(() => internshipService.getAll());
  const { data: stats } = useFetch(() => companyService.getStats());
  const [monthlyApps, setMonthlyApps] = useState<{ month: string; applications: number; accepted: number }[]>([]);

  useEffect(() => {
    if (!internships?.length) {
      setMonthlyApps([]);
      return;
    }
    Promise.all(internships.map((i) => applicationService.getByInternship(i.id)))
      .then((allApps) => {
        const flat = allApps.flat();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        const data = months.slice(0, now.getMonth() + 1).map((month, idx) => ({
          month,
          applications: flat.filter((a) => new Date(a.applied_at).getMonth() === idx).length,
          accepted: flat.filter((a) => a.status === 'accepted' && new Date(a.applied_at).getMonth() === idx).length,
        }));
        setMonthlyApps(data);
      })
      .catch(() => setMonthlyApps([]));
  }, [internships]);

  // Build type distribution from real data
  const typeCounts: Record<string, number> = {};
  (internships ?? []).forEach((i) => {
    typeCounts[i.type] = (typeCounts[i.type] ?? 0) + 1;
  });
  const typeData = Object.entries(typeCounts).map(([name, value], i) => ({
    name,
    value,
    fill: typeColors[i % typeColors.length],
  }));

  const totalApps     = stats?.total_applications ?? 0;
  const totalAccepted = stats?.accepted ?? 0;
  const acceptRate    = totalApps > 0 ? Math.round((totalAccepted / totalApps) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold">Reports &amp; Analysis</h2>
          <p className="text-white/40 text-sm mt-0.5">Your recruitment performance overview</p>
        </div>
        <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Listings',   value: internships?.length ?? '—', color: 'text-cyan-400' },
          { label: 'Total Applications', value: totalApps,                  color: 'text-purple-400' },
          { label: 'Accepted',          value: totalAccepted,               color: 'text-green-400' },
          { label: 'Acceptance Rate',   value: `${acceptRate}%`,            color: 'text-orange-400' },
        ].map((k) => (
          <div key={k.label} className="bg-[#13151c] border border-white/5 rounded-xl p-5">
            <p className="text-white/40 text-xs">{k.label}</p>
            <p className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Applications trend */}
      <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-1">Application Trends</h3>
        <p className="text-white/40 text-xs mb-6">Monthly applications vs accepted</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyApps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }} />
            <Line type="monotone" dataKey="applications" stroke="#06b6d4" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="accepted"     stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-1">Applications per Month</h3>
          <p className="text-white/40 text-xs mb-6">Total submissions</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyApps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="applications" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-1">Listing Types</h3>
          <p className="text-white/40 text-xs mb-4">Distribution of your postings</p>
          {typeData.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-8">No listings yet.</p>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={160}>
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {typeData.map((item, i) => <Cell key={i} fill={item.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {typeData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: typeColors[i % typeColors.length] }} />
                    <p className="text-white/50 text-xs capitalize">{item.name.replace(/_/g, ' ')}</p>
                    <p className="text-white/30 text-xs ml-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
