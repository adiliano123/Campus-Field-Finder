'use client';
import { useFetch } from '@/hooks/useFetch';
import { applicationService } from '@/services/application.service';
import ApplicationCard from '@/components/cards/ApplicationCard';

export default function ApplicationsPage() {
  const { data: applications, loading } = useFetch(() => applicationService.getMyApplications());

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Applications</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : applications?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map((app) => <ApplicationCard key={app.id} application={app} />)}
        </div>
      ) : (
        <p className="text-gray-400">You haven&apos;t applied to any opportunities yet.</p>
      )}
    </div>
  );
}
