'use client';
import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { notificationService } from '@/services/notification.service';
import type { Notification } from '@/services/notification.service';

const typeColors: Record<string, string> = {
  info:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  error:   'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function NotificationsSection() {
  const { data: notifications, loading, refetch } = useFetch(() =>
    notificationService.getAll().catch(() => [] as Notification[])
  );
  const [marking, setMarking] = useState(false);

  const unread = notifications?.filter((n) => !n.is_read).length ?? 0;

  const handleMarkAllRead = async () => {
    setMarking(true);
    try {
      await notificationService.markAllRead();
      refetch();
    } finally {
      setMarking(false);
    }
  };

  const handleMarkRead = async (id: number) => {
    await notificationService.markRead(id);
    refetch();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold">Notifications</h2>
          <p className="text-white/40 text-sm mt-0.5">
            {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <>
              <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs px-3 py-1 rounded-full">
                {unread} new
              </span>
              <button
                disabled={marking}
                onClick={handleMarkAllRead}
                className="text-xs bg-white/5 border border-white/10 text-white/60 px-3 py-1 rounded-lg hover:bg-white/10 disabled:opacity-50 transition-colors">
                {marking ? 'Marking...' : 'Mark all read'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-[#13151c] border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-white/30 text-sm p-5">Loading...</p>
        ) : !notifications?.length ? (
          <div className="p-8 text-center">
            <p className="text-4xl mb-3">🔔</p>
            <p className="text-white/40 text-sm">No notifications yet.</p>
            <p className="text-white/20 text-xs mt-1">You&apos;ll be notified about application updates here.</p>
          </div>
        ) : (
          <div>
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => !n.is_read && handleMarkRead(n.id)}
                className={`w-full flex items-start gap-4 px-5 py-4 border-b border-white/5 last:border-0 transition-colors text-left ${!n.is_read ? 'bg-white/2 hover:bg-white/4' : ''}`}>
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!n.is_read ? 'bg-cyan-400' : 'bg-white/10'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm">{n.message}</p>
                  <p className="text-white/30 text-xs mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${typeColors[n.type] ?? typeColors.info}`}>
                  {n.type}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
