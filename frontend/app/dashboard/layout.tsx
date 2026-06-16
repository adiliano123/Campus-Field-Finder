'use client';
import DarkSidebar from '@/components/sidebar/DarkSidebar';
import DarkNavbar from '@/components/navbar/DarkNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      {/* Sidebar — fixed, never scrolls */}
      <div className="h-screen shrink-0 flex flex-col">
        <DarkSidebar />
      </div>

      {/* Right column */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        {/* Navbar — fixed at top */}
        <div className="shrink-0">
          <DarkNavbar />
        </div>

        {/* Only this area scrolls */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
