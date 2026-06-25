'use client';
import { useState, useEffect } from 'react';
import { studentService } from '@/services/student.service';
import { documentService, Document } from '@/services/document.service';
import { StudentProfile } from '@/types/user.types';

const DOC_TYPES: { value: Document['type']; label: string }[] = [
  { value: 'cv', label: 'CV / Resume' },
  { value: 'transcript', label: 'Transcript' },
  { value: 'recommendation', label: 'Recommendation Letter' },
  { value: 'other', label: 'Other' },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CVSection() {
  const [profile, setProfile] = useState<Partial<StudentProfile>>({});
  const [cvUrl, setCvUrl] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [uploadType, setUploadType] = useState<Document['type']>('cv');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadDocuments = () =>
    documentService.getAll().then(setDocuments).catch(() => setDocuments([]));

  useEffect(() => {
    Promise.all([
      studentService.getProfile().then((p) => { setProfile(p ?? {}); setCvUrl(p?.cv_url ?? ''); }).catch(() => {}),
      loadDocuments(),
    ]).finally(() => setLoading(false));
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      await documentService.upload(file, uploadType);
      await loadDocuments();
      setStatus({ type: 'success', message: 'Document uploaded successfully.' });
    } catch {
      setStatus({ type: 'error', message: 'Upload failed. Use PDF or Word files under 5MB.' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await documentService.delete(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const hasCv = !!cvUrl || documents.some((d) => d.type === 'cv');

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-white text-xl font-semibold">CV &amp; Documents</h2>
        <p className="text-white/40 text-sm mt-0.5">Manage your CV and supporting documents</p>
      </div>

      {status && (
        <p className={`text-sm p-3 rounded-lg border ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          {status.message}
        </p>
      )}

      {/* File uploads */}
      <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
        <h3 className="text-white/70 text-sm font-medium mb-4">Upload Documents</h3>
        <p className="text-white/30 text-xs mb-4">
          Upload PDF or Word files (max 5MB). CV, transcripts, and recommendation letters are supported.
        </p>

        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5">Document Type</label>
            <select value={uploadType} onChange={(e) => setUploadType(e.target.value as Document['type'])}
              className="bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500/50 transition-colors">
              {DOC_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <label className="cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
            {uploading ? 'Uploading...' : 'Choose File'}
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
        </div>

        {loading ? (
          <p className="text-white/30 text-sm mt-4">Loading documents...</p>
        ) : documents.length > 0 ? (
          <div className="mt-5 space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div className="min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-white/30 text-xs mt-0.5 capitalize">{doc.type.replace(/_/g, ' ')} · {formatSize(doc.size)}</p>
                </div>
                <div className="flex gap-2 shrink-0 ml-3">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-lg hover:bg-cyan-500/20 transition-colors">
                    View
                  </a>
                  <button disabled={deleting === doc.id} onClick={() => handleDelete(doc.id)}
                    className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-lg hover:bg-red-500/20 disabled:opacity-50 transition-colors">
                    {deleting === doc.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/30 text-sm mt-4">No documents uploaded yet.</p>
        )}
      </div>

      {/* CV link */}
      <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
        <h3 className="text-white/70 text-sm font-medium mb-4">CV Link (optional)</h3>
        <p className="text-white/30 text-xs mb-4">
          Or paste a link to your CV (Google Drive, Dropbox, OneDrive, etc.). Make sure it&apos;s set to public view.
        </p>

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
                Preview CV Link
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
            { label: 'CV',            done: hasCv },
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

        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/30 mb-1.5">
            <span>Completion</span>
            <span>{Math.round(([!!profile.university, !!profile.course, !!profile.year_of_study, !!profile.bio, hasCv].filter(Boolean).length / 5) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
              style={{ width: `${([!!profile.university, !!profile.course, !!profile.year_of_study, !!profile.bio, hasCv].filter(Boolean).length / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
