'use client';
import { useState, useEffect } from 'react';
import { studentService } from '@/services/student.service';
import { StudentProfile } from '@/types/user.types';

export default function CVSection() {
  const [profile, setProfile] = useState<Partial<StudentProfile>>({});
  const [cvUrl, setCvUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    studentService.getProfile()
      .then((p) => { setProfile(p ?? {}); setCvUrl(p?.cv_url ?? ''); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await studentService.updateProfile({ ...profile, cv_url: cvUrl });
      setStatus({ type: 'success', message: 'CV link saved successfully.' });
    } catch {
      setStatus({ type: 'error', message: 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-white text-xl font-semibold">CV &amp; Documents</h2>
        <p className="text-white/40 text-sm mt-0.5">Manage your CV and supporting documents</p>
      </div>

      {/* CV link */}
      <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
        <h3 className="text-white/70 text-sm font-medium mb-4">CV Link</h3>
        <p className="text-white/30 text-xs mb-4">
          Paste a link to your CV (Google Drive, Dropbox, OneDrive, etc.). Make sure it&apos;s set to public view.
        </p>

        {status && (
          <p className={`text-sm mb-4 p-3 rounded-lg border ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {status.message}
          </p>
        )}

        {loading ? <p className="text-white/30 text-sm">Loading...</p> : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5">CV URL</label>
              <input type="url" value={cvUrl} onChange={(e) => setCvUrl(e.target.value)}
                placeholder="https://drive.google.com/file/..."
                className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500/50 transition-colors" />
            </div>

            {cvUrl && (
              <a href={cvUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Preview CV
              </a>
            )}

            <button type="submit" disabled={saving}
              className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-6 py-2.5 rounded-lg disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : 'Save CV Link'}
            </button>
          </form>
        )}
      </div>

      {/* Profile completeness */}
      <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
        <h3 className="text-white/70 text-sm font-medium mb-4">Profile Completeness</h3>
        <div className="space-y-3">
          {[
            { label: 'University',    done: !!profile.university },
            { label: 'Course',        done: !!profile.course },
            { label: 'Year of Study', done: !!profile.year_of_study },
            { label: 'Bio',           done: !!profile.bio },
            { label: 'CV Link',       done: !!cvUrl },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <p className="text-white/60 text-sm">{item.label}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                item.done
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-white/5 text-white/30 border-white/10'
              }`}>
                {item.done ? '✓ Done' : 'Missing'}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/30 mb-1.5">
            <span>Completion</span>
            <span>{Math.round(([!!profile.university, !!profile.course, !!profile.year_of_study, !!profile.bio, !!cvUrl].filter(Boolean).length / 5) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
              style={{ width: `${([!!profile.university, !!profile.course, !!profile.year_of_study, !!profile.bio, !!cvUrl].filter(Boolean).length / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Saved opportunities */}
      <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
        <h3 className="text-white/70 text-sm font-medium mb-2">Saved Opportunities</h3>
        <p className="text-white/30 text-xs mb-4">Bookmark listings to apply later</p>
        <div className="text-center py-6">
          <p className="text-3xl mb-2">📌</p>
          <p className="text-white/30 text-sm">No saved opportunities yet.</p>
          <p className="text-white/20 text-xs mt-1">Browse opportunities and save ones you like.</p>
        </div>
      </div>
    </div>
  );
}
