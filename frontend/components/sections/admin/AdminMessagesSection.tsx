'use client';
import { useState } from 'react';

export default function AdminMessagesSection() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-semibold">Messages</h2>
        <p className="text-white/40 text-sm mt-0.5">Platform communications and support</p>
      </div>

      <div className="bg-[#13151c] border border-white/5 rounded-xl overflow-hidden flex h-[520px]">
        {/* Sidebar list */}
        <div className="w-72 border-r border-white/5 flex flex-col shrink-0">
          <div className="p-3 border-b border-white/5">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="bg-transparent text-xs text-white/70 placeholder-white/30 outline-none w-full" />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-white/30 text-xs text-center px-4">No conversations yet.</p>
          </div>
        </div>

        {/* Main pane */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <p className="text-4xl">💬</p>
          <p className="text-white/40 text-sm font-medium">Admin Messaging</p>
          <p className="text-white/20 text-xs text-center max-w-xs">
            Send announcements and respond to support requests from students and companies.
          </p>
        </div>
      </div>
    </div>
  );
}
