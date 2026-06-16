'use client';
import { useFetch } from '@/hooks/useFetch';
import { adminService } from '@/services/admin.service';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', students: 4,  companies: 2,  applications: 6  },
  { month: 'Feb', students: 8,  companies: 3,  applications: 14 },
  { month: 'Mar', students: 12, companies: 5,  applications: 22 },
  { month: 'Apr', students: 18, companies: 6,  applications: 31 },
  { month: 'May', students: 22, companies: 8,  applications: 40 },
  { month: 'Jun', students: 28, companies: 10, applications: 55 },
];

const typeData = [
  { name: 'Internship',          value: 40, fill: '#06b6d4' },
  { name: 'Field Training',      value: 25, fill: '#a855f7' },
  { name: 'Industrial Training', value: 20, fill: '#f97316' },
  { name: 'Attachment',          value: 15, fill: '#22c55e' },
];


const tooltipStyle = {
  backgroundColor: '#1a1d27',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
};

export default function AdminReportsSection() {
  const { data: stats } = useFetch(() => adminService.getStats());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold">Reports &amp; Analysis</h2>
          <p className="text-white/40 text-sm mt-0.5">Platform performance and growth metrics</p>
        </div>
        <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students',    value: stats?.total_students ?? '—',    color: 'text-cyan-400',   change: '+12%' },
          { label: 'Total Companies',   value: stats?.total_companies ?? '—',   color: 'text-purple-400', change: '+8%'  },
          { label: 'Opportunities',     value: stats?.total_internships ?? '—', color: 'text-orange-400', change: '+15%' },
          { label: 'Pending Approvals', value: stats?.pending_companies ?? '—', color: 'text-yellow-400', change: ''     },
        ].map((k) => (
          <div key={k.label} className="bg-[#13151c] border border-white/5 rounded-xl p-5">
            <p className="text-white/40 text-xs">{k.label}</p>
            <p className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</p>
            {k.change && <p className="text-white/30 text-xs mt-1">{k.change} this month</p>}
          </div>
        ))}
      </div>

      {/* Growth chart */}
      <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-1">Platform Growth</h3>
        <p className="text-white/40 text-xs mb-6">Monthly registrations and activity</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }} />
            <Line type="monotone" dataKey="students"     stroke="#06b6d4" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="companies"    stroke="#a855f7" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="applications" stroke="#f97316" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by month bar */}
        <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-1">Applications per Month</h3>
          <p className="text-white/40 text-xs mb-6">Total submissions over time</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="applications" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Opportunity type breakdown */}
        <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-1">Opportunity Types</h3>
          <p className="text-white/40 text-xs mb-4">Distribution by category</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {typeData.map((item, i) => <Cell key={i} fill={item.fill} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5">
              {typeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                  <p className="text-white/60 text-xs">{item.name}</p>
                  <p className="text-white/40 text-xs ml-auto">{item.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
