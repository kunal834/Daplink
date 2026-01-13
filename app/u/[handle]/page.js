"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Link as LinkIcon, Brain, Wrench, Share2, ExternalLink,
  CheckCircle, Moon, Sun, MapPin, Briefcase, Search,
  Loader2, User, ArrowRight, Lock, Sparkles, Users, UserPlus, UserCheck,
  Edit,
  Heart,
  MessageSquare
} from 'lucide-react';

import { useTheme } from '../../../context/ThemeContext';
import Modal from "@/Components/Modal";
import { useAuth } from "@/context/Authenticate";
import { set } from "mongoose";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import FollowModal from "@/Components/modals/followModals";
import { FiGithub, FiInstagram, FiLinkedin, FiYoutube } from "react-icons/fi";

/* -------------------------------------------------------------------------- */
/* STYLES & ANIMATIONS                                                        */
/* -------------------------------------------------------------------------- */
const PageStyles = ({ theme }) => (
  <style>{`
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    
    .animate-enter {
      animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
    }
    
    .animate-gradient {
      background-size: 200% 200%;
      animation: gradient-shift 8s ease infinite;
    }
    
    .animate-float { 
      animation: float 6s ease-in-out infinite; 
    }

    .glass-card {
      background: ${theme === 'dark'
      ? 'rgba(17, 17, 17, 0.7)'
      : 'rgba(255, 255, 255, 0.8)'};
      backdrop-filter: blur(20px);
      border: 1px solid ${theme === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.05)'};
    }
    
    .link-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .link-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 3px;
      background: linear-gradient(180deg, #14b8a6, #8b5cf6);
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }
    
    .link-card:hover::before {
      transform: scaleY(1);
    }
    
    .link-card:hover {
      transform: translateY(-2px);
      box-shadow: ${theme === 'dark'
      ? '0 20px 40px rgba(20, 184, 166, 0.15)'
      : '0 20px 40px rgba(0, 0, 0, 0.08)'};
    }
    
    .stat-badge {
      transition: transform 0.2s ease;
    }
    
    .stat-badge:hover {
      transform: scale(1.05);
    }
  `}</style>
);


