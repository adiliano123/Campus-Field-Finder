'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { studentService } from '@/services/student.service';
import { companyService } from '@/services/company.service';
import { StudentProfile, CompanyProfile } from '@/types/user.types';

export default function ProfilePage() {
  const { user } = useAuth();
  const { isStudent, isCompany } = useRole();
  const [studentForm, setStudentForm] = useState<Partial<StudentProfile>>({});
  const [companyForm, setCompanyForm] = useState<Partial<CompanyProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isStudent) {
      studentService.getProfile()
        .then((p) => setStudentForm(p ?? {}))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (isCompany) {
      companyService.getProfile()
        .then((p) => setCompanyForm(p ?? {}))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isStudent, isCompany]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isStudent) await studentService.updateProfile(studentForm);
      else if (isCompany) await companyService.updateProfile(companyForm);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>

      {/* Account header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-2xl">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xl font-semibold text-gray-800">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <p className="text-xs text-indigo-600 capitalize mt-1">{user?.role}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading profile...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">
            {isStudent ? 'Student Details' : isCompany ? 'Company Details' : 'Account Details'}
          </h3>

          {saved && <p className="text-green-600 text-sm mb-4 bg-green-50 p-3 rounded-lg">Profile saved.</p>}
          {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

          <form onSubmit={handleSave} className="space-y-4">
            {isStudent && (
              <>
                <Field label="University" value={studentForm.university ?? ''} onChange={(v) => setStudentForm({ ...studentForm, university: v })} />
                <Field label="Course" value={studentForm.course ?? ''} onChange={(v) => setStudentForm({ ...studentForm, course: v })} />
                <Field label="Year of Study" type="number" value={String(studentForm.year_of_study ?? '')} onChange={(v) => setStudentForm({ ...studentForm, year_of_study: Number(v) })} />
                <Field label="CV URL" value={studentForm.cv_url ?? ''} onChange={(v) => setStudentForm({ ...studentForm, cv_url: v })} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea rows={3} value={studentForm.bio ?? ''} onChange={(e) => setStudentForm({ ...studentForm, bio: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </>
            )}

            {isCompany && (
              <>
                <Field label="Company Name" value={companyForm.company_name ?? ''} onChange={(v) => setCompanyForm({ ...companyForm, company_name: v })} required />
                <Field label="Industry" value={companyForm.industry ?? ''} onChange={(v) => setCompanyForm({ ...companyForm, industry: v })} />
                <Field label="Location" value={companyForm.location ?? ''} onChange={(v) => setCompanyForm({ ...companyForm, location: v })} />
                <Field label="Website" value={companyForm.website ?? ''} onChange={(v) => setCompanyForm({ ...companyForm, website: v })} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={companyForm.description ?? ''} onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </>
            )}

            {(isStudent || isCompany) && (
              <button type="submit" disabled={saving}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium">
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>
  );
}
