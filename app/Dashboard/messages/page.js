"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import { buildBackendConfig, buildSocketOptions } from '@/lib/backendAuth';
import {
    Send, Search, MoreVertical, Check, CheckCheck, MessageSquare, Loader2
} from 'lucide-react';

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
        bg: "bg-[#000000]",
        sidebar: "bg-[#0a0a0a] border-zinc-800",
        chatArea: "bg-[#000000]",
        header: "bg-[#0a0a0a] border-zinc-800",
        text: "text-zinc-100",
        subtext: "text-zinc-500",
        inputContainer: "bg-[#141414] border-transparent focus-within:border-zinc-700",
        inputText: "text-zinc-100",
        sentBubble: "bg-zinc-100 text-black",
        receivedBubble: "bg-[#18181b] text-zinc-100 border border-zinc-800/50",
        activeChat: "bg-[#18181b]",
        hoverChat: "hover:bg-[#141414]",
    };

    useEffect(() => {
        const initializeData = async () => {
            try {
                const meRes = await axios.get('/api/auth/me');
                setMyself(meRes.data.user);

                const convRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/sidebar/conversations?t=${Date.now()}`,
                    buildBackendConfig()
                );

                console.log("Loaded Conversations from DB:", convRes.data);
                setConversations(convRes.data || []);

                const unreadRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/unread/counts`, buildBackendConfig());
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
        const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL, buildSocketOptions());
        setSocket(newSocket);

        newSocket.on("receive_message", (data) => {
            const senderId = String(data.senderId);

            setUnreadCounts(prev => {
                if (activeChat?.user?._id && String(activeChat.user._id) === senderId) return prev;
                return { ...prev, [senderId]: (prev[senderId] || 0) + 1 };
            });

            if (activeChat?.user?._id && String(activeChat.user._id) === senderId) {
                setMessages(prev => [...prev, {
                    _id: data._id,
                    message: data.text,
                    author: senderId,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
                axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/mark-read/${senderId}`, {}, buildBackendConfig());
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
                    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/sidebar/conversations?t=${Date.now()}`, buildBackendConfig())
                        .then(res => setConversations(res.data));
                }
                return updatedConv;
            });
        });

        return () => newSocket.disconnect();
    }, [myself, activeChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSelectChat = async (conv) => {
        if (!conv?.user?._id) return;
        setActiveChat(conv);
        setUnreadCounts(prev => ({ ...prev, [String(conv.user._id)]: 0 }));

        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${conv.user._id}?t=${Date.now()}`, buildBackendConfig());
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
        <div className={`flex w-full h-[calc(100vh-100px)] min-h-150 overflow-hidden rounded-xl border ${ui.sidebar}`}>

            {/* LEFT SIDEBAR */}
            <div className={`w-full md:w-[320px] lg:w-90 flex flex-col border-r ${ui.sidebar} transition-all duration-300 ${activeChat ? 'hidden md:flex' : 'flex'}`}>

                <div className={`h-18 shrink-0 flex items-center justify-between px-6 border-b ${ui.header}`}>
                    <h2 className={`text-lg font-bold ${ui.text}`}>Messages</h2>
                    <div className="flex gap-4 text-zinc-500">
                        <MessageSquare className="w-5 h-5 cursor-pointer hover:text-indigo-500 transition-colors" />
                        <MoreVertical className="w-5 h-5 cursor-pointer hover:text-indigo-500 transition-colors" />
                    </div>
                </div>

                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${ui.inputContainer}`}>
                        <Search className={`w-4 h-4 ${ui.subtext}`} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`flex-1 bg-transparent text-sm focus:outline-none ${ui.inputText}`}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {loadingChats ? (
                        <div className="flex justify-center items-center h-32">
                            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                        </div>
                    ) : filteredConversations.map((conv) => {
                        const userId = conv.user?._id;
                        const unread = unreadCounts[String(userId)] || 0;
                        const isSelected = activeChat?.user?._id === userId;
                        const handle = conv.user?.daplinkID?.handle || conv.user?.handle || "Incognito";
                        const profilePic = conv.user?.daplinkID?.profile || conv.user?.profile; 

                        if (!userId) return null;

                        return (
                            <div
                                key={userId}
                                onClick={() => handleSelectChat(conv)}
                                className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800/30
                  ${isSelected ? ui.activeChat : ui.hoverChat}`}
                            >
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
                                        {profilePic ? (
                                            <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                        ) : getInitials(handle)}
                                    </div>
                                    {unread > 0 && (
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-[#0a0a0a]"></div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className={`font-semibold text-[15px] truncate ${ui.text}`}>
                                            {handle}
                                        </h3>
                                        <span className={`text-[11px] whitespace-nowrap ${unread > 0 ? 'text-emerald-500 font-semibold' : ui.subtext}`}>
                                            {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className={`text-[13px] truncate pr-2 ${unread > 0 ? ui.text : ui.subtext} ${unread > 0 ? 'font-medium' : ''}`}>
                                            {conv.lastMessage?.text || "Started a conversation"}
                                        </p>
                                        {unread > 0 && (
                                            <span className="shrink-0 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                                {unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {!loadingChats && filteredConversations.length === 0 && (
                        <div className={`p-8 text-center text-sm ${ui.subtext}`}>
                            No conversations yet. Start chatting from the Community tab!
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT CHAT AREA */}
            <div className={`flex-1 flex flex-col ${ui.chatArea} ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
                {activeChat ? (
                    <>
                        <div className={`h-18 shrink-0 flex items-center justify-between px-6 border-b border-l border-zinc-200 dark:border-zinc-800 ${ui.header}`}>
                            <div className="flex items-center gap-4">
                                <button className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white" onClick={() => setActiveChat(null)}>
                                    ←
                                </button>
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold overflow-hidden">
                                        {activeChat.user?.daplinkID?.profile || activeChat.user?.profile ? (
                                            <img src={activeChat.user?.daplinkID?.profile || activeChat.user?.profile} className="w-full h-full object-cover" />
                                        ) : getInitials(activeChat.user?.daplinkID?.handle || activeChat.user?.handle || "In")}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]"></div>
                                </div>
                                <div>
                                    <h3 className={`font-semibold text-[15px] ${ui.text}`}>@{activeChat.user?.daplinkID?.handle || "Incognito"}</h3>
                                    <p className={`text-[12px] ${ui.subtext}`}>Online</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                            {messages.map((msg, idx) => {
                                const isMe = msg.author === "Me";
                                return (
                                    <div key={msg._id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[75%] px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${isMe ? ui.sentBubble : ui.receivedBubble} ${isMe ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm'}`}>
                                            <p className="whitespace-pre-wrap wrap-break-word">{msg.message}</p>
                                        </div>
                                        <div className={`mt-1.5 flex items-center gap-1.5 text-[11px] font-medium ${ui.subtext}`}>
                                            {msg.time}
                                            {isMe && (
                                                msg.status === "read" ? <CheckCheck className="w-4 h-4 text-blue-500" /> :
                                                    msg.status === "sending" ? <Loader2 className="w-3 h-3 animate-spin" /> :
                                                        <Check className="w-4 h-4" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>

                        <div className={`p-4 md:p-6 border-t border-l border-zinc-200 dark:border-zinc-800 ${ui.header}`}>
                            <form onSubmit={handleSend} className={`relative flex items-center p-1.5 rounded-2xl border transition-all duration-200 ${ui.inputContainer}`}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className={`flex-1 py-2.5 pl-4 pr-2 bg-transparent text-[15px] focus:outline-none placeholder:text-zinc-600 ${ui.inputText}`}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className={`w-11 h-11 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-40 disabled:scale-95 bg-zinc-200 text-zinc-900 hover:bg-white ${newMessage.trim() ? 'scale-100 shadow-md' : 'scale-95'}`}
                                >
                                    <Send className="w-5 h-5 ml-1" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center border-l border-zinc-200 dark:border-zinc-800 opacity-60">
                        <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
                            <MessageSquare className={`w-8 h-8 ${ui.text}`} />
                        </div>
                        <h2 className={`text-xl font-medium mb-1 ${ui.text}`}>Your Messages</h2>
                        <p className={`text-sm ${ui.subtext}`}>Select a conversation to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
