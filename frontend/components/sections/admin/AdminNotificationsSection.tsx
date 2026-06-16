'use client';

const mockNotifications = [
  { id: 1, message: 'New company "TechCorp Ltd" registered and awaiting approval.', type: 'info',    is_read: false, time: '2 min ago' },
  { id: 2, message: 'Student John Doe submitted an application for Software Internship.', type: 'info', is_read: false, time: '15 min ago' },
  { id: 3, message: 'Company "DataSoft" has been approved successfully.', type: 'success', is_read: true, time: '1 hour ago' },
  { id: 4, message: '5 new students registered today.', type: 'info', is_read: true, time: '3 hours ago' },
  { id: 5, message: 'Opportunity "Field Attachment 2026" deadline is tomorrow.', type: 'warning', is_read: true, time: '1 day ago' },
];

const typeColors: Record<string, string> = {
  info:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  error:   'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function AdminNotificationsSection() {
  const unread = mockNotifications.filter((n) => !n.is_read).length;

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
        {mockNotifications.map((n) => (
          <div key={n.id}
            className={`flex items-start gap-4 px-5 py-4 border-b border-white/5 last:border-0 ${!n.is_read ? 'bg-white/2' : ''}`}>
            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.is_read ? 'bg-cyan-400' : 'bg-white/10'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-sm">{n.message}</p>
              <p className="text-white/30 text-xs mt-1">{n.time}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${typeColors[n.type]}`}>
              {n.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
