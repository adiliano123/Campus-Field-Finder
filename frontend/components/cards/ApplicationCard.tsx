import { Application } from '@/types/internship.types';
import { formatDate } from '@/lib/helpers';
import { APPLICATION_STATUSES } from '@/lib/constants';

interface Props {
  application: Application;
  dark?: boolean;
}

const colorMap: Record<string, string> = {
  yellow: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  green: 'bg-green-500/10 text-green-400 border border-green-500/20',
  red: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

const lightColorMap: Record<string, string> = {
  yellow: 'bg-yellow-100 text-yellow-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
};

export default function ApplicationCard({ application, dark = false }: Props) {
  const status = APPLICATION_STATUSES[application.status];

  if (dark) {
    return (
      <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
        <div>
          <p className="text-white/80 text-sm font-medium">{application.internship?.title ?? 'Opportunity'}</p>
          {application.internship?.company && (
            <p className="text-cyan-500/70 text-xs mt-0.5">{application.internship.company.company_name}</p>
          )}
          <p className="text-white/30 text-xs mt-0.5">{formatDate(application.applied_at)}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorMap[status.color]}`}>
          {status.label}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800">{application.internship?.title ?? 'Opportunity'}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${lightColorMap[status.color]}`}>
          {status.label}
        </span>
      </div>
      {application.internship?.company && (
        <p className="text-sm text-indigo-600 mb-1">{application.internship.company.company_name}</p>
      )}
      <p className="text-sm text-gray-400">Applied: {formatDate(application.applied_at)}</p>
    </div>
  );
}
