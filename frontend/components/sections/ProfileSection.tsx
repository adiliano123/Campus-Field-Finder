'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { studentService } from '@/services/student.service';
import { companyService } from '@/services/company.service';
import { StudentProfile, CompanyProfile } from '@/types/user.types';

function DarkField({ label, value, onChange, type = 'text', required = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-colors" />
    </div>
  );
}

export default function ProfileSection() {
  const { user } = useAuth();
  const { isStudent, isCompany } = useRole();
  const [studentForm, setStudentForm] = useState<Partial<StudentProfile>>({});
  const [companyForm, setCompanyForm] = useState<Partial<CompanyProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isStudent) {
      studentService.getProfile().then((p) => setStudentForm(p ?? {})).catch(() => {}).finally(() => setLoading(false));
    } else if (isCompany) {
      companyService.getProfile().then((p) => setCompanyForm(p ?? {})).catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isStudent, isCompany]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      if (isStudent) await studentService.updateProfile(studentForm);
      else if (isCompany) await companyService.updateProfile(companyForm);
      setStatus({ type: 'success', message: 'Profile saved successfully.' });
    } catch {
      setStatus({ type: 'error', message: 'Failed to save profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-white text-xl font-semibold">Profile</h2>
        <p className="text-white/40 text-sm mt-0.5">Manage your account details</p>
      </div>

      {/* Avatar card */}
      <div className="bg-[#13151c] border border-white/5 rounded-xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-semibold">{user?.name}</p>
          <p className="text-white/40 text-sm">{user?.email}</p>
          <p className="text-cyan-500 text-xs capitalize mt-0.5">{user?.role}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-white/30 text-sm">Loading...</p>
      ) : (
        <div className="bg-[#13151c] border border-white/5 rounded-xl p-6">
          <h3 className="text-white/70 text-sm font-medium mb-5">
            {isStudent ? 'Student Details' : isCompany ? 'Company Details' : 'Account Details'}
          </h3>

          {status && (
            <p className={`text-sm mb-4 p-3 rounded-lg ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {status.message}
            </p>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {isStudent && (
              <>
                <DarkField label="University" value={studentForm.university ?? ''} onChange={(v) => setStudentForm({ ...studentForm, university: v })} />
                <DarkField label="Course" value={studentForm.course ?? ''} onChange={(v) => setStudentForm({ ...studentForm, course: v })} />
                <DarkField label="Year of Study" type="number" value={String(studentForm.year_of_study ?? '')} onChange={(v) => setStudentForm({ ...studentForm, year_of_study: Number(v) })} />
                <DarkField label="CV URL" value={studentForm.cv_url ?? ''} onChange={(v) => setStudentForm({ ...studentForm, cv_url: v })} />
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5">Bio</label>
                  <textarea rows={3} value={studentForm.bio ?? ''} onChange={(e) => setStudentForm({ ...studentForm, bio: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500/50 transition-colors resize-none" />
                </div>
              </>
            )}
            {isCompany && (
              <>
                <DarkField label="Company Name" value={companyForm.company_name ?? ''} onChange={(v) => setCompanyForm({ ...companyForm, company_name: v })} required />
                <DarkField label="Industry" value={companyForm.industry ?? ''} onChange={(v) => setCompanyForm({ ...companyForm, industry: v })} />
                <DarkField label="Location" value={companyForm.location ?? ''} onChange={(v) => setCompanyForm({ ...companyForm, location: v })} />
                <DarkField label="Website" value={companyForm.website ?? ''} onChange={(v) => setCompanyForm({ ...companyForm, website: v })} />
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5">Description</label>
                  <textarea rows={3} value={companyForm.description ?? ''} onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white/80 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-cyan-500/50 transition-colors resize-none" />
                </div>
              </>
            )}
            {(isStudent || isCompany) && (
              <button type="submit" disabled={saving}
                className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-6 py-2.5 rounded-lg disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
