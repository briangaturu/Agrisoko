import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bell, Trash2 } from "lucide-react";
import type { RootState } from "../app/store";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} from "../features/api/notificationsApi";

const typeColors: Record<string, string> = {
  MESSAGE:  "bg-blue-100 text-blue-700",
  ORDER:    "bg-orange-100 text-orange-700",
  PAYMENT:  "bg-green-100 text-green-700",
  DELIVERY: "bg-purple-100 text-purple-700",
};

const typeIcons: Record<string, string> = {
  MESSAGE:  "💬",
  ORDER:    "🛒",
  PAYMENT:  "💳",
  DELIVERY: "📦",
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  const { data, isLoading } = useGetNotificationsQuery(userId as string, {
    skip: !userId,
  });

  const notifications = Array.isArray(data?.data) ? data.data : [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleClick = async (notification: any) => {
    if (!notification.isRead) await markRead(notification.id);
    if (notification.link) navigate(notification.link);
  };

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading notifications...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead(userId as string)}
            className="text-sm text-green-600 font-semibold hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border p-16 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <Bell size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-700">No Notifications</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            You're all caught up! Notifications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification: any) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm border p-4 flex items-start gap-4 hover:shadow-md transition ${
                !notification.isRead ? "border-l-4 border-l-green-500" : ""
              }`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                typeColors[notification.type] ?? "bg-gray-100"
              }`}>
                {typeIcons[notification.type] ?? "🔔"}
              </div>

              {/* Content */}
              <button
                className="flex-1 text-left"
                onClick={() => handleClick(notification)}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-gray-800 text-sm">
                    {notification.title}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    typeColors[notification.type] ?? "bg-gray-100 text-gray-600"
                  }`}>
                    {notification.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleDateString("en-KE", {
                    year: "numeric", month: "short", day: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </button>

              {/* Actions */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                {!notification.isRead && (
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-gray-300 hover:text-red-500 transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;