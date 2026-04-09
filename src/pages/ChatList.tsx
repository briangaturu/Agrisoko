import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { MessageCircle, Clock } from "lucide-react";
import type { RootState } from "../app/store";

interface Conversation {
  id: string;
  otherUser: {
    userId: string;
    fullName: string;
    avatar?: string;
    role: "FARMER" | "BUYER";
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    isRead: boolean;
    senderId?: string;
  };
  unreadCount: number;
}

interface IncomingMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

const SOCKET_URL = "http://localhost:5000";

const ChatList = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Determine base chat path based on role
  const chatBasePath =
    user?.role === "FARMER"
      ? "/farmer-dashboard/chat"
      : "/dashboard/chat";

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${SOCKET_URL}/api/conversations/user/${user?.userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const data = await res.json();
      setConversations(data.data || []);
    } catch (err: any) {
      console.error("Error fetching conversations:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.userId) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    fetchConversations();

    // Setup socket for real-time updates
    const token = localStorage.getItem("token");
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      socket.emit("join_user_room", user.userId);
    });

    // When a new message arrives, update the relevant conversation
    socket.on("receive_message", (msg: IncomingMessage) => {
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === msg.conversationId);

        if (exists) {
          // Move conversation to top and update last message + unread count
          const updated = prev.map((c) => {
            if (c.id !== msg.conversationId) return c;
            return {
              ...c,
              lastMessage: {
                content: msg.content,
                createdAt: msg.createdAt,
                isRead: false,
                senderId: msg.senderId,
              },
              unreadCount:
                msg.senderId !== user.userId
                  ? c.unreadCount + 1
                  : c.unreadCount,
            };
          });

          // Sort so the updated conversation is at the top
          return [
            updated.find((c) => c.id === msg.conversationId)!,
            ...updated.filter((c) => c.id !== msg.conversationId),
          ];
        }

        // New conversation not yet in list — refetch
        fetchConversations();
        return prev;
      });
    });

    socket.on("connect_error", (err) => {
      console.error("ChatList socket error:", err.message);
    });

    socket.connect();
    socketRef.current = socket;

    return () => {
      socket.off("receive_message");
      socket.off("connect");
      socket.off("connect_error");
      if (socket.connected) socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.userId]);

  const formatTime = (date: string) => {
    const msgDate = new Date(date);
    const now = new Date();
    const days = Math.floor(
      (now.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (days === 0)
      return msgDate.toLocaleTimeString("en-KE", {
        hour: "2-digit",
        minute: "2-digit",
      });
    if (days === 1) return "Yesterday";
    if (days < 7)
      return msgDate.toLocaleDateString("en-KE", { weekday: "short" });
    return msgDate.toLocaleDateString("en-KE", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-sm">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          {conversations.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              {conversations.reduce((sum, c) => sum + c.unreadCount, 0) > 0
                ? `${conversations.reduce((sum, c) => sum + c.unreadCount, 0)} unread`
                : "All caught up!"}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {conversations.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center mt-8">
            <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No messages yet
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {user?.role === "FARMER"
                ? "Buyers will contact you here when they're interested in your listings."
                : "Start a conversation from the marketplace."}
            </p>
            {user?.role !== "FARMER" && (
              <button
                onClick={() => navigate("/marketplace")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
              >
                Browse Marketplace
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2 mt-4">
          {conversations.filter((conv) => !!conv.otherUser).map((conv) => {
  const isUnread =
    conv.unreadCount > 0 &&
    conv.lastMessage?.senderId !== user?.userId;

              return (
                <button
                  key={conv.id}
                  onClick={() =>
                    navigate(`${chatBasePath}/${conv.otherUser.userId}`)
                  }
                  className="w-full bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex items-center gap-4 text-left border border-transparent hover:border-green-100"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-lg font-bold">
                      {conv.otherUser.avatar ? (
                        <img
                          src={conv.otherUser.avatar}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        conv.otherUser.fullName.charAt(0).toUpperCase()
                      )}
                    </div>
                    {isUnread && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3
                        className={`truncate text-sm ${
                          isUnread
                            ? "font-bold text-gray-900"
                            : "font-medium text-gray-700"
                        }`}
                      >
                        {conv.otherUser.fullName}
                      </h3>
                      {conv.lastMessage && (
                        <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0 ml-2">
                          <Clock size={11} />
                          {formatTime(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-xs truncate ${
                          isUnread
                            ? "text-gray-800 font-medium"
                            : "text-gray-400"
                        }`}
                      >
                        {conv.lastMessage?.senderId === user?.userId && (
                          <span className="text-gray-400">You: </span>
                        )}
                        {conv.lastMessage?.content || "No messages yet"}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                        </span>
                      )}
                    </div>

                    <span className="inline-block mt-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      {conv.otherUser.role}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;