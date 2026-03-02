"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { io } from "socket.io-client";
import {
  Send, User, Briefcase, Search, Loader2, X, Minimize2, CheckCircle2, Maximize2, Bell
} from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { useTheme } from '@/context/ThemeContext';

// --- CHAT WIDGET COMPONENT ---
const ChatWidget = ({
  currentUserId,
  currentUserHandle,
  recipient,
  onClose,
  theme,
  socket 
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef(null);

  const widgetColors = {
    bg: theme === "dark" ? "bg-[#09090b]" : "bg-white",
    header: theme === "dark" ? "bg-[#09090b]/90 border-zinc-800" : "bg-white/90 border-zinc-200",
    text: theme === "dark" ? "text-zinc-100" : "text-zinc-900",
    subtext: theme === "dark" ? "text-zinc-400" : "text-zinc-500",
    inputContainer: theme === "dark" ? "bg-[#18181b] border-zinc-800" : "bg-zinc-100 border-transparent",
    inputText: theme === "dark" ? "text-zinc-100" : "text-zinc-900",
    sentBubble: theme === "dark" ? "bg-zinc-200 text-zinc-900" : "bg-zinc-900 text-white",
    receivedBubble: theme === "dark" ? "bg-[#18181b] text-zinc-200 border border-zinc-800/50" : "bg-zinc-100 text-zinc-800 border border-zinc-200/50",
    border: theme === "dark" ? "border-zinc-800" : "border-zinc-200",
  };

  useEffect(() => {
    if (!socket || !currentUserId || !recipient?._id) return;

    const handleReceiveMessage = (data) => {
      const sender = String(data.senderId);
      const receiver = String(data.receiverId);
      const me = String(currentUserId);
      const other = String(recipient._id);

      if (
        (sender === me && receiver === other) ||
        (sender === other && receiver === me)
      ) {
        const newMsg = {
          _id: data._id,
          message: data.text,
          author: sender === me ? currentUserHandle : recipient.handle,
          status: data.status || "sent",
          time: new Date(data.createdAt || Date.now()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(newMsg._id))) return prev;
          const filtered = prev.filter(
            (m) => !(String(m._id).startsWith("temp-") && m.message === newMsg.message)
          );
          return [...filtered, newMsg];
        });
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [socket, currentUserId, recipient?._id, currentUserHandle]);

  useEffect(() => {
    if (!recipient?._id || !currentUserId) return;
    
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${recipient._id}?t=${Date.now()}`,
          { withCredentials: true }
        );

        const messagesData = Array.isArray(res.data) ? res.data : (res.data?.messages || []);

        const formatted = messagesData.map((msg) => ({
          _id: msg._id,
          message: msg.text,
          author:
            String(msg.senderId) === String(currentUserId)
              ? currentUserHandle
              : recipient.handle,
          status: msg.status || "sent",
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setMessages(formatted);
      } catch (err) {
        console.error("Failed to fetch message history:", err);
        setMessages([]);
      }
    };
    fetchMessages();
  }, [recipient?._id, currentUserId, currentUserHandle]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isMinimized]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!socket || !socket.connected || !newMessage.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      message: newMessage.trim(),
      author: currentUserHandle,
      status: "sending",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    
    setMessages((prev) => [...prev, optimisticMessage]);

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
        className={`fixed bottom-4 right-4 w-auto pl-4 pr-2 py-2 rounded-full cursor-pointer shadow-2xl shadow-black/20 border flex items-center justify-between transition-all hover:scale-105 z-50 ${widgetColors.bg} ${widgetColors.border} ${widgetColors.text}`}
      >
        <div className="flex items-center gap-3 font-medium text-sm">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative z-10"></div>
          </div>
          @{recipient.handle}
          <div className={`p-1.5 ml-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800 hover:text-zinc-200' : 'hover:bg-zinc-100 hover:text-zinc-800'}`}>
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-0 right-4 sm:right-8 w-full sm:w-95 h-137.5 max-h-[80vh] flex flex-col rounded-t-2xl shadow-2xl border-x border-t z-50 overflow-hidden transition-colors ${widgetColors.bg} ${widgetColors.border}`}>
      <div className={`px-4 py-3.5 flex items-center justify-between border-b backdrop-blur-xl z-10 ${widgetColors.header} ${widgetColors.text}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
             <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {recipient.handle ? recipient.handle.substring(0, 2).toUpperCase() : "??"}
             </div>
             <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 ${theme === 'dark' ? 'border-[#09090b]' : 'border-white'} bg-emerald-500 rounded-full`}></div>
          </div>
          <div className="flex flex-col">
            <h4 className="text-[15px] font-semibold leading-none">@{recipient.handle}</h4>
            <span className={`text-[11px] mt-1 ${widgetColors.subtext}`}>Online</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-zinc-400">
          <button onClick={() => setIsMinimized(true)} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800 hover:text-zinc-200' : 'hover:bg-zinc-100 hover:text-zinc-800'}`}>
            <Minimize2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3">
               <User className={`w-6 h-6 ${widgetColors.text}`} />
            </div>
            <p className={`text-sm font-medium ${widgetColors.text}`}>Start the conversation</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.author === currentUserHandle;
            return (
              <div key={msg._id || idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className={`max-w-[75%] px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${msg.status === "sending" ? "opacity-70" : "opacity-100"} ${isMe ? `${widgetColors.sentBubble} rounded-2xl rounded-tr-sm` : `${widgetColors.receivedBubble} rounded-2xl rounded-tl-sm`}`}>
                  <p className="whitespace-pre-wrap wrap-break-word">{msg.message}</p>
                </div>
                <span className={`text-[10px] mt-1.5 px-1 font-medium ${widgetColors.subtext}`}>
                  {msg.time} {msg.status === "sending" && "• Sending"}
                </span>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      <div className={`p-4 pt-2 ${widgetColors.bg}`}>
        <form onSubmit={handleSend} className={`relative flex items-center p-1 rounded-full border transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500/50 ${widgetColors.inputContainer}`}>
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className={`flex-1 py-2.5 pl-4 pr-2 bg-transparent text-[14px] focus:outline-none placeholder:text-zinc-500 ${widgetColors.inputText}`} />
          <button type="submit" disabled={!newMessage.trim()} className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center disabled:opacity-40 disabled:scale-95 ${theme === 'dark' ? 'bg-zinc-200 text-zinc-900 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-black'} ${newMessage.trim() ? 'scale-100 shadow-md' : 'scale-95'}`}>
            <Send className="w-4 h-4 translate-x-px" />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN USER PROFILE COMPONENT ---
const UserProfile = ({ params }) => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myself, setMyself] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  
  const [globalSocket, setGlobalSocket] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  const { theme } = useTheme();

  const colors = {
    bg: theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]',
    text: theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900',
    subtext: theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500',
    card: theme === 'dark' ? 'bg-[#141414] border-zinc-800' : 'bg-white border-zinc-200',
    cardHover: theme === 'dark' ? 'hover:border-zinc-600' : 'hover:border-zinc-400',
    avatarBg: theme === 'dark' ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600',
    tag: theme === 'dark' ? 'bg-zinc-900 text-zinc-300 border-zinc-800' : 'bg-zinc-50 text-zinc-600 border-zinc-200',
    btnPrimary: theme === 'dark' ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-zinc-800',
    btnSecondary: theme === 'dark' ? 'bg-transparent text-zinc-300 border-zinc-700 hover:bg-zinc-800' : 'bg-transparent text-zinc-700 border-zinc-200 hover:bg-zinc-50',
    emptyState: theme === 'dark' ? 'bg-[#141414] border-zinc-800' : 'bg-white border-zinc-200',
  };

  useEffect(() => {
    const fetchMeAndUnread = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setMyself(res.data.user);
        const unreadRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/unread/counts`,
          { withCredentials: true }
        );
        setUnreadCounts(unreadRes.data || {});

      } catch (err) {
        console.error("Failed to fetch initial data");
      }
    };
    
    fetchMeAndUnread();
    
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!myself) return;

    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      withCredentials: true,
    });
    setGlobalSocket(newSocket);

    newSocket.on("receive_message", (data) => {
      const senderId = String(data.senderId);
      
      setUnreadCounts((prev) => {
        const currentActiveChatId = activeChat?._id ? String(activeChat._id) : null;
        if (currentActiveChatId === senderId) return prev;

        const newCount = (prev[senderId] || 0) + 1;

        if ("Notification" in window && Notification.permission === "granted" && document.hidden) {
           new Notification("New Message", {
             body: data.text,
             icon: '/favicon.ico' 
           });
        }

        return { ...prev, [senderId]: newCount };
      });
    });

    return () => newSocket.disconnect();
  }, [myself, activeChat]);

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
    setUnreadCounts((prev) => ({ ...prev, [String(user._id)]: 0 }));
    
    setActiveChat({
      _id: user._id,
      handle: user.daplinkID?.handle,
      profile: user.daplinkID?.profile,
    });
  };

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : "??";

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${colors.bg}`}>
      <Navbar />

      <main className="grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-5">
            {myself && (
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${colors.tag}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Logged in as @{myself?.daplinkID?.handle || myself.handle}
              </div>
            )}
            <h1 className={`text-4xl md:text-6xl font-bold tracking-tight ${colors.text}`}>Discover the Community</h1>
            <div className="pt-4">
              <button onClick={handleFetchAll} disabled={loading} className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${colors.btnPrimary} ${loading ? "opacity-70 cursor-wait" : ""}`}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {loading ? "Discovering..." : "Explore Directory"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {people.filter(user => user?.daplinkID?.handle !== myself?.daplinkID?.handle).map((user, index) => {
              const unread = unreadCounts[String(user._id)] || 0;

              return (
                <div key={user._id || index} className={`relative group rounded-2xl border transition-all duration-200 flex flex-col p-6 shadow-sm hover:shadow-md ${colors.card} ${colors.cardHover}`}>
                  
                  {unread > 0 && (
                    <div className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce z-10">
                      {unread}
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-14 w-14 rounded-full flex items-center justify-center font-bold text-lg border-2 ${colors.avatarBg} ${theme === 'dark' ? 'border-zinc-700' : 'border-white'} shadow-sm`}>
                      {user?.daplinkID?.profile ? (
                        <img src={user.daplinkID.profile} alt="Profile" className="h-full w-full object-cover rounded-full" />
                      ) : getInitials(user?.daplinkID?.handle)}
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1 border ${colors.tag}`}>
                       <CheckCircle2 className="w-3 h-3" /> User
                    </span>
                  </div>

                  <div className="mb-4 flex-1">
                    <h3 className={`text-lg font-bold mb-1 ${colors.text}`}>@{user?.daplinkID?.handle || "Incognito"}</h3>
                    <div className={`flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider mb-3 ${colors.subtext}`}>
                      <Briefcase className="w-3.5 h-3.5" />
                      {user?.daplinkID?.profession || "Creator"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 mt-auto">
                    <Link href={`/u/${user?.daplinkID?.handle}`} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${colors.btnSecondary}`}>
                      <User className="w-4 h-4" /> Profile
                    </Link>

                    <button
                      onClick={() => handleOpenChat(user)}
                      disabled={user?.daplinkID?.handle === params.handle}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${user?.daplinkID?.handle === params.handle ? "opacity-50 cursor-not-allowed bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500" : colors.btnPrimary}
                        ${unread > 0 ? "ring-2 ring-red-500 ring-offset-2 dark:ring-offset-[#141414]" : ""}
                      `}
                    >
                      {unread > 0 ? <Bell className="w-4 h-4 animate-pulse text-red-500" /> : <Send className="w-4 h-4" />}
                      {unread > 0 ? 'New Message' : 'Message'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />

      {activeChat && myself && globalSocket && (
        <ChatWidget
          currentUserId={myself._id}
          currentUserHandle={myself?.daplinkID?.handle || myself.handle || "Me"} 
          recipient={activeChat}
          onClose={() => setActiveChat(null)}
          theme={theme}
          socket={globalSocket}
        />
      )}
    </div>
  );
};

export default UserProfile;