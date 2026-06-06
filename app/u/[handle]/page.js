"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Link as LinkIcon, Brain, Wrench, Share2, ExternalLink,
  CheckCircle, Moon, Sun, MapPin, Briefcase, Search,
  Loader2, User, ArrowRight, Lock, Sparkles, Users, UserPlus, UserCheck,
  Edit, Heart, MessageSquare, Globe, Eye, Volume2,
} from 'lucide-react';
import { usePostHog } from "posthog-js/react";

import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from "@/context/Authenticate";
import Navbar from "@/Components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import FollowModal from "@/Components/modals/followModals";
import { FiGithub, FiInstagram, FiLinkedin, FiYoutube } from "react-icons/fi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const PageStyles = ({ theme, themeConfig }) => {
  const accent = themeConfig?.accent || "#8b5cf6";
  const blurVal = themeConfig?.blur ?? 24;
  const radiusVal = themeConfig?.radius ?? 32;
  const cardStyle = themeConfig?.cardStyle || "glass";
  
  let cardBackground = theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.7)';
  let cardBorder = theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
  let cardBlur = `blur(${blurVal}px)`;
  let cardShadow = 'none';

  if (cardStyle === 'flat') {
    cardBackground = theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)';
    cardBorder = theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
    cardBlur = 'none';
  } else if (cardStyle === 'glow') {
    cardBackground = theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.85)';
    cardBorder = accent;
    cardShadow = `0 0 20px ${accent}25`;
  }

  return (
    <style>{`
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .animate-enter {
        animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }

      .bento-card {
        background: ${cardBackground};
        backdrop-filter: ${cardBlur};
        -webkit-backdrop-filter: ${cardBlur};
        border: 1px solid ${cardBorder};
        border-radius: ${radiusVal}px;
        box-shadow: ${cardShadow};
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        position: relative;
      }

      .bento-card:hover {
        transform: translateY(-4px);
        box-shadow: ${theme === 'dark' ? `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 15px ${accent}15` : `0 20px 40px rgba(0, 0, 0, 0.08), 0 0 15px ${accent}10`};
        border: 1px solid ${cardStyle === 'glow' ? accent : theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'};
      }

      .link-card-bg {
        background: linear-gradient(135deg, ${accent}10, ${accent}25);
      }
      
      .custom-accent-btn {
        background-color: ${accent};
        color: #ffffff !important;
        box-shadow: 0 8px 20px ${accent}30;
      }
      
      .custom-accent-btn:hover {
        background-color: ${accent}ee;
        transform: translateY(-1px);
        box-shadow: 0 10px 24px ${accent}45;
      }
    `}</style>
  );
};

