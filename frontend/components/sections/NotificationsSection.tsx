'use client';
import { useFetch } from '@/hooks/useFetch';
import { api } from '@/services/api';

interface Notification {
  id: number;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const typeColors: Record<string, string> = {
  info:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  error:   'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function NotificationsSection() {
  const { data: notifications, loading } = useFetch(() =>
    api.get<Notification[]>('/notifications').catch(() => [] as Notification[])
  );

  const unread = notifications?.filter((n) => !n.is_read).length ?? 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold">Notifications</h2>
          <p className="text-white/40 text-sm mt-0.5">
            {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        {unread > 0 && (
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs px-3 py-1 rounded-full">
            {unread} new
          </span>
        )}
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
              <div key={n.id}
                className={`flex items-start gap-4 px-5 py-4 border-b border-white/5 last:border-0 transition-colors ${!n.is_read ? 'bg-white/2' : ''}`}>
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!n.is_read ? 'bg-cyan-400' : 'bg-white/10'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm">{n.message}</p>
                  <p className="text-white/30 text-xs mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${typeColors[n.type] ?? typeColors.info}`}>
                  {n.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
