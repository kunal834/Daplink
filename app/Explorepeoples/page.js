"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { io } from "socket.io-client";
import {
  Send,
  User,
  Briefcase,
  Sparkles,
  Search,
  Loader2,
  X,
  Minimize2,
  MessageCircle
} from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { useTheme } from '@/context/ThemeContext';


const ChatWidget = ({
  currentUserId,
  currentUserHandle,
  recipient,
  onClose,
  theme,
}) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef(null);



  const widgetColors = {
    bg: theme === "dark" ? "bg-[#1a1a1a]" : "bg-white",
    header:
      theme === "dark"
        ? "bg-slate-800 border-slate-700"
        : "bg-white border-slate-200",
    text: theme === "dark" ? "text-slate-200" : "text-slate-800",
    inputBg:
      theme === "dark"
        ? "bg-[#0a0a0a] text-slate-200"
        : "bg-slate-100 text-slate-800",
    sentBubble: "bg-purple-600 text-white",
    receivedBubble:
      theme === "dark"
        ? "bg-slate-700 text-slate-200"
        : "bg-slate-200 text-slate-800",
    border: theme === "dark" ? "border-slate-700" : "border-slate-200",
  };
  
useEffect(() => {
  console.log("🔌 Connecting socket...");

  const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
    withCredentials: true,
  });

  newSocket.on("connect", () => {
    console.log("✅ Connected:", newSocket.id);
  });

  newSocket.on("connect_error", (err) => {
    console.error("❌ Socket error:", err.message);
  });

  setSocket(newSocket);
  socketRef.current = newSocket;

  return () => {
    console.log("🔌 Disconnecting socket");
    newSocket.disconnect();
  };
}, []);
// 🔥 2️⃣ MESSAGE LISTENER (USES LATEST STATE)
useEffect(() => {
  if (!socket) return;
  if (!currentUserId) return;
  if (!recipient?._id) return;


  console.log("👂 Attaching message listener");

  const handleReceiveMessage = (data) => {
    console.log("📨 Message received:", data);

    const sender = String(data.senderId);
    const receiver = String(data.receiverId);
    const me = String(currentUserId);
    const other = String(recipient._id);
     console.log("COMPARE:", {
    sender,
    receiver,
    me,
    other
  });
    if (
      (sender === me && receiver === other) ||
      (sender === other && receiver === me)
    ) {
      console.log("✅ Message belongs to this chat");

      const newMsg = {
        _id: data._id,
        message: data.text,
        author: sender === me
          ? currentUserHandle
          : recipient.handle,
        status: data.status || "sent",
        time: new Date(data.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newMsg]);
    } else {
      console.log("⏭️ Not for this chat");
    }
  };

  socket.on("receive_message", handleReceiveMessage);

  return () => {
    console.log("🧹 Removing message listener");
    socket.off("receive_message", handleReceiveMessage);
  };
}, [socket, currentUserId, recipient?._id, currentUserHandle]);
  useEffect(() => {
if (!recipient?._id || !currentUserId) return;
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${recipient._id}`,
        { withCredentials: true }
      );

      const formatted = res.data.messages.map((msg) => ({
        _id: msg._id,
        message: msg.text,
        author:
          String(msg.senderId) === String(currentUserId)
            ? currentUserHandle
            : recipient.handle,
        status: msg.status,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setMessages(formatted);
    } catch (err) {
      console.error("Error loading messages:", err.message);
      setMessages([]);
    }
  };

  fetchMessages();
},[recipient.userId, currentUserId, currentUserHandle]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isMinimized]);

  useEffect(() => {
    if (!socket) return;

    messages.forEach((msg) => {
      const isMyMessage = msg.author === currentUserHandle;

      if (!isMyMessage && msg.status !== "read" && msg._id) {
        console.log("📌 [MARK_READ] Marking as read:", msg._id);
        socket.emit("message_read", { messageId: msg._id });
      }
    });
  }, [messages, socket, currentUserHandle]);


  const handleSend = (e) => {
  e.preventDefault();

  if (!socket || !socket.connected) {
    console.error("Socket not connected");
    return;
  }

  if (!newMessage.trim()) return;

  const tempId = Date.now(); // temporary id

  const optimisticMessage = {
    _id: tempId,
    message: newMessage.trim(),
    author: currentUserHandle,
    status: "sending",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  // ✅ 1. Add message immediately
  setMessages((prev) => [...prev, optimisticMessage]);

  // ✅ 2. Emit to backend
  socket.emit("send_message", {
    receiverId: recipient._id,
  text: newMessage.trim(),
});
  setNewMessage("");
};
  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        className={`fixed bottom-0 right-4 w-72 p-3 rounded-t-xl cursor-pointer shadow-2xl border-x border-t flex items-center justify-between ${widgetColors.bg} ${widgetColors.border} ${widgetColors.text} z-50`}
      >
        <div className="flex items-center gap-2 font-semibold">
          <div className="relative w-2 h-2 rounded-full bg-green-500"></div>
          @{recipient.handle}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-0 right-4 w-80 md:w-96 h-125 flex flex-col rounded-t-2xl shadow-2xl border-x border-t z-50 ${widgetColors.bg} ${widgetColors.border}`}
    >
      {/* ================= HEADER ================= */}
      <div
        className={`p-3 border-b flex items-center justify-between rounded-t-2xl ${widgetColors.header} ${widgetColors.text}`}
      >
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold">@{recipient.handle}</h4>
        </div>

        <div className="flex items-center gap-2">
          {/* Minimize */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-slate-500/20 rounded-full transition"
          >
            <Minimize2 className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded-full transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= MESSAGES ================= */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className={`text-center py-8 ${widgetColors.text} opacity-60`}>
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.author === currentUserHandle;

            return (
              <div
                key={msg._id || idx}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isMe
                    ? `${widgetColors.sentBubble} rounded-tr-none`
                    : `${widgetColors.receivedBubble} rounded-tl-none`
                    }`}
                >
                  <p>{msg.message}</p>
                  <p className="text-[10px] mt-1 text-right opacity-60">
                    {msg.time}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* ================= INPUT ================= */}
      <form
        onSubmit={handleSend}
        className={`p-3 border-t ${widgetColors.border} ${widgetColors.bg}`}
      >
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend(e);
              }
            }}
            placeholder="Type a message..."
            className={`w-full py-2.5 pl-4 pr-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${widgetColors.inputBg}`}
          />

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-1 p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );

};

// --- MAIN COMPONENT ---
const UserProfile = ({ params }) => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myself, setMyself] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  const { theme } = useTheme();

  const colors = {
    bg: theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-slate-50',
    text: theme === 'dark' ? 'text-slate-100' : 'text-slate-900',
    subtext: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
    headingAccent: theme === 'dark' ? 'from-purple-400 to-blue-400' : 'from-purple-600 to-blue-500',
    card: theme === 'dark' ? 'bg-[#161616] border-slate-800' : 'bg-white border-slate-200',
    cardHover: theme === 'dark' ? 'hover:border-purple-500/40' : 'hover:border-purple-200',
    cardInnerAvatar: theme === 'dark' ? 'from-slate-800 to-slate-900 text-slate-300' : 'from-slate-100 to-slate-200 text-slate-400',
    pill: theme === 'dark' ? 'bg-purple-500/10 text-purple-300' : 'bg-purple-100 text-purple-700',
    tag: theme === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-100',
    proBadge: theme === 'dark' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-700 border-green-100',
    btnPrimary: theme === 'dark' ? 'bg-slate-100 text-slate-900 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800',
    btnSecondary: theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200',
    btnMessage: theme === 'dark' ? 'bg-purple-700 hover:bg-purple-600' : 'bg-slate-900 hover:bg-purple-600',
    emptyState: theme === 'dark' ? 'bg-[#161616] border-slate-800' : 'bg-white border-slate-300',
    emptyIcon: theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-50 text-slate-300',
  };

  const handleFetchAll = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/Peoples');
      setPeople(response.data.result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching people:", error);
      setLoading(false);
    }
  };

  const handleOpenChat = (user) => {
    setActiveChat(user);
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setMyself(res.data);
      } catch (err) {
        console.error("Not logged in");
      }
    };
    fetchMe();
  }, []);

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : "??";

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${colors.bg}`}>
      <Navbar />

      <main className="grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${colors.pill}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Hello @{params.handle}
            </div>

            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight ${colors.text}`}>
              Discover <span className={`text-transparent bg-clip-text bg-linear-to-r ${colors.headingAccent}`}>Creators</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-lg ${colors.subtext}`}>
              {`Connect with developers, designers, and innovators within the Daplink ecosystem.`}
            </p>

            <div className="mt-6">
              <button
                onClick={handleFetchAll}
                disabled={loading}
                className={`
                  relative overflow-hidden group px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl
                  ${colors.btnPrimary}
                  ${loading ? "cursor-not-allowed opacity-80" : ""}
                `}
              >
                <span className="flex items-center gap-2">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  {loading ? "Discovering..." : "Explore Community"}
                </span>
              </button>
            </div>
          </div>

          {/* The Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {people.map((user, index) => (
              <div
                key={user._id || index}
                className={`group relative rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${colors.card} ${colors.cardHover}`}
              >
                <div className="h-24 bg-linear-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>

                <div className="px-6 pb-6 relative">
                  <div className="-mt-12 mb-4">
                    <div className={`h-20 w-20 rounded-2xl p-1 shadow-md inline-block transform rotate-3 group-hover:rotate-0 transition-transform duration-300 ${theme === 'dark' ? 'bg-[#161616]' : 'bg-white'}`}>
                      <div className={`h-full w-full rounded-xl bg-linear-to-br flex items-center justify-center font-bold text-xl ${colors.cardInnerAvatar}`}>
                        {getInitials(user.handle)}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`text-xl font-bold transition-colors group-hover:text-purple-500 ${colors.text}`}>
                        @{user.handle || "Incognito"}
                      </h3>
                      <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mt-1 ${colors.subtext}`}>
                        <Briefcase className="w-3.5 h-3.5" />
                        {user.profession || "Creator"}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${colors.proBadge}`}>
                      Pro
                    </span>
                  </div>

                  <p className={`text-sm leading-relaxed mb-6 line-clamp-2 min-h-10 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                    {user.bio || "Building something amazing on Daplink. Ask me about my projects!"}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${colors.tag}`}>
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      Daplink User
                    </span>
                  </div>

                  <div className={`grid grid-cols-2 gap-3 pt-4 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                    <Link
                      href={`/u/${user.handle}`}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${colors.btnSecondary}`}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>

                    {/* UPDATED: Message Button */}
                    <button
                      onClick={() => handleOpenChat(user)}
                      disabled={user.handle === params.handle}
                      className={`
                        flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all
                        ${user.handle === params.handle
                          ? (theme === 'dark' ? "bg-slate-800 text-slate-600 cursor-not-allowed" : "bg-slate-300 cursor-not-allowed")
                          : `${colors.btnMessage} shadow-md hover:shadow-lg`}
                      `}
                    >
                      <Send className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {people.length === 0 && !loading && (
            <div className={`text-center py-20 rounded-3xl border border-dashed ${colors.emptyState}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${colors.emptyIcon}`}>
                <Search className="w-8 h-8" />
              </div>
              <h3 className={`text-lg font-semibold ${colors.text}`}>No creators found yet</h3>
              <p className={`max-w-sm mx-auto mt-2 text-sm ${colors.subtext}`}>
                {`Click the "Explore Community" button above to fetch the latest users from the database.`}
              </p>
            </div>
          )}

        </div>
      </main>
      <Footer />

      {/* --- RENDER CHAT WIDGET IF ACTIVE --- */}
      {activeChat && myself && (
        <ChatWidget
          currentUserId={myself._id}
          currentUserHandle={myself.handle}
          recipient={activeChat}
          onClose={() => setActiveChat(null)}
          theme={theme}
        />
      )}
    </div>
  );
};

export default UserProfile;