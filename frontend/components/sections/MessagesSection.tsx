'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: number;
  from: string;
  company: string;
  preview: string;
  time: string;
  unread: boolean;
  avatar: string;
}

// Placeholder messages — replace with real API when messaging is implemented
const placeholderMessages: Message[] = [];

export default function MessagesSection() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<Message | null>(null);
  const [search, setSearch] = useState('');

  const filtered = placeholderMessages.filter((m) =>
    m.from.toLowerCase().includes(search.toLowerCase()) ||
    m.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-semibold">Messages</h2>
        <p className="text-white/40 text-sm mt-0.5">Communicate with companies and recruiters</p>
      </div>

      <div className="bg-[#13151c] border border-white/5 rounded-xl overflow-hidden flex h-[520px]">
        {/* Conversation list */}
        <div className="w-72 border-r border-white/5 flex flex-col shrink-0">
          <div className="p-3 border-b border-white/5">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages..."
                className="bg-transparent text-xs text-white/70 placeholder-white/30 outline-none w-full" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-3xl mb-2">💬</p>
                <p className="text-white/30 text-xs">No messages yet.</p>
                <p className="text-white/20 text-xs mt-1">Companies will reach out here.</p>
              </div>
            ) : (
              filtered.map((msg) => (
                <button key={msg.id} onClick={() => setSelected(msg)}
                  className={`w-full flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/3 transition-colors text-left ${selected?.id === msg.id ? 'bg-cyan-500/5' : ''}`}>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white/80 text-xs font-medium truncate">{msg.from}</p>
                      <p className="text-white/30 text-[10px] shrink-0 ml-2">{msg.time}</p>
                    </div>
                    <p className="text-white/40 text-[11px] truncate mt-0.5">{msg.company}</p>
                    <p className="text-white/30 text-[11px] truncate mt-0.5">{msg.preview}</p>
                  </div>
                  {msg.unread && <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1" />}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message pane */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-white/40 text-sm font-medium">
            {selected ? `Chat with ${selected.from}` : 'Select a conversation'}
          </p>
          <p className="text-white/20 text-xs mt-1">
            {user?.name}, messaging will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}
