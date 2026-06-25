'use client';
import { useRouter } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import { useAuthStore } from '@/store/authStore';
import { useDashboardStore, DashboardSection } from '@/store/dashboardStore';

const studentLinks: { section: DashboardSection; label: string; icon: string }[] = [
  { section: 'dashboard',     label: 'Dashboard',            icon: '⊞' },
  { section: 'browse',        label: 'Browse Opportunities', icon: '🔍' },
  { section: 'saved',         label: 'Saved',                icon: '📌' },
  { section: 'applications',  label: 'My Applications',      icon: '📋' },
  { section: 'cv',            label: 'CV & Documents',       icon: '📄' },
  { section: 'messages',      label: 'Messages',             icon: '💬' },
  { section: 'notifications', label: 'Notifications',        icon: '🔔' },
  { section: 'profile',       label: 'Profile',              icon: '👤' },
  { section: 'settings',      label: 'Settings',             icon: '⚙' },
];

const companyLinks: { section: DashboardSection; label: string; icon: string }[] = [
  { section: 'dashboard',     label: 'Dashboard',       icon: '⊞' },
  { section: 'opportunities', label: 'Opportunities',   icon: '📌' },
  { section: 'applications',  label: 'Applications',    icon: '📋' },
  { section: 'students',      label: 'Students',        icon: '🎓' },
  { section: 'reports',       label: 'Reports',         icon: '📊' },
  { section: 'messages',      label: 'Messages',        icon: '💬' },
  { section: 'notifications', label: 'Notifications',   icon: '🔔' },
  { section: 'profile',       label: 'Company Profile', icon: '🏢' },
  { section: 'settings',      label: 'Settings',        icon: '⚙' },
];

const adminLinks: { section: DashboardSection; label: string; icon: string }[] = [
  { section: 'dashboard',     label: 'Dashboard',          icon: '⊞' },
  { section: 'companies',     label: 'Companies',          icon: '🏢' },
  { section: 'students',      label: 'Students',           icon: '🎓' },
  { section: 'opportunities', label: 'Opportunities',      icon: '📌' },
  { section: 'applications',  label: 'Applications',       icon: '📋' },
  { section: 'reports',       label: 'Reports & Analysis', icon: '📊' },
  { section: 'messages',      label: 'Messages',           icon: '💬' },
  { section: 'notifications', label: 'Notifications',      icon: '🔔' },
  { section: 'settings',      label: 'Settings',           icon: '⚙' },
];

interface DarkSidebarProps {
  onClose?: () => void;
}

export default function DarkSidebar({ onClose }: DarkSidebarProps) {
  const { isStudent, isCompany } = useRole();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { active, setActive } = useDashboardStore();
  const router = useRouter();

  const links = isStudent ? studentLinks : isCompany ? companyLinks : adminLinks;
  const portalLabel = isStudent ? 'Student Portal' : isCompany ? 'Company Portal' : 'Admin Portal';

  const handleNav = (section: DashboardSection) => {
    setActive(section);
    onClose?.(); // close on mobile after selecting
  };

  const handleLogout = () => {
    clearAuth();
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.refresh();
    router.push('/login');
  };

  return (
    <aside className="w-56 bg-(--bg-surface) border-r border-(--border) flex flex-col h-full">

      {/* Logo */}
      <div className="px-4 py-4 border-b border-(--border) shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center text-black font-bold text-[10px] shrink-0">
            FF
          </div>
          <div>
            <p className="text-(--text-primary) font-bold text-xs leading-none">FIELD FINDER</p>
            <p className="text-cyan-500 text-[9px] tracking-widest">›››</p>
          </div>
        </div>
        <p className="text-(--text-subtle) text-[9px] mt-1.5 uppercase tracking-wider">{portalLabel}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 [&::-webkit-scrollbar]:w-0">
        {links.map((link) => (
          <button
            key={link.section}
            onClick={() => handleNav(link.section)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all text-left ${
              active === link.section
                ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20'
                : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-muted) border border-transparent'
            }`}
          >
            <span className="text-sm w-4 text-center shrink-0">{link.icon}</span>
            <span className="truncate">{link.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-(--border) shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-(--text-subtle) hover:text-red-500 hover:bg-red-500/10 w-full transition-all"
        >
          <span className="text-sm w-4 text-center shrink-0">⏻</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