function PostCard({ post, user, theme, onUpdate }) {
  const [votingLoading, setVotingLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const hasLiked = user?._id && Array.isArray(post.likes) && post.likes.includes(user._id);
  const hasVoted = user?._id && Array.isArray(post.pollVoters) && post.pollVoters.includes(user._id);

  const totalVotes = Array.isArray(post.pollOptions)
    ? post.pollOptions.reduce((acc, opt) => acc + (opt.votes || 0), 0)
    : 0;

  useEffect(() => {
    axios.post(`/api/posts/${post._id}/interact`, { action: "view" }).catch(() => {});
  }, [post._id]);

  const handleLike = async () => {
    if (!user?._id) {
      toast.error("Please login to react to posts");
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await axios.post(`/api/posts/${post._id}/interact`, { action: "like" });
      if (res.data.success) {
        onUpdate();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Like action failed");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleVote = async (optionIndex) => {
    if (!user?._id) {
      toast.error("Please login to vote");
      return;
    }
    if (votingLoading || hasVoted) return;
    setVotingLoading(true);
    try {
      const res = await axios.post(`/api/posts/${post._id}/interact`, {
        action: "vote",
        optionIndex
      });
      if (res.data.success) {
        toast.success("Vote recorded!");
        onUpdate();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Voting failed");
    } finally {
      setVotingLoading(false);
    }
  };

  const dateStr = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="bento-card p-6 flex flex-col gap-4 text-left w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
            {post.type === "poll" ? "Interactive Poll" : post.type === "audio" ? "Voice Update" : "Creator Update"}
          </span>
          <span className="text-[10px] text-zinc-500 font-semibold">• {dateStr}</span>
        </div>
      </div>

      <p className="text-sm font-semibold leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {post.type === "poll" && (
        <div className="space-y-2 mt-2">
          {post.pollOptions.map((opt, idx) => {
            const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            return (
              <div key={idx} className="relative overflow-hidden rounded-2xl border border-zinc-800/10 dark:border-white/5 transition-all">
                {hasVoted ? (
                  <>
                    <div
                      className="absolute inset-y-0 left-0 bg-indigo-500/10 transition-all duration-550"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between px-4 py-3 text-xs font-bold">
                      <span>{opt.optionText}</span>
                      <span className="text-indigo-400">{percentage}% ({opt.votes})</span>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => handleVote(idx)}
                    disabled={votingLoading}
                    className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {opt.optionText}
                  </button>
                )}
              </div>
            );
          })}
          {hasVoted && (
            <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest pl-1 mt-1">
              Total Votes: {totalVotes}
            </p>
          )}
        </div>
      )}

      {post.type === "audio" && post.audioUrl && (
        <div className="mt-2 p-3.5 rounded-2xl bg-black/10 dark:bg-white/5 border border-zinc-800/10 dark:border-white/5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center shrink-0">
            <Volume2 size={18} />
          </div>
          <audio src={post.audioUrl} controls className="w-full h-8 accent-indigo-600" />
        </div>
      )}

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-800/5 dark:border-white/5">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex items-center gap-1.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            hasLiked ? "text-rose-500" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Heart size={14} fill={hasLiked ? "currentColor" : "none"} />
          <span>{post.likes?.length || 0}</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold">
          <Eye size={14} />
          <span>{post.views || 0}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { theme } = useTheme();
  const router = useRouter();
  const routeParams = useParams();
  const routeHandle = Array.isArray(routeParams?.handle)
    ? routeParams.handle[0]
    : routeParams?.handle;
  const queryClient = useQueryClient();
  const posthog = usePostHog();
  const [copied, setCopied] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, tab: 'followers' });
  const [activeTab, setActiveTab] = useState('links');
  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  // AI twin chat states
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
    const {
    data,
    isLoading: profileLoading,
    isError: profileError
  } = useQuery({
    queryKey: ["profile-by-handle", routeHandle],
    enabled: Boolean(routeHandle),
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await axios.get(`/api/links/${routeHandle}`);
      if (!res.data?.result) throw new Error("Profile not found");
      return res.data.result;
    }
  });

  // Initialize AI messages with greeting
  useEffect(() => {
    if (data?.aiConfig?.aiEnabled) {
      setAiMessages([
        {
          role: "assistant",
          text: data.aiConfig.aiPrompt || "Hi! I'm an AI assistant. Ask me anything about my work!"
        }
      ]);
    }
  }, [data]);

  const handleSendAiMessage = async (e, textOverride = "") => {
    if (e) e.preventDefault();
    const query = textOverride || aiInput;
    if (!query.trim() || aiLoading) return;

    const userMessage = { role: "user", text: query.trim() };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput("");
    setAiLoading(true);

    try {
      const historyPayload = aiMessages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await axios.post("/api/ai/chat", {
        handle: routeHandle,
        message: query.trim(),
        history: historyPayload
      });

      if (res.data?.success) {
        setAiMessages(prev => [...prev, { role: "assistant", text: res.data.reply }]);
      } else {
        setAiMessages(prev => [...prev, { role: "assistant", text: "Sorry, I had trouble processing that question." }]);
      }
    } catch (err) {
      setAiMessages(prev => [...prev, { role: "assistant", text: "Something went wrong. Please check your network and try again." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const { user } = useAuth();



  const {
    data: postsData,
    refetch: refetchPosts
  } = useQuery({
    queryKey: ["posts-by-handle", routeHandle],
    enabled: Boolean(routeHandle),
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await axios.get(`/api/posts?handle=${routeHandle}`);
      return res.data?.posts || [];
    }
  });

  const loading = profileLoading;

  useEffect(() => {
    if (data?._id && data?.handle && posthog) {
      posthog.capture("bio_page_view", {
        handle: data.handle,
        profile_id: data._id,
        link_count: Array.isArray(data.links) ? data.links.length : 0,
      });
    }
  }, [data?._id, data?.handle, posthog]);

  const followQueryKey = ["follow-data", data?._id];

  const {
    data: followInfo,
    refetch: refetchFollowData
  } = useQuery({
    queryKey: followQueryKey,
    enabled: Boolean(data?._id),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await axios.get(`/api/getuser?daplinkID=${data._id}`);
      return res.data;
    }
  });

  const targetUserId = followInfo?.userId || null;
  const followData = {
    followers: Array.isArray(followInfo?.follower) ? followInfo.follower : [],
    following: Array.isArray(followInfo?.following) ? followInfo.following : []
  };
  const followCount = {
    follower: followData.followers.length,
    following: followData.following.length
  };

  const isFollowingQueryKey = ["is-following", user?._id, targetUserId];
  const { data: isFollowing = false } = useQuery({
    queryKey: isFollowingQueryKey,
    enabled: Boolean(user?._id && targetUserId),
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await axios.get(
        `/api/isFollowing?followerId=${user?._id}&followingId=${targetUserId}`
      );
      return Boolean(res.data?.isFollowing);
    }
  });

  const openFollowers = () => {
    setModalState({ isOpen: true, tab: 'followers' });
    if (data?._id) refetchFollowData();
  };
  const openFollowing = () => {
    setModalState({ isOpen: true, tab: 'following' });
    if (data?._id) refetchFollowData();
  };

  const colors = {
    bg: theme === 'dark' ? 'bg-[#050505]' : 'bg-[#f4f4f5]',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    subtext: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
  };

  const handleFollow = async () => {
    if (!user?._id) {
      toast.error("Please login to follow");
      return;
    }
    setFollowLoading(true);
    try {
      const res = await axios.post("/api/follow", {
        currentUserId: user._id,
        targetUserId: targetUserId
      });
      const json = await res.data;
      queryClient.setQueryData(isFollowingQueryKey, Boolean(json.isFollowing));
      await queryClient.invalidateQueries({ queryKey: followQueryKey });
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${colors.bg}`}>
        <div className="relative">
          <div className={`h-24 w-24 rounded-[32px] ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-200'} animate-pulse`}></div>
        </div>
      </div>
    );
  }

  if (profileError || !data) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${colors.bg} ${colors.text}`}>
        <h2 className="text-4xl font-extrabold mb-4">Profile Not Found</h2>
        <Link href="/" className="px-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold hover:scale-105 transition-transform inline-flex items-center gap-2">
           Return Home
        </Link>
      </div>
    );
  }

  const { handle, profile, profession, location, links = [] } = data;
  const renderAiTab = () => (
    <div className="bento-card p-6 flex flex-col min-h-[400px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/10 dark:border-white/5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold">AI Digital Twin</h4>
            <p className={`text-[10px] ${colors.subtext}`}>Trained on @{handle}'s background and links</p>
          </div>
        </div>
        <button 
          onClick={() => setAiMessages([{ role: "assistant", text: data.aiConfig.aiPrompt || "Hi! I'm an AI assistant. Ask me anything!" }])} 
          className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border border-zinc-200/60 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${colors.subtext}`}
        >
          Reset Chat
        </button>
      </div>

      {/* Messages Panel */}
      <div className="flex-grow overflow-y-auto space-y-4 max-h-[300px] mb-4 pr-1 scrollbar-thin text-left">
        {aiMessages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                isUser 
                  ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
                  : theme === 'dark' ? "bg-white/5 text-zinc-100 rounded-tl-none border border-white/5" : "bg-black/5 text-zinc-900 rounded-tl-none border border-black/5"
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          );
        })}
        {aiLoading && (
          <div className="flex justify-start">
            <div className={`rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2 ${
              theme === 'dark' ? "bg-white/5 text-zinc-400" : "bg-black/5 text-zinc-650"
            }`}>
              <Loader2 size={12} className="animate-spin" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      {aiMessages.length === 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {["Tell me about your services", "What is your profession?", "Show your links"].map((chip, idx) => (
            <button
              key={idx}
              onClick={(e) => handleSendAiMessage(e, chip)}
              className={`text-[10px] font-semibold px-3 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${colors.subtext}`}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendAiMessage} className="flex gap-2">
        <input
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          placeholder="Ask me anything..."
          className={`flex-1 px-4 py-3 rounded-2xl border text-xs font-semibold focus:outline-none transition-all ${
            theme === 'dark' 
              ? "border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500/80" 
              : "border-zinc-200 bg-zinc-50 text-zinc-900 focus:border-zinc-900"
          }`}
        />
        <button
          type="submit"
          disabled={!aiInput.trim() || aiLoading}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  );

  const renderPostsTab = () => (
    <div className="space-y-4 w-full">
      {postsData && postsData.length > 0 ? (
        postsData.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            user={user}
            theme={theme}
            onUpdate={refetchPosts}
          />
        ))
      ) : (
        <div className="bento-card p-12 flex flex-col items-center justify-center text-center col-span-full min-h-[300px]">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
            <Brain size={40} className={theme === 'dark' ? 'text-white/50' : 'text-gray-400'} />
          </div>
          <h3 className="text-2xl font-black mb-2">No Posts Yet</h3>
          <p className={colors.subtext}>Check back later for updates and new content.</p>
        </div>
      )}
    </div>
  );

  const renderClassicLayout = () => (
    <div className="max-w-xl mx-auto space-y-5 animate-enter">
      {/* Profile Card */}
      <div className="bento-card p-8 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-xl opacity-40"></div>
          <div className={`relative h-28 w-28 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 shadow-2xl ${
            data.avatarBorder === 'emerald-glow' ? 'p-[4px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-green-500 animate-pulse' :
            data.avatarBorder === 'aurora' ? 'p-[4px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]' :
            data.avatarBorder === 'neon-sunset' ? 'p-[4px] bg-gradient-to-tr from-orange-500 via-rose-500 to-fuchsia-600 shadow-[0_0_20px_rgba(244,63,94,0.4)]' :
            data.avatarBorder === 'cyberpunk' ? 'p-[4px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-[0_0_20px_rgba(236,72,153,0.4)]' :
            'border-2 border-white/20'
          }`}>
            <div className="h-full w-full rounded-full overflow-hidden bg-zinc-950">
              <img src={profile} alt={handle} className="h-full w-full object-cover" />
            </div>
          </div>
          {data.statusGlow && (
            <span className={`absolute bottom-0 right-0 h-5 w-5 rounded-full border-[3px] border-zinc-950 z-20 ${
              data.statusGlow === 'online' ? 'bg-emerald-500' :
              data.statusGlow === 'busy' ? 'bg-rose-500' :
              data.statusGlow === 'away' ? 'bg-amber-500' : 'bg-zinc-500'
            }`} />
          )}
        </div>
        <h1 className="text-2xl font-black tracking-tight mb-2 flex items-center justify-center gap-1.5">
          @{handle}
          <CheckCircle size={18} className="text-blue-500 shrink-0" fill="currentColor" />
        </h1>
        <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${colors.subtext}`}>
          {profession ? profession : "Digital Creator"}
        </p>
        
        {location && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.75 rounded-full bg-black/5 dark:bg-white/5 mb-4">
            <MapPin size={12} className={theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'} />
            <span className="text-[9px] font-extrabold tracking-wider uppercase">{location}</span>
          </div>
        )}

        <p className={`text-xs leading-relaxed max-w-sm mb-6 ${colors.subtext}`}>{data.script || 'Tell the world who you are...'}</p>

        {/* Follow / Edit Button */}
        <div className="w-full max-w-xs">
          {targetUserId == null ? null : targetUserId !== user?._id ? (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`w-full py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
                isFollowing
                  ? theme === "dark" ? "bg-white/10 text-white" : "bg-black/10 text-black"
                  : "custom-accent-btn cursor-pointer"
              }`}
            >
              {followLoading ? <Loader2 size={16} className="animate-spin" /> : isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
              {isFollowing ? "Following" : "Follow"}
            </button>
          ) : (
            <button
              onClick={() => router.push("/Dashboard/editProfile")}
              className="w-full py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all custom-accent-btn cursor-pointer"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Social Icons Card */}
      <div className="bento-card p-4">
        <div className="flex items-center justify-center gap-4">
          {[
            { Icon: FiGithub, color: 'hover:text-gray-900 dark:hover:text-white', bg: 'hover:bg-gray-200 dark:hover:bg-zinc-800' },
            { Icon: FiInstagram, color: 'hover:text-pink-500', bg: 'hover:bg-pink-50 dark:hover:bg-pink-500/10' },
            { Icon: FiLinkedin, color: 'hover:text-blue-600', bg: 'hover:bg-blue-50 dark:hover:bg-blue-500/10' },
            { Icon: FiYoutube, color: 'hover:text-red-500', bg: 'hover:bg-red-50 dark:hover:bg-red-500/10' }
          ].map(({ Icon, color, bg }, idx) => (
            <button key={idx} className={`p-3 rounded-2xl transition-all duration-300 ${color} ${bg} ${theme === 'dark' ? 'text-zinc-500 bg-white/5' : 'text-gray-500 bg-black/5'} border-0 cursor-pointer`}>
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Tabs switcher */}
      <div className="flex justify-center mt-6">
        <div className="bento-card p-1.5 flex gap-2 w-full rounded-full">
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'links'
                ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white')
                : (theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black')
            }`}
          >
            My Links
          </button>
          {data?.aiConfig?.aiEnabled && (
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'ai'
                  ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white')
                  : (theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black')
              }`}
            >
              AI Twin
            </button>
          )}
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'posts'
                ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white')
                : (theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black')
            }`}
          >
            Posts
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="min-h-[200px]">
        {activeTab === 'links' ? (
          <div className="space-y-3">
            {links?.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={() => {
                  posthog?.capture("bio_link_clicked", {
                    handle: data?.handle,
                    link_url: item.link,
                    link_text: item.linktext,
                  });
                }}
                className="bento-card p-5 flex items-center group w-full"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  theme === 'dark' ? 'bg-white/10 text-white group-hover:scale-105' : 'bg-black/5 text-black group-hover:scale-105'
                }`}>
                  <Globe size={20} />
                </div>
                <div className="ml-5 flex-1 overflow-hidden text-left">
                  <h3 className="text-sm font-black truncate mb-0.5">{item.linktext}</h3>
                  <p className={`text-[10px] truncate ${colors.subtext}`}>{item.link}</p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  theme === 'dark' ? 'bg-white/5 group-hover:bg-white group-hover:text-black' : 'bg-black/5 group-hover:bg-black group-hover:text-white'
                }`}>
                  <ExternalLink size={12} />
                </div>
              </a>
            ))}
          </div>
        ) : activeTab === 'ai' ? (
          renderAiTab()
        ) : (
          renderPostsTab()
        )}
      </div>
    </div>
  );

  const renderSplitLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-enter text-left items-start">
      {/* Left Column (Sticky Profile Details) */}
      <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
        <div className="bento-card p-6 flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-xl opacity-40"></div>
            <div className={`relative h-28 w-28 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 shadow-xl ${
              data.avatarBorder === 'emerald-glow' ? 'p-[3px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-green-500 animate-pulse' :
              data.avatarBorder === 'aurora' ? 'p-[3px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' :
              data.avatarBorder === 'neon-sunset' ? 'p-[3px] bg-gradient-to-tr from-orange-500 via-rose-500 to-fuchsia-600 shadow-[0_0_15px_rgba(244,63,94,0.4)]' :
              data.avatarBorder === 'cyberpunk' ? 'p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' :
              'border-2 border-white/20'
            }`}>
              <div className="h-full w-full rounded-full overflow-hidden bg-zinc-950">
                <img src={profile} alt={handle} className="h-full w-full object-cover" />
              </div>
            </div>
            {data.statusGlow && (
              <span className={`absolute bottom-0 right-0 h-4.5 w-4.5 rounded-full border-[3px] border-[#050505] ${
                data.statusGlow === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' :
                data.statusGlow === 'busy' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' :
                'bg-zinc-550'
              }`} />
            )}
          </div>
          <h1 className="text-2xl font-black mb-1">@{handle}</h1>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${colors.subtext}`}>{profession || "Creator"}</p>
          <p className={`text-xs leading-relaxed ${colors.subtext} mb-4 px-2`}>{data.script}</p>
          
          <div className="w-full flex items-center gap-2 mb-4 text-[10px] font-black tracking-widest uppercase">
            <button onClick={openFollowers} className="flex-1 p-2 rounded-xl bg-black/5 dark:bg-white/5 cursor-pointer hover:bg-indigo-500/10 border-0 text-inherit">
              <span className="block text-sm font-black">{followCount.follower}</span>
              <span className="opacity-60 text-[8px]">Followers</span>
            </button>
            <button onClick={openFollowing} className="flex-1 p-2 rounded-xl bg-black/5 dark:bg-white/5 cursor-pointer hover:bg-indigo-500/10 border-0 text-inherit">
              <span className="block text-sm font-black">{followCount.following}</span>
              <span className="opacity-60 text-[8px]">Following</span>
            </button>
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-black/5 dark:bg-white/5 text-[9px] font-black uppercase tracking-wider">
              <MapPin size={12} />
              <span>{location || "Remote"}</span>
            </div>

            {targetUserId == null ? null : targetUserId !== user?._id ? (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`w-full py-3.25 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
                  isFollowing ? "bg-white/10 text-white" : "custom-accent-btn cursor-pointer"
                }`}
              >
                {isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
                {isFollowing ? "Following" : "Follow"}
              </button>
            ) : (
              <button
                onClick={() => router.push("/Dashboard/editProfile")}
                className="w-full py-3.25 rounded-2xl font-black uppercase tracking-widest text-xs transition-all custom-accent-btn cursor-pointer"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Social Bar */}
        <div className="bento-card p-3">
          <div className="flex items-center justify-center gap-3">
            {[FiGithub, FiInstagram, FiLinkedin, FiYoutube].map((Icon, idx) => (
              <button key={idx} className={`p-2.5 rounded-xl transition-all border-0 cursor-pointer ${theme === 'dark' ? 'text-zinc-500 bg-white/5 hover:text-white' : 'text-gray-500 bg-black/5 hover:text-black'}`}>
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (Dynamic Content Panels) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bento-card p-1.5 flex gap-1.5 w-full rounded-full">
          {['links', 'ai', 'posts'].map((t) => {
            if (t === 'ai' && !data?.aiConfig?.aiEnabled) return null;
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-grow py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border-0 cursor-pointer ${
                  activeTab === t
                    ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white')
                    : (theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black')
                }`}
              >
                {t === 'links' ? 'My Links' : t === 'ai' ? 'AI Twin' : 'Posts'}
              </button>
            );
          })}
        </div>

        <div className="transition-all duration-300">
          {activeTab === 'links' ? (
            <div className="space-y-3">
              {links?.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  className="bento-card p-4.5 flex items-center group w-full"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                    theme === 'dark' ? 'bg-white/10 text-white group-hover:scale-105' : 'bg-black/5 text-black group-hover:scale-105'
                  }`}>
                    <Globe size={18} />
                  </div>
                  <div className="ml-4 flex-1 overflow-hidden text-left">
                    <h3 className="text-sm font-bold truncate mb-0.5">{item.linktext}</h3>
                    <p className={`text-[10px] truncate ${colors.subtext}`}>{item.link}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    theme === 'dark' ? 'bg-white/5 group-hover:bg-white group-hover:text-black' : 'bg-black/5 group-hover:bg-black group-hover:text-white'
                  }`}>
                    <ExternalLink size={12} />
                  </div>
                </a>
              ))}
            </div>
          ) : activeTab === 'ai' ? (
            renderAiTab()
          ) : (
            renderPostsTab()
          )}
        </div>
      </div>
    </div>
  );

  const renderMinimalLayout = () => (
    <div className="max-w-md mx-auto animate-enter text-center">
      <div className="bento-card p-6 border shadow-2xl relative">
        <div className="relative mb-5 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-lg"></div>
            <div className={`relative h-24 w-24 rounded-full overflow-hidden border-2 border-white/20 shadow-md ${
              data.avatarBorder === 'emerald-glow' ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-955 animate-pulse' :
              data.avatarBorder === 'aurora' ? 'ring-2 ring-purple-500 ring-offset-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : ''
            }`}>
              <img src={profile} alt={handle} className="h-full w-full object-cover" />
            </div>
            {data.statusGlow && (
              <span className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-zinc-950 ${
                data.statusGlow === 'online' ? 'bg-emerald-500' : 'bg-zinc-500'
              }`} />
            )}
          </div>
        </div>

        <h1 className="text-2xl font-black">@{handle}</h1>
        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 opacity-70 ${colors.subtext}`}>{profession || "Creator"}</p>
        
        {location && (
          <p className="text-[9px] uppercase tracking-widest opacity-60 mt-2.5 flex items-center justify-center gap-1">
            <MapPin size={10} /> {location}
          </p>
        )}

        <p className="text-xs leading-relaxed opacity-80 max-w-xs mx-auto mt-4 mb-6">{data.script}</p>

        {/* Links stack directly inside this card */}
        <div className="w-full space-y-2.5 mb-6">
          {links?.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              style={{ borderRadius: '999px' }}
              className="w-full py-3 px-5 border flex items-center justify-between group transition-all duration-300 hover:scale-[1.01] bg-white/5 hover:bg-white/10"
            >
              <span className="text-xs font-bold truncate pr-3">{item.linktext}</span>
              <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
            </a>
          ))}
        </div>

        {/* Minimal switcher for tabs */}
        <div className="flex gap-2 justify-center border-t border-inherit pt-4 mt-6">
          {data?.aiConfig?.aiEnabled && (
            <button
              onClick={() => setActiveTab(activeTab === 'ai' ? 'links' : 'ai')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all border-0 cursor-pointer ${
                activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <Sparkles size={11} /> AI Twin
            </button>
          )}
          <button
            onClick={() => setActiveTab(activeTab === 'posts' ? 'links' : 'posts')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all border-0 cursor-pointer ${
              activeTab === 'posts' ? 'bg-indigo-600 text-white' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <Brain size={11} /> Feed
          </button>
        </div>

        {/* Slide-out Panel for AI/Posts inside the card */}
        {activeTab !== 'links' && (
          <div className="mt-6 pt-5 border-t border-inherit text-left animate-in slide-in-from-top duration-300">
            {activeTab === 'ai' ? renderAiTab() : renderPostsTab()}
          </div>
        )}
      </div>
    </div>
  );

  const renderBentoLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-enter">
      {/* 1. Main Profile Card (Spans 5 cols, 2 rows) */}
      <div className="bento-card col-span-1 md:col-span-5 md:row-span-2 p-8 flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-xl opacity-40"></div>
          <div className={`relative h-32 w-32 md:h-40 md:w-40 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 shadow-2xl ${
            data.avatarBorder === 'emerald-glow' ? 'p-[4px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-green-500 animate-pulse' :
            data.avatarBorder === 'aurora' ? 'p-[4px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]' :
            data.avatarBorder === 'neon-sunset' ? 'p-[4px] bg-gradient-to-tr from-orange-500 via-rose-500 to-fuchsia-600 shadow-[0_0_20px_rgba(244,63,94,0.4)]' :
            data.avatarBorder === 'cyberpunk' ? 'p-[4px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-[0_0_20px_rgba(236,72,153,0.4)]' :
            'border-4 border-white/20'
          }`}>
            <div className="h-full w-full rounded-full overflow-hidden bg-zinc-950">
              <img
                src={profile}
                alt={handle}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          {data.statusGlow && (
            <span className={`absolute bottom-1 right-1 h-5.5 w-5.5 rounded-full border-[3px] border-[#050505] transition-all z-20 ${
              data.statusGlow === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' :
              data.statusGlow === 'busy' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' :
              data.statusGlow === 'away' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' :
              'bg-zinc-500'
            }`} />
          )}
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-2 flex items-center justify-center gap-1.5">
          @{handle}
          <CheckCircle size={18} className="text-blue-500 shrink-0" fill="currentColor" />
        </h1>
        <p className={`text-sm font-medium px-4 max-w-sm ${colors.subtext}`}>
          {profession ? profession : "Digital Creator"}
        </p>
      </div>

      {/* 2. Stats Card (Spans 7 cols) */}
      <div className="bento-card col-span-1 md:col-span-7 p-6 flex items-center justify-around">
        <button onClick={openFollowers} className="flex flex-col items-center hover:scale-105 transition-transform bg-transparent border-0 cursor-pointer text-inherit">
          <span className="text-3xl md:text-4xl font-black">{followCount.follower.toLocaleString()}</span>
          <span className={`text-xs uppercase tracking-widest font-bold mt-1 ${colors.subtext}`}>Followers</span>
        </button>
        <div className={`w-px h-16 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`}></div>
        <button onClick={openFollowing} className="flex flex-col items-center hover:scale-105 transition-transform bg-transparent border-0 cursor-pointer text-inherit">
          <span className="text-3xl md:text-4xl font-black">{followCount.following}</span>
          <span className={`text-xs uppercase tracking-widest font-bold mt-1 ${colors.subtext}`}>Following</span>
        </button>
      </div>

      {/* 3. Actions / Location Card (Spans 7 cols) */}
      <div className="bento-card col-span-1 md:col-span-7 p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-black/5 dark:bg-white/5">
          <MapPin size={18} className={theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'} />
          <span className="text-sm font-bold uppercase tracking-wider">{location ? location : "Remote"}</span>
        </div>
        
        <div className="flex-1 w-full">
          {targetUserId == null ? null : targetUserId !== user?._id ? (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
                isFollowing
                  ? theme === "dark" ? "bg-white/10 text-white" : "bg-black/10 text-black"
                  : "custom-accent-btn cursor-pointer"
              }`}
            >
              {followLoading ? <Loader2 size={16} className="animate-spin" /> : isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
              {isFollowing ? "Following" : "Follow"}
            </button>
          ) : (
            <button
              onClick={() => router.push("/Dashboard/editProfile")}
              className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all custom-accent-btn cursor-pointer"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* 4. Social Icons Grid */}
      <div className="bento-card col-span-1 md:col-span-12 p-4">
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {[
            { Icon: FiGithub, color: 'hover:text-gray-900 dark:hover:text-white', bg: 'hover:bg-gray-200 dark:hover:bg-zinc-800' },
            { Icon: FiInstagram, color: 'hover:text-pink-500', bg: 'hover:bg-pink-50 dark:hover:bg-pink-500/10' },
            { Icon: FiLinkedin, color: 'hover:text-blue-600', bg: 'hover:bg-blue-50 dark:hover:bg-blue-500/10' },
            { Icon: FiYoutube, color: 'hover:text-red-500', bg: 'hover:bg-red-50 dark:hover:bg-red-500/10' }
          ].map(({ Icon, color, bg }, idx) => (
            <button key={idx} className={`p-4 rounded-2xl transition-all duration-300 ${color} ${bg} ${theme === 'dark' ? 'text-zinc-500 bg-white/5' : 'text-gray-500 bg-black/5'} border-0 cursor-pointer`}>
              <Icon size={24} />
            </button>
          ))}
        </div>
      </div>
      
      {/* 5. Dynamic Tabs for Links / AI / Posts */}
      <div className="col-span-full mt-8">
        <div className="flex justify-center mb-8">
          <div className="bento-card p-2 flex gap-2 w-full max-w-sm rounded-full">
            <button
              onClick={() => setActiveTab('links')}
              className={`flex-1 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'links'
                  ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white')
                  : (theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black')
              }`}
            >
              My Links
            </button>
            {data?.aiConfig?.aiEnabled && (
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'ai'
                    ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white')
                    : (theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black')
                }`}
              >
                AI Twin
              </button>
            )}
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'posts'
                  ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white')
                  : (theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-black')
              }`}
            >
              Posts
            </button>
          </div>
        </div>

        <div className="min-h-[300px] transition-all duration-300">
          {activeTab === 'links' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links?.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  className={`bento-card p-6 flex items-center group ${idx % 3 === 0 ? 'md:col-span-2 link-card-bg' : ''}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    theme === 'dark' ? 'bg-white/10 text-white group-hover:scale-110' : 'bg-black/5 text-black group-hover:scale-110'
                  }`}>
                    <Globe size={24} />
                  </div>
                  <div className="ml-6 flex-1 overflow-hidden text-left">
                    <h3 className="text-lg font-bold tracking-tight mb-1">{item.linktext}</h3>
                    <p className={`text-xs truncate tracking-wide ${colors.subtext}`}>
                      {item.link}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    theme === 'dark' ? 'bg-white/5 group-hover:bg-white group-hover:text-black' : 'bg-black/5 group-hover:bg-black group-hover:text-white'
                  }`}>
                    <ExternalLink size={16} />
                  </div>
                </a>
              ))}
            </div>
          ) : activeTab === 'ai' ? (
            renderAiTab()
          ) : (
            renderPostsTab()
          )}
        </div>
      </div>
    </div>
  );

  const layoutStyle = data?.themeConfig?.layoutStyle || "bento";

  return (
    <>
      <Navbar />
      <div 
        style={{ fontFamily: data?.themeConfig?.font || "Inter, system-ui, sans-serif" }}
        className={`min-h-screen w-full transition-colors duration-500 pb-20 pt-12 overflow-x-hidden ${colors.bg} ${colors.text}`}
      >
        <PageStyles theme={theme} themeConfig={data?.themeConfig} />

        {/* Ad-Ready Background Glows */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-40 transition-colors duration-700 ${theme === 'dark' ? 'bg-indigo-600/20' : 'bg-blue-400/20'} translate-x-1/3 -translate-y-1/3`}></div>
          <div className={`absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-40 transition-colors duration-700 ${theme === 'dark' ? 'bg-emerald-600/20' : 'bg-teal-400/20'} -translate-x-1/3 translate-y-1/3`}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
          {layoutStyle === 'classic' && renderClassicLayout()}
          {layoutStyle === 'split' && renderSplitLayout()}
          {layoutStyle === 'minimal' && renderMinimalLayout()}
          {layoutStyle === 'bento' && renderBentoLayout()}
        </div>

        <FollowModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          initialTab={modalState.tab}
          data={followData}
          theme={theme}
        />
      </div>
    </>
  );
}
