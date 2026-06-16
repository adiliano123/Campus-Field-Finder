'use client';
import { useFetch } from '@/hooks/useFetch';
import { applicationService } from '@/services/application.service';
import { APPLICATION_STATUSES } from '@/lib/constants';
import { formatDate } from '@/lib/helpers';

const colorMap: Record<string, string> = {
  yellow: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  green:  'bg-green-500/10 text-green-400 border border-green-500/20',
  red:    'bg-red-500/10 text-red-400 border border-red-500/20',
};

export default function ApplicationsSection() {
  const { data: applications, loading } = useFetch(() => applicationService.getMyApplications());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-semibold">My Applications</h2>
        <p className="text-white/40 text-sm mt-0.5">Track all your submitted applications</p>
      </div>

      {loading ? (
        <p className="text-white/30 text-sm">Loading...</p>
      ) : !applications?.length ? (
        <div className="bg-[#13151c] border border-white/5 rounded-xl p-8 text-center">
          <p className="text-white/30 text-sm">No applications yet. Browse opportunities to get started.</p>
        </div>
      ) : (
        <div className="bg-[#13151c] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Opportunity</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Company</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Applied</th>
                <th className="text-left text-white/40 text-xs font-medium px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const status = APPLICATION_STATUSES[app.status];
                return (
                  <tr key={app.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5 text-white/80 text-sm font-medium">{app.internship?.title ?? '—'}</td>
                    <td className="px-5 py-3.5 text-cyan-500/70 text-sm">{app.internship?.company?.company_name ?? '—'}</td>
                    <td className="px-5 py-3.5 text-white/40 text-sm">{formatDate(app.applied_at)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorMap[status.color]}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
