'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetch } from '@/hooks/useFetch';
import { useRole } from '@/hooks/useRole';
import { internshipService } from '@/services/internship.service';
import { applicationService } from '@/services/application.service';
import { formatDate, isDeadlinePassed } from '@/lib/helpers';
import { OPPORTUNITY_TYPES } from '@/lib/constants';

export default function InternshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isStudent } = useRole();
  const { data: internship, loading } = useFetch(() => internshipService.getById(Number(id)), [id]);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    setError('');
    try {
      await applicationService.apply(Number(id), coverLetter);
      setSuccess(true);
      setShowModal(false);
      router.push('/applications');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Failed to apply.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;
  if (!internship) return <div className="p-8 text-gray-400">Opportunity not found.</div>;

  const typeLabel = OPPORTUNITY_TYPES.find((t) => t.value === internship.type)?.label ?? internship.type;
  const expired = isDeadlinePassed(internship.deadline);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <button onClick={() => router.back()} className="text-sm text-indigo-600 hover:underline mb-6 block">← Back</button>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">{typeLabel}</span>
          {expired && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Expired</span>}
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">{internship.title}</h1>
        {internship.company && (
          <p className="text-indigo-600 font-medium mb-4">{internship.company.company_name} · {internship.company.industry}</p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
          <p>📍 {internship.location}</p>
          <p>⏱ {internship.duration}</p>
          <p>📅 Deadline: {formatDate(internship.deadline)}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600 whitespace-pre-line">{internship.description}</p>
        </div>

        {internship.requirements && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Requirements</h3>
            <p className="text-gray-600 whitespace-pre-line">{internship.requirements}</p>
          </div>
        )}

        {success && <p className="text-green-600 bg-green-50 p-3 rounded-lg text-sm mb-4">Application submitted!</p>}

        {isStudent && !expired && (
          <button onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium">
            Apply Now
          </button>
        )}
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Apply for {internship.title}</h3>
            {error && <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-lg">{error}</p>}
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                <textarea rows={5} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the company why you're a great fit..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={applying}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium">
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
