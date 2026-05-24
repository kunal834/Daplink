"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Link as LinkIcon, Brain, Wrench, Share2, ExternalLink,
  CheckCircle, Moon, Sun, MapPin, Briefcase, Search,
  Loader2, User, ArrowRight, Lock, Sparkles, Users, UserPlus, UserCheck,
  Edit, Heart, MessageSquare, Globe,
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

const PageStyles = ({ theme }) => (
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
      background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.7)'};
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
      border-radius: 32px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      position: relative;
    }

    .bento-card:hover {
      transform: translateY(-4px);
      box-shadow: ${theme === 'dark' ? '0 20px 40px rgba(0, 0, 0, 0.4)' : '0 20px 40px rgba(0, 0, 0, 0.08)'};
      border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'};
    }

    .link-card-bg {
      background: linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(139, 92, 246, 0.1));
    }
  `}</style>
);

export default function ProfilePage() {
  const { theme } = useTheme();
  const router = useRouter();
  const routeParams = useParams();
  const queryClient = useQueryClient();
  const posthog = usePostHog();
  const [copied, setCopied] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, tab: 'followers' });
  const [activeTab, setActiveTab] = useState('links');
  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  const { user } = useAuth();
  const routeHandle = Array.isArray(routeParams?.handle)
    ? routeParams.handle[0]
    : routeParams?.handle;

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

  return (
    <>
      <Navbar />
      <div className={`min-h-screen w-full transition-colors duration-500 font-sans pb-20 pt-12 overflow-x-hidden ${colors.bg} ${colors.text}`}>
        <PageStyles theme={theme} />

        {/* Ad-Ready Background Glows */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-40 transition-colors duration-700 ${theme === 'dark' ? 'bg-indigo-600/20' : 'bg-blue-400/20'} translate-x-1/3 -translate-y-1/3`}></div>
          <div className={`absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-40 transition-colors duration-700 ${theme === 'dark' ? 'bg-emerald-600/20' : 'bg-teal-400/20'} -translate-x-1/3 translate-y-1/3`}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
          
          {/* BENTO GRID LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-enter">
            
            {/* 1. Main Profile Card (Spans 5 cols, 2 rows) */}
            <div className="bento-card col-span-1 md:col-span-5 md:row-span-2 p-8 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-xl opacity-50"></div>
                <img
                  src={profile}
                  alt={handle}
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-transparent bg-clip-border shadow-2xl"
                />
                <div className="absolute bottom-2 right-2 bg-blue-500 p-1.5 rounded-full border-[3px] border-[#050505]">
                  <CheckCircle size={16} className="text-white" fill="currentColor" />
                </div>
              </div>
              <h1 className="text-3xl font-black tracking-tight mb-2">@{handle}</h1>
              <p className={`text-sm font-medium px-4 max-w-sm ${colors.subtext}`}>
                {profession ? profession : "Digital Creator"}
              </p>
            </div>

            {/* 2. Stats Card (Spans 7 cols) */}
            <div className="bento-card col-span-1 md:col-span-7 p-6 flex items-center justify-around">
              <button onClick={openFollowers} className="flex flex-col items-center hover:scale-105 transition-transform">
                <span className="text-3xl md:text-4xl font-black">{followCount.follower.toLocaleString()}</span>
                <span className={`text-xs uppercase tracking-widest font-bold mt-1 ${colors.subtext}`}>Followers</span>
              </button>
              <div className={`w-px h-16 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`}></div>
              <button onClick={openFollowing} className="flex flex-col items-center hover:scale-105 transition-transform">
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
                        : theme === "dark" ? "bg-white text-black hover:bg-zinc-200" : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {followLoading ? <Loader2 size={16} className="animate-spin" /> : isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/edit-profile")}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                      theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                    }`}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* 4. Social Icons Grid (Spans 12 cols, or integrated into bento) */}
            <div className="bento-card col-span-1 md:col-span-12 p-4">
              <div className="flex items-center justify-center gap-4 md:gap-8">
                {[
                  { Icon: FiGithub, color: 'hover:text-gray-900 dark:hover:text-white', bg: 'hover:bg-gray-200 dark:hover:bg-zinc-800' },
                  { Icon: FiInstagram, color: 'hover:text-pink-500', bg: 'hover:bg-pink-50 dark:hover:bg-pink-500/10' },
                  { Icon: FiLinkedin, color: 'hover:text-blue-600', bg: 'hover:bg-blue-50 dark:hover:bg-blue-500/10' },
                  { Icon: FiYoutube, color: 'hover:text-red-500', bg: 'hover:bg-red-50 dark:hover:bg-red-500/10' }
                ].map(({ Icon, color, bg }, idx) => (
                  <button key={idx} className={`p-4 rounded-2xl transition-all duration-300 ${color} ${bg} ${theme === 'dark' ? 'text-zinc-500 bg-white/5' : 'text-gray-500 bg-black/5'}`}>
                    <Icon size={24} />
                  </button>
                ))}
              </div>
            </div>
            
          </div>

          {/* Tab Switcher */}
          <div className="mt-12 mb-8 flex justify-center">
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

          {/* Tab Content Area */}
          <div className="min-h-[300px] animate-enter" style={{ animationDelay: '0.2s' }}>
            {activeTab === 'links' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className={`bento-card p-6 flex items-center group ${idx % 3 === 0 ? 'md:col-span-2 link-card-bg' : ''}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      theme === 'dark' ? 'bg-white/10 text-white group-hover:scale-110' : 'bg-black/5 text-black group-hover:scale-110'
                    }`}>
                      <Globe size={24} />
                    </div>
                    <div className="ml-6 flex-1 overflow-hidden">
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
