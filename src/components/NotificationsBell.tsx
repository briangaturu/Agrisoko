import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import type { RootState } from "../app/store";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "../features/api/notificationsApi";

const SOCKET_URL = "http://localhost:5000";

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

const NotificationBell = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  const [isOpen, setIsOpen] = useState(false);

  // Track connection state to prevent duplicate connections
  const connectingRef = useRef(false);
  const socketRef = useRef<Socket | null>(null);

  const { data, refetch } = useGetNotificationsQuery(userId as string, {
    skip: !userId,
  });

  const notifications = Array.isArray(data?.data) ? data.data : [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  useEffect(() => {
    if (!userId) return;

    // Prevent duplicate connection attempts (Strict Mode safety)
    if (connectingRef.current || socketRef.current?.connected) {
      return;
    }

    connectingRef.current = true;

    // Create socket WITHOUT auto-connect to set up listeners first
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false, // Critical: prevents immediate connection
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Set up all listeners BEFORE connecting
    const handleConnect = () => {
      console.log("🔔 NotificationBell socket connected:", socket.id);
      socket.emit("join_user_room", userId);
    };

    const handleNotification = () => {
      refetch();
    };

    const handleDisconnect = (reason: string) => {
      console.warn("⚠️ NotificationBell socket disconnected:", reason);
    };

    const handleError = (err: Error) => {
      console.error("❌ NotificationBell socket error:", err.message);
    };

    socket.on("connect", handleConnect);
    socket.on("notification", handleNotification);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    // Now connect manually after listeners are ready
    socket.connect();
    socketRef.current = socket;

    // Cleanup
    return () => {
      connectingRef.current = false;
      
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("notification", handleNotification);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleError);
        
        // Only disconnect if actually connected or connecting
        if (socket.connected || socket.io?.engine?.transport) {
          socket.disconnect();
        }
        
        socketRef.current = null;
      }
    };
  }, [userId, refetch]);

  const handleNotificationClick = async (notification: any) => {
    await markRead(notification.id);
    setIsOpen(false);
    if (notification.link) navigate(notification.link);
  };

  const handleMarkAllRead = async () => {
    await markAllRead(userId as string);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell size={22} className="text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <button
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-bold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-green-600 hover:underline font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification: any) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 transition flex items-start gap-3 ${
                      !notification.isRead ? "bg-green-50" : ""
                    }`}
                  >
                    <span className="text-xl mt-0.5">
                      {typeIcons[notification.type] ?? "🔔"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-gray-800 text-sm truncate">
                          {notification.title}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                          typeColors[notification.type] ?? "bg-gray-100 text-gray-600"
                        }`}>
                          {notification.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString("en-KE", {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1 shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="px-4 py-2 border-t text-center">
              <button
                onClick={() => { setIsOpen(false); navigate("/notifications"); }}
                className="text-xs text-green-600 hover:underline font-medium"
              >
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;