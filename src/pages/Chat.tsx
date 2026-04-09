import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { ArrowLeft, Send, Paperclip } from "lucide-react";
import type { RootState } from "../app/store";

const SOCKET_URL = "http://localhost:5000";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  sender?: { fullName: string; avatar?: string };
}

interface OtherUser {
  userId: string;
  fullName: string;
  avatar?: string;
  role: string;
}

const Chat = () => {
  const { userId: otherUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
 const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!user?.userId || !otherUserId) {
      setError("Missing user information");
      setLoading(false);
      return;
    }

    if (socketRef.current?.connected) return;

    let isSubscribed = true;

    const init = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token");

        // 1. Start/get conversation
        const convRes = await fetch(`${SOCKET_URL}/api/conversations/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userAId: user.userId, userBId: otherUserId }),
        });

        if (!convRes.ok) {
          const errText = await convRes.text();
          throw new Error(`Failed to start conversation: ${convRes.status} - ${errText}`);
        }

        const convData = await convRes.json();
        const convId = convData.conversationId;
        if (!isSubscribed) return;
        setConversationId(convId);

        // 2. Fetch messages (don't throw if empty/fails)
        const msgsRes = await fetch(
          `${SOCKET_URL}/api/conversations/${convId}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const msgsData = msgsRes.ok ? await msgsRes.json() : { data: [] };
        if (!isSubscribed) return;
        setMessages(msgsData.data || []);

        // 3. Fetch other user details directly
        const userRes = await fetch(`${SOCKET_URL}/api/users/${otherUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          const u = userData.data ?? userData;
          setOtherUser({
            userId: otherUserId,
            fullName: u.fullName || "Farmer",
            avatar: u.avatar,
            role: u.role || "FARMER",
          });
        } else {
          setOtherUser({
            userId: otherUserId,
            fullName: "Farmer",
            avatar: undefined,
            role: "FARMER",
          });
        }

        // 4. Setup socket
        const socket = io(SOCKET_URL, {
          transports: ["websocket"],
          autoConnect: false,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
        });

        socket.on("connect", () => {
          socket.emit("join_room", convId);
          socket.emit("join_user_room", user.userId);
        });

        socket.on("receive_message", (msg: Message) => {
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
          );
        });

        socket.on("user_typing", ({ userId }: { userId: string }) => {
          if (userId !== otherUserId) return;
          setIsTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
        });

        socket.on("connect_error", (err) => {
          console.error("Socket error:", err.message);
        });

        socket.connect();
        socketRef.current = socket;

        if (isSubscribed) {
          setLoading(false);
          setTimeout(() => scrollToBottom("auto"), 100);
        }
      } catch (err: any) {
        console.error("Chat init error:", err);
        if (isSubscribed) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      isSubscribed = false;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.off("receive_message");
        socketRef.current.off("user_typing");
        socketRef.current.off("connect");
        socketRef.current.off("connect_error");
        if (socketRef.current.connected) socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?.userId, otherUserId]);

  const handleSend = () => {
    if (!newMessage.trim() || !conversationId || !socketRef.current) return;

    socketRef.current.emit("send_message", {
      conversationId,
      senderId: user?.userId,
      content: newMessage.trim(),
    });

    socketRef.current.emit("stop_typing", {
      conversationId,
      userId: user?.userId,
    });

    setNewMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (socketRef.current && conversationId) {
      socketRef.current.emit("typing", { conversationId, userId: user?.userId });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-KE", {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 text-sm">Loading conversation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-red-600 mb-4 text-center text-sm">{error}</p>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition"
          >
            Go Back
          </button>
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
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>

        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
            {otherUser?.avatar ? (
              <img
                src={otherUser.avatar}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              otherUser?.fullName.charAt(0).toUpperCase()
            )}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 text-sm">
            {otherUser?.fullName}
          </h2>
          <p className="text-xs text-gray-500">
            {isTyping ? (
              <span className="text-green-600">typing...</span>
            ) : (
              otherUser?.role
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
              <Send size={22} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs">Say hello to {otherUser?.fullName}!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === user?.userId;
            const showAvatar =
              !isMe &&
              (index === 0 || messages[index - 1].senderId !== msg.senderId);

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}
              >
                {!isMe && showAvatar ? (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {otherUser?.fullName.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  !isMe && <div className="w-7 flex-shrink-0" />
                )}

                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    isMe
                      ? "bg-green-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? "text-green-200" : "text-gray-400"}`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
              {otherUser?.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3 flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400">
          <Paperclip size={20} />
        </button>

        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${otherUser?.fullName ?? ""}...`}
          className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:outline-none focus:bg-white transition"
        />

        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
        >
          <Send size={17} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
};

export default Chat;