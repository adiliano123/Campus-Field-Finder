import Link from 'next/link';
import { Internship } from '@/types/internship.types';
import { formatDate, isDeadlinePassed } from '@/lib/helpers';
import { OPPORTUNITY_TYPES } from '@/lib/constants';

interface Props {
  internship: Internship;
  dark?: boolean;
}

export default function InternshipCard({ internship, dark = false }: Props) {
  const typeLabel = OPPORTUNITY_TYPES.find((t) => t.value === internship.type)?.label ?? internship.type;
  const expired = isDeadlinePassed(internship.deadline);

  if (dark) {
    return (
      <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
        <div>
          <p className="text-white/80 text-sm font-medium">{internship.title}</p>
          {internship.company && (
            <p className="text-cyan-500/70 text-xs mt-0.5">{internship.company.company_name}</p>
          )}
          <p className="text-white/30 text-xs mt-0.5">{internship.location} · {formatDate(internship.deadline)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
            {typeLabel}
          </span>
          {expired && <span className="text-xs text-red-400">Expired</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">{typeLabel}</span>
        {expired && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Expired</span>}
      </div>
      <h3 className="font-semibold text-gray-800 text-lg mb-1">{internship.title}</h3>
      {internship.company && (
        <p className="text-sm text-indigo-600 mb-2">{internship.company.company_name}</p>
      )}
      <p className="text-sm text-gray-500 mb-1">{internship.location} · {internship.duration}</p>
      <p className="text-sm text-gray-400 mb-4">Deadline: {formatDate(internship.deadline)}</p>
      <Link href={`/internships/${internship.id}`}
        className="text-sm text-indigo-600 font-medium hover:underline">
        View Details →
      </Link>
    </div>
  );
}
