'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

const studentLinks = [
  { href: '/dashboard/student', label: 'Dashboard' },
  { href: '/internships', label: 'Browse Opportunities' },
  { href: '/applications', label: 'My Applications' },
  { href: '/profile', label: 'Profile' },
  { href: '/settings', label: 'Settings' },
];

const companyLinks = [
  { href: '/dashboard/company', label: 'Dashboard' },
  { href: '/dashboard/company/opportunities', label: 'My Opportunities' },
  { href: '/dashboard/company/applications', label: 'Applications' },
  { href: '/profile', label: 'Profile' },
  { href: '/settings', label: 'Settings' },
];

const adminLinks = [
  { href: '/dashboard/admin', label: 'Dashboard' },
  { href: '/dashboard/admin/companies', label: 'Companies' },
  { href: '/dashboard/admin/students', label: 'Students' },
  { href: '/dashboard/admin/opportunities', label: 'Opportunities' },
  { href: '/settings', label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isStudent, isCompany, isAdmin } = useRole();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  const links = isStudent ? studentLinks : isCompany ? companyLinks : adminLinks;

  const handleLogout = () => {
    clearAuth();
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-700">Field Finder</h1>
        <p className="text-xs text-gray-500 mt-1 capitalize">{isStudent ? 'Student' : isCompany ? 'Company' : 'Admin'} Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link key={link.href} href={link.href}
            className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === link.href ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
            }`}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
          Logout
        </button>
      </div>
    </aside>
  );
}
