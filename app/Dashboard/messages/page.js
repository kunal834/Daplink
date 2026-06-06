"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import {
    Send, Search, MoreVertical, Check, CheckCheck, MessageSquare, Loader2,
    Smile, Paperclip, Phone, Video as VideoIcon, User, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MessagePage() {
    const [myself, setMyself] = useState(null);
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [unreadCounts, setUnreadCounts] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingChats, setLoadingChats] = useState(true);

    const scrollRef = useRef(null);

    const ui = {
        bg: "bg-transparent",
        sidebar: "bg-white/40 dark:bg-[#09090b]/40 backdrop-blur-xl border-zinc-200/80 dark:border-zinc-800/80",
        chatArea: "bg-white/20 dark:bg-[#040405]/30 backdrop-blur-lg",
        header: "bg-white/50 dark:bg-[#09090b]/80 backdrop-blur-md border-zinc-200/80 dark:border-zinc-800/80",
        text: "text-zinc-900 dark:text-zinc-50",
        subtext: "text-zinc-500 dark:text-zinc-400",
        inputContainer: "bg-white/80 dark:bg-[#121215]/80 border-zinc-200/80 dark:border-zinc-800/80 focus-within:border-indigo-500/80 dark:focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:focus-within:ring-indigo-500/5",
        inputText: "text-zinc-900 dark:text-zinc-100",
        sentBubble: "bg-gradient-to-br from-indigo-500 via-indigo-650 to-violet-600 text-white shadow-lg shadow-indigo-500/15",
        receivedBubble: "bg-white/80 dark:bg-[#121216]/90 text-zinc-900 dark:text-zinc-100 border border-zinc-200/60 dark:border-zinc-800/50 shadow-sm",
        activeChat: "bg-indigo-500/5 dark:bg-indigo-500/10 border-l-4 border-indigo-500 shadow-inner",
        hoverChat: "hover:bg-zinc-100/50 dark:hover:bg-white/5",
    };

    useEffect(() => {
        const initializeData = async () => {
            try {
                const meRes = await axios.get('/api/auth/me');
                setMyself(meRes.data.user);

                const convRes = await axios.get(
                    `/api/backend/messages/sidebar/conversations?t=${Date.now()}`
                );

                console.log("Loaded Conversations from DB:", convRes.data);
                setConversations(convRes.data || []);

                const unreadRes = await axios.get(`/api/backend/messages/unread/counts`);
                setUnreadCounts(unreadRes.data || {});

                setLoadingChats(false);
            } catch (err) {
                console.error("🔥 Error initializing messaging:", err);
                setLoadingChats(false);
            }
        };
        initializeData();
    }, []);

    useEffect(() => {
        if (!myself) return;
        let newSocket = null;
        const setupSocket = async () => {
            try {
                const tokenRes = await axios.get('/api/auth/socket-token');
                const token = tokenRes?.data?.token;
                if (!token) return;

                newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
                    withCredentials: true,
                    auth: {
                        token,
                        authorization: `Bearer ${token}`,
                    },
                });

                setSocket(newSocket);

                newSocket.on("receive_message", (data) => {
                    const senderId = String(data.senderId);
                    const receiverId = String(data.receiverId || "");
                    const meId = String(myself?._id || "");
                    const activeChatId = String(activeChat?.user?._id || "");
                    const isIncomingForActiveChat = Boolean(activeChatId && senderId === activeChatId);
                    const isOutgoingEchoForActiveChat = Boolean(activeChatId && senderId === meId && receiverId === activeChatId);

                    setUnreadCounts(prev => {
                        if (senderId === meId) return prev;
                        if (activeChatId && activeChatId === senderId) return prev;
                        return { ...prev, [senderId]: (prev[senderId] || 0) + 1 };
                    });

                    if (isIncomingForActiveChat || isOutgoingEchoForActiveChat) {
                        setMessages(prev => {
                            if (isOutgoingEchoForActiveChat) {
                                const tempIndex = prev.findIndex(
                                    (m) => String(m._id).startsWith("temp-") && m.message === data.text
                                );
                                if (tempIndex !== -1) {
                                    const updated = [...prev];
                                    updated[tempIndex] = {
                                        ...updated[tempIndex],
                                        _id: data._id || updated[tempIndex]._id,
                                        status: data.status || "sent",
                                    };
                                    return updated;
                                }
                            }

                            if (data._id && prev.some((m) => String(m._id) === String(data._id))) {
                                return prev;
                            }

                            return [...prev, {
                                _id: data._id || `msg-${Date.now()}`,
                                message: data.text,
                                author: senderId === meId ? "Me" : senderId,
                                status: data.status || (senderId === meId ? "sent" : undefined),
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }];
                        });
                        if (isIncomingForActiveChat) {
                            void axios.put(`/api/backend/messages/mark-read/${senderId}`, {});
                        }
                    }

                    setConversations(prev => {
                        const existingIdx = prev.findIndex(c => String(c.user?._id) === senderId);
                        const updatedConv = [...prev];
                        if (existingIdx > -1) {
                            const [movedChat] = updatedConv.splice(existingIdx, 1);
                            movedChat.lastMessage = { text: data.text };
                            movedChat.lastMessageTime = new Date();
                            updatedConv.unshift(movedChat);
                        } else {
                            axios.get(`/api/backend/messages/sidebar/conversations?t=${Date.now()}`)
                                .then(res => setConversations(res.data));
                        }
                        return updatedConv;
                    });
                });
            } catch (error) {
                console.error("Socket auth failed:", error);
            }
        };

        setupSocket();
        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, [myself, activeChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSelectChat = async (conv) => {
        if (!conv?.user?._id) return;
        setActiveChat(conv);
        setUnreadCounts(prev => ({ ...prev, [String(conv.user._id)]: 0 }));

        try {
            const res = await axios.get(`/api/backend/messages/${conv.user._id}?t=${Date.now()}`);
            const formatted = res.data.map(msg => ({
                _id: msg._id,
                message: msg.text,
                author: String(msg.senderId) === String(myself._id) ? "Me" : conv.user._id,
                status: msg.status,
                time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            setMessages(formatted);
        } catch (err) {
            console.error("Failed fetching chat:", err);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!socket || !newMessage.trim() || !activeChat?.user?._id) return;

        const tempMsg = {
            _id: `temp-${Date.now()}`,
            message: newMessage.trim(),
            author: "Me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "sending"
        };

        setMessages(prev => [...prev, tempMsg]);
        socket.emit("send_message", {
            receiverId: activeChat.user._id,
            text: newMessage.trim(),
        });
        setTimeout(() => {
            setMessages(prev => prev.map((msg) => (
                msg._id === tempMsg._id && msg.status === "sending"
                    ? { ...msg, status: "sent" }
                    : msg
            )));
        }, 1500);

        setConversations(prev => {
            const existingIdx = prev.findIndex(c => String(c.user?._id) === String(activeChat.user._id));
            const updated = [...prev];
            if (existingIdx > -1) {
                updated[existingIdx].lastMessage = { text: newMessage.trim() };
                updated[existingIdx].lastMessageTime = new Date();
                const [moved] = updated.splice(existingIdx, 1);
                updated.unshift(moved);
            }
            return updated;
        });

        setNewMessage("");
    };

    const getInitials = (handle) => handle ? handle.substring(0, 2).toUpperCase() : "??";

    const filteredConversations = conversations.filter(c => {
        const handleStr = c.user?.daplinkID?.handle || c.user?.handle || "Incognito";
        return handleStr.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="relative w-full h-[calc(100vh-96px)] overflow-hidden rounded-[2rem] border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl flex animate-in fade-in duration-700">
            {/* Background ambient blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-zinc-50 dark:bg-[#070708] transition-colors duration-500">
                <div className="absolute w-[400px] h-[400px] bg-purple-600/10 dark:bg-purple-900/15 top-[-10%] left-[-10%] rounded-full blur-[80px]"></div>
                <div className="absolute w-[500px] h-[500px] bg-emerald-600/5 dark:bg-emerald-900/10 bottom-[-10%] right-[-10%] rounded-full blur-[90px]"></div>
            </div>

            {/* LEFT SIDEBAR (CONVERSATIONS) */}
            <div className={`relative z-10 w-full md:w-[310px] lg:w-86 flex flex-col border-r border-inherit transition-all duration-300 ${ui.sidebar} ${activeChat ? 'hidden md:flex' : 'flex'}`}>

                <div className={`h-18 shrink-0 flex items-center justify-between px-6 border-b border-inherit ${ui.header}`}>
                    <div>
                        <h2 className={`text-base font-black tracking-tight ${ui.text}`}>Messaging Studio</h2>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-500 flex items-center gap-1 mt-0.5"><Sparkles className="w-2.5 h-2.5 animate-pulse" /> real-time active</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-xl hover:bg-zinc-550/10 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-xl hover:bg-zinc-550/10 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-inherit">
                    <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all ${ui.inputContainer}`}>
                        <Search className={`w-3.5 h-3.5 ${ui.subtext}`} />
                        <input
                            type="text"
                            placeholder="Filter chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`flex-1 bg-transparent text-xs font-semibold focus:outline-none ${ui.inputText}`}
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin divide-y dark:divide-zinc-800/30 divide-zinc-200/40">
                    <AnimatePresence>
                        {loadingChats ? (
                            <div className="flex justify-center items-center h-32">
                                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                            </div>
                        ) : filteredConversations.map((conv) => {
                            const userId = conv.user?._id;
                            const unread = unreadCounts[String(userId)] || 0;
                            const isSelected = activeChat?.user?._id === userId;
                            const handle = conv.user?.daplinkID?.handle || conv.user?.handle || "Incognito";
                            const profilePic = conv.user?.daplinkID?.profile || conv.user?.profile;

                            if (!userId) return null;

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={userId}
                                    onClick={() => handleSelectChat(conv)}
                                    className={`flex items-center gap-3.5 px-5 py-4.5 cursor-pointer transition-all border-l-4 border-transparent
                                      ${isSelected ? ui.activeChat : `${ui.hoverChat}`} relative`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-11.5 h-11.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
                                            {profilePic ? (
                                                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                            ) : getInitials(handle)}
                                        </div>
                                        {/* Status Glow Dot */}
                                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-3 border-white dark:border-[#0f0f11] flex items-center justify-center">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-75"></span>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className={`font-bold text-xs truncate ${ui.text}`}>
                                                @{handle}
                                            </h3>
                                            <span className={`text-[9px] font-extrabold tracking-wider whitespace-nowrap ${unread > 0 ? 'text-indigo-500' : ui.subtext}`}>
                                                {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className={`text-xs truncate pr-2 leading-relaxed ${unread > 0 ? `${ui.text} font-bold` : ui.subtext}`}>
                                                {conv.lastMessage?.text || "Real-time communication active"}
                                            </p>
                                            
                                            <AnimatePresence>
                                                {unread > 0 && (
                                                    <motion.span 
                                                        initial={{ scale: 0.7, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.7, opacity: 0 }}
                                                        className="shrink-0 bg-indigo-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md shadow-indigo-600/20"
                                                    >
                                                        {unread}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {!loadingChats && filteredConversations.length === 0 && (
                        <div className={`p-8 text-center text-xs font-semibold leading-relaxed ${ui.subtext}`}>
                            No conversations yet.<br />Reach out from the community directory to start!
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT CHAT AREA */}
            <div className={`relative z-10 flex-1 flex flex-col ${ui.chatArea} ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className={`h-18 shrink-0 flex items-center justify-between px-6 border-b border-inherit ${ui.header}`}>
                            <div className="flex items-center gap-3">
                                <button className="md:hidden p-2 rounded-xl text-zinc-500 hover:bg-zinc-800/10 dark:hover:bg-white/5 mr-1" onClick={() => setActiveChat(null)}>
                                    ←
                                </button>
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold overflow-hidden shadow-xs">
                                        {activeChat.user?.daplinkID?.profile || activeChat.user?.profile ? (
                                            <img src={activeChat.user?.daplinkID?.profile || activeChat.user?.profile} className="w-full h-full object-cover" />
                                        ) : getInitials(activeChat.user?.daplinkID?.handle || activeChat.user?.handle || "In")}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0f0f11] flex items-center justify-center">
                                        <span className="w-1 h-1 bg-white rounded-full animate-ping opacity-75"></span>
                                    </div>
                                </div>
                                <div className="leading-none text-left">
                                    <h3 className={`font-bold text-xs ${ui.text}`}>@{activeChat.user?.daplinkID?.handle || "Incognito"}</h3>
                                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-500 mt-0.5 block">Active now</span>
                                </div>
                            </div>

                            <div className="flex gap-1">
                                <button className="p-2.5 rounded-xl hover:bg-zinc-800/10 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400 transition-colors">
                                    <Phone className="w-4 h-4" />
                                </button>
                                <button className="p-2.5 rounded-xl hover:bg-zinc-800/10 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400 transition-colors">
                                    <VideoIcon className="w-4 h-4" />
                                </button>
                                <button className="p-2.5 rounded-xl hover:bg-zinc-800/10 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400 transition-colors">
                                    <User className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Messages Feed Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
                            <AnimatePresence initial={false}>
                                {messages.map((msg, idx) => {
                                    const isMe = msg.author === "Me";
                                    return (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={msg._id || idx} 
                                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                        >
                                            <div className={`max-w-[70%] px-4.5 py-3.25 text-xs leading-relaxed shadow-md ${
                                                isMe ? `${ui.sentBubble} rounded-2xl rounded-tr-xs` : `${ui.receivedBubble} rounded-2xl rounded-tl-xs`
                                            }`}>
                                                <p className="whitespace-pre-wrap break-all">{msg.message}</p>
                                            </div>
                                            
                                            <div className={`mt-1.5 flex items-center gap-1 text-[9px] font-extrabold tracking-wider ${ui.subtext}`}>
                                                {msg.time}
                                                {isMe && (
                                                    msg.status === "read" ? <CheckCheck className="w-3.5 h-3.5 text-blue-450" /> :
                                                        msg.status === "sending" ? <Loader2 className="w-2.5 h-2.5 animate-spin text-indigo-500" /> :
                                                            <Check className="w-3.5 h-3.5" />
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                            <div ref={scrollRef} />
                        </div>

                        {/* Input Box floating deck */}
                        <div className={`p-4 md:p-5 border-t border-inherit ${ui.header}`}>
                            <form onSubmit={handleSend} className={`relative flex items-center p-1.5 rounded-2xl border transition-all duration-300 ${ui.inputContainer}`}>
                                <div className="flex gap-0.5 pl-1.5">
                                    <button type="button" className="p-2 rounded-xl text-zinc-500 hover:text-indigo-500 hover:bg-zinc-800/10 dark:hover:bg-white/5 transition-all">
                                        <Paperclip className="w-4.5 h-4.5" />
                                    </button>
                                    <button type="button" className="p-2 rounded-xl text-zinc-500 hover:text-indigo-500 hover:bg-zinc-800/10 dark:hover:bg-white/5 transition-all">
                                        <Smile className="w-4.5 h-4.5" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                    className={`flex-1 py-2.5 pl-3 pr-2 bg-transparent text-xs font-semibold focus:outline-none placeholder:text-zinc-500 ${ui.inputText}`}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-40 disabled:scale-95 bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 cursor-pointer shrink-0`}
                                >
                                    <Send className="w-4.5 h-4.5 ml-0.5" />
                                </motion.button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 border-l border-zinc-200/50 dark:border-zinc-800/30">
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="w-18 h-18 mb-6 rounded-[1.75rem] bg-indigo-500/10 dark:bg-indigo-900/20 border border-indigo-500/20 dark:border-indigo-400/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xl shadow-indigo-500/5"
                        >
                            <MessageSquare className="w-7 h-7" />
                        </motion.div>
                        <h2 className="text-xl font-black tracking-tight mb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Your Messaging Studio
                        </h2>
                        <p className={`text-xs max-w-sm mb-6 text-center leading-relaxed ${ui.subtext}`}>
                            Select a contact from the active conversations sidebar to open your real-time chat canvas and exchange messages.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mt-2">
                            {[
                                { text: "Real-time Sockets", sub: "P2P direct connections" },
                                { text: "Activity Status", sub: "Live presence glows" },
                                { text: "Secure Sync", sub: "Encrypted handshake" }
                            ].map((item, idx) => (
                                <div key={idx} className="p-3.5 rounded-2xl bg-white/30 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm text-center">
                                    <p className={`text-[10px] font-black uppercase tracking-wider ${ui.text}`}>{item.text}</p>
                                    <p className={`text-[9px] mt-1 ${ui.subtext}`}>{item.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
