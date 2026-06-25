'use client';
import { useState } from 'react';
import DarkSidebar from '@/components/sidebar/DarkSidebar';
import DarkNavbar from '@/components/navbar/DarkNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-(--bg-base)">

      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── always visible on desktop, slide-in on mobile ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 h-screen shrink-0 flex flex-col
          transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <DarkSidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* ── Right column ── */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        {/* Navbar */}
        <div className="shrink-0">
          <DarkNavbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