export default function ProfilePage({ params }) {

  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCount, setFollowCount] = useState({
    follower: 0,
    following: 0
  });
  const [followLoading, setFollowLoading] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, tab: 'followers' });
  const [activeTab, setActiveTab] = useState('links');

  const openFollowers = () => setModalState({ isOpen: true, tab: 'followers' });
  const openFollowing = () => setModalState({ isOpen: true, tab: 'following' });
  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));
  const [followData, setFollowData] = useState({
    followers: [],
    following: []
  });

  const { user } = useAuth();

  useEffect(() => {
    const getUserId = async () => {
      try {
        const res = await axios.get(`/api/getuser?daplinkID=${data?._id}`);
        const json = await res.data;

        console.log(json, res)
        if (res.data) {
          setTargetUserId(json.userId);
          setFollowCount({
            follower: json.follower.length,
            following: json.following.length
          });
        }
      } catch (error) {
        // console.error("Error fetching user ID:", error);
      }
    };

    if (data && data._id) {
      getUserId();
    }
  }, [data]);


  // Dynamic Colors
  const colors = {
    bg: theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    subtext: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    mutedText: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
  };

  useEffect(() => {
    const getHandle = async () => {
      try {
        const resolvedParams = await params;
        const handle = resolvedParams?.handle;

        if (!handle) return;

        const res = await axios.get(`/api/links/${handle}`);

        // console.log("handlepage:", res.data);

        if (res.data?.result) {
          setData(res.data.result);
        } else {
          setError(true);
        }

      } catch (err) {
        console.error("Error loading profile:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getHandle();
  }, [params]);


  useEffect(() => {
    async function checkFollow() {
      // console.log("Checking follow status for user:", data);
      const res = await axios.get(`/api/isFollowing?followerId=${user?._id}&followingId=${targetUserId}`);

      const json = await res.data;
      // console.log("Follow status response:", json);
      setIsFollowing(json.isFollowing);
    }

    if (user?._id) checkFollow();
  }, [user?._id, targetUserId]);

  // console.log(isFollowing, "isFollowing");
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

      setIsFollowing(json.isFollowing);

      // --- FIX STARTS HERE ---
      setFollowCount(prev => ({
        ...prev, // This keeps the existing 'following' count
        follower: json.followersCount // This updates only the 'follower' count
      }));
      // --- FIX ENDS HERE ---

    } catch (err) {
      console.error("Error following user:", err);
      toast.error(err.message || "Server error");
    } finally {
      setFollowLoading(false);
    }
  };
  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    if (modalState.isOpen && targetUserId) {
      fetchFollowData(targetUserId);
    }
  }, [modalState.isOpen, targetUserId]);

  // console.log(modalState.isOpen)

  const fetchFollowData = async (userId) => {
    try {
      // setLoading(true);
      // console.log("fetchStart")
      const res = await axios.get(`/api/getFollow/${userId}`, {
        cache: "no-store"
      });

      if (!res.data) {
        throw new Error("Failed to fetch follow data");
      }

      const data = await res.data;

      setFollowData({
        followers: data.followers || [],
        following: data.following || []
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };


  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${colors.bg}`}>
        <PageStyles theme={theme} />
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className={`h-20 w-20 rounded-full ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-200'} animate-pulse`}></div>
            <div className="absolute inset-0 rounded-full border-4 border-teal-500/30 border-t-teal-500 animate-spin"></div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="animate-spin" size={16} /> Loading Profile...
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${colors.bg} ${colors.text}`}>
        <PageStyles theme={theme} />
        <div className="text-center">
          <div className="text-6xl mb-4">User</div>
          <h2 className="text-2xl font-bold mb-2">Not found</h2>
          {/* <p className="text-gray-500 mb-6">This profile doesn't exist or has been removed</p> */}
          <Link href="/" className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all inline-flex items-center gap-2">
            <ArrowRight size={16} className="rotate-180" /> Go Home
          </Link>
        </div>
      </div>
    );
  }

  const { handle, profile, script, links = [], mindset, location, profession } = data;

  return (
    <><Navbar />
      <div className={`min-h-screen w-full transition-colors duration-500 selection:bg-blue-500 selection:text-white font-sans pb-10 overflow-x-hidden ${theme === 'dark' ? 'bg-[#030303] text-white' : 'bg-gray-50 text-gray-900'
        }`}>
        <style>{`
        .glass { 
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.7)'}; 
          backdrop-filter: blur(20px); 
          border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}; 
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${theme === 'dark' ? '#333' : '#ccc'}; border-radius: 10px; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade { animation: fade-up 0.6s ease forwards; }
      `}</style>

        {/* Dynamic Background Glows */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-0 left-0 w-[80vw] h-[80vw] rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3 opacity-50 transition-colors duration-700 ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/5'}`}></div>
          <div className={`absolute bottom-0 right-0 w-[80vw] h-[80vw] rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 opacity-50 transition-colors duration-700 ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-500/5'}`}></div>
        </div>

        {/* Top Header Actions (Theme & Share) */}
        {/* <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={copyToClipboard}
            className={`w-10 h-10 glass rounded-2xl flex items-center justify-center transition-all active:scale-90 hover:scale-105 shadow-xl`}
            title="Share Profile"
          >
            <Share2 size={16} className={copied ? "text-green-500" : (theme === 'dark' ? "text-zinc-400" : "text-gray-600")} />
          </button>
            {copied ? (
              <>
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Share2 size={16} />
                <span>Share</span>
              </>
            )}
          </button>
        </div> */}

        <div className="relative z-10 max-w-2xl mx-auto px-6 pt-12 space-y-6">

          {/* Profile Header */}
          <header className="text-center animate-fade">
            <div className="relative inline-block mb-4">
              <div className={`absolute -inset-2 rounded-full opacity-30 blur-2xl transition-colors duration-700 ${theme === 'dark' ? 'bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500' : 'bg-gradient-to-tr from-blue-400 via-indigo-400 to-teal-400'
                }`}></div>

              <img
                src={profile}
                alt={handle}
                className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 transition-colors duration-500 ${theme === 'dark' ? 'border-black shadow-2xl' : 'border-white shadow-lg'}`}
              />

              <div className={`absolute bottom-0 right-0 p-1 rounded-full border-2 transition-colors duration-500 ${theme === 'dark' ? 'bg-blue-500 border-[#030303]' : 'bg-blue-500 border-white'
                }`}>
                <CheckCircle size={12} className="text-white" fill="currentColor" />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">@{data?.handle}</h1>
            <p className={`text-xs md:text-sm font-medium px-4 max-w-sm mx-auto leading-relaxed transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>
              {profession ? profession : "Content Creator"}
            </p>

            <div className={`flex items-center justify-center gap-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-3 transition-colors duration-500 ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-400'
              }`}>
              <MapPin size={10} />
              {/* {console.log("location", data)} */}
              <span>{location ? location : "Remote"}</span>
            </div>
          </header>

          {/* Stats & Actions */}
          <section className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setModalState({ isOpen: true, tab: 'followers' })}
                className="flex-1 glass rounded-[24px] py-3 px-4 flex flex-col items-center hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                <span className="text-base md:text-lg font-bold">{followCount.follower.toLocaleString()}</span>
                <span className={`text-[7px] md:text-[8px] uppercase tracking-[0.1em] font-black transition-colors ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-400'}`}>Followers</span>
              </button>
              <button
                onClick={() => setModalState({ isOpen: true, tab: 'following' })}
                className="flex-1 glass rounded-[24px] py-3 px-4 flex flex-col items-center hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                <span className="text-base md:text-lg font-bold">{followCount.following}</span>
                <span className={`text-[7px] md:text-[8px] uppercase tracking-[0.1em] font-black transition-colors ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-400'}`}>Following</span>
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`flex-1 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 hover:scale-110 ${isFollowing
                  ? (theme === 'dark' ? 'bg-zinc-900 border border-zinc-800 text-zinc-500' : 'bg-gray-100 text-gray-400')
                  : (theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-gray-800')
                  } active:scale-95`}
              >
                {followLoading ? <Loader2 size={14} className="animate-spin" /> : isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button
                className="glass flex-1 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 active:scale-95 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <MessageSquare size={14} className={theme === 'dark' ? "text-zinc-400" : "text-gray-600"} />
                <span>Message</span>
              </button>
            </div>
          </section>

          {/* Social Bar - Compact Icons */}
          <section className="grid grid-cols-4 gap-2 max-w-[280px] mx-auto">
            {[
              { Icon: FiGithub, color: 'hover:text-white dark:hover:text-white' },
              { Icon: FiInstagram, color: 'hover:text-pink-500' },
              { Icon: FiLinkedin, color: 'hover:text-blue-500' },
              { Icon: FiYoutube, color: 'hover:text-red-500' }
            ].map(({ Icon, color }, idx) => (
              <button key={idx} className={`glass py-3 rounded-xl flex items-center justify-center transition-all hover:bg-black/5 dark:hover:bg-white/5 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'} ${color}`}>
                <Icon size={16} />
              </button>
            ))}
          </section>

          {/* Tab Switcher - Compact */}
          <nav className="glass rounded-full p-1 flex gap-1 max-w-[320px] mx-auto">
            <button
              onClick={() => setActiveTab('links')}
              className={`flex-1 py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'links'
                ? (theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/5 text-black')
                : (theme === 'dark' ? 'text-zinc-600 hover:text-zinc-400' : 'text-gray-400 hover:text-gray-600')
                }`}
            >
              Links
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'posts'
                ? (theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/5 text-black')
                : (theme === 'dark' ? 'text-zinc-600 hover:text-zinc-400' : 'text-gray-400 hover:text-gray-600')
                }`}
            >
              Posts
            </button>
          </nav>

          {/* Tab Content */}
          <div className="min-h-[300px] animate-fade">
            {activeTab === 'links' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data?.links?.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    className={`block glass p-4 rounded-[24px] flex items-center group transition-all hover:translate-y-[-1px] ${idx === 2 ? 'md:col-span-2' : ''
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-zinc-400 group-hover:text-white' : 'bg-black/5 text-gray-500 group-hover:text-black'
                      }`}>
                      <Globe size={16} />
                    </div>
                    <div className="ml-4 flex-1 overflow-hidden">
                      <h3 className="text-sm font-bold tracking-tight">{item.linktext}</h3>
                      <p className={`text-[10px] truncate tracking-wide ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-400'}`}>
                        {item.link}
                      </p>
                    </div>
                    <ExternalLink size={14} className={`transition-colors ml-2 ${theme === 'dark' ? 'text-zinc-800 group-hover:text-zinc-500' : 'text-gray-200 group-hover:text-gray-400'
                      }`} />
                  </a>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {/* {[...Array(9)].map((_, i) => (
                  <div key={i} className="aspect-square glass rounded-xl overflow-hidden group cursor-pointer relative shadow-sm">
                    <img
                      src={`https://images.unsplash.com/photo-${1550000000000 + i * 1500}?w=400&h=400&fit=crop`}
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      alt="Post"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Heart size={14} className="text-white fill-white mr-1" />
                      <span className="text-[10px] font-bold text-white">128</span>
                    </div>
                  </div>
                ))} */}
                <div className={`col-span-3 md:col-span-4 glass rounded-xl p-6 flex flex-col items-center justify-center text-center ${theme === 'dark' ? 'bg-black/10' : 'bg-white/70'}`}>
                  <Brain size={32} className={theme === 'dark' ? 'text-white/70' : 'text-gray-400'} />
                  <h3 className="mt-4 text-lg font-bold">No Posts Yet</h3>
                </div>
              </div>
            )}
          </div>

          {/* CTA Section - Compact */}
          {/* <div className={`glass rounded-[32px] p-6 md:p-8 flex flex-col items-center text-center gap-4 shadow-2xl transition-all ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-black/5 to-transparent'
            }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
              }`}>
              <Sparkles className="text-blue-500" size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-bold tracking-tight">Claim your handle</h3>
              <p className={`text-[10px] md:text-xs leading-relaxed max-w-[240px] mx-auto ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
                Join 10,000+ designers and developers building their personal brand.
              </p>
            </div>
            <button className={`w-full max-w-xs py-3 rounded-2xl font-bold uppercase tracking-widest text-[9px] active:scale-95 transition-all shadow-xl ${theme === 'dark' ? 'bg-white text-black shadow-white/5' : 'bg-black text-white shadow-black/10'
              }`}>
              Get Started Free
            </button>
          </div> */}

          <footer className="text-center pt-6 border-t border-black/5 dark:border-white/5">
            <p className={`text-[8px] font-bold uppercase tracking-[0.4em] transition-colors ${theme === 'dark' ? 'text-zinc-800' : 'text-gray-300'
              }`}>Developed by Daplink &copy; 2026</p>
          </footer>
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