"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Link as LinkIcon, Brain, Wrench, Share2, ExternalLink,
  CheckCircle, Moon, Sun, MapPin, Briefcase, Search,
  Loader2, User, ArrowRight, Lock, Sparkles, Users, UserPlus, UserCheck,
  Edit
} from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';
import Modal from "@/Components/Modal";
import { useAuth } from "@/context/Authenticate";
import { set } from "mongoose";

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
  const [followerCount, setFollowerCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const getUserId = async () => {
      try {
        const res = await fetch(`/api/getuser?userid=${data?._id}`);
        const json = await res.json();
        if (res.ok) {
          setTargetUserId(json.userId);
          setFollowerCount(json.follower.length);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
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

        const res = await fetch(`/api/links/${handle}`);
        if (!res.ok) throw new Error("User not found");

        const json = await res.json();
        console.log("handlepage:,", json)

        if (json.result) {
          setData(json.result);;
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
      console.log("Checking follow status for user:", data);
      const res = await fetch(`/api/isFollowing?followerId=${user?._id}&followingId=${targetUserId}`);

      const json = await res.json();
      setIsFollowing(json.isFollowing);
    }

    if (user?._id) checkFollow();
  }, [user?._id,targetUserId]);

console.log(isFollowing,"isFollowing");
  const handleFollow = async () => {
    if (!user?._id) {
      toast.error("Please login to follow");
      return;
    }

    setFollowLoading(true);

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserId: user._id,   // logged-in user
          targetUserId: targetUserId     // profile owner
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error(json.error);
        return;
      }

      // Update follow state
      setIsFollowing(json.isFollowing);
      setFollowerCount(json.followersCount);

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
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Not found</h2>
          {/* <p className="text-gray-500 mb-6">This profile doesn't exist or has been removed</p> */}
          <Link href="/" className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all inline-flex items-center gap-2">
            <ArrowRight size={16} className="rotate-180" /> Go Home
          </Link>
        </div>
      </div>
    );
  }

  const { handle, profile, script, links = [], mindset, skillsoff = [], skillsseek = [], location, profession } = data;

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${colors.bg} font-sans pb-20`}>
      <PageStyles theme={theme} />

      {/* Simplified Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {theme === 'dark' ? (
          <>
            <div className="absolute w-[500px] h-[500px] bg-teal-500/5 top-0 right-0 rounded-full blur-[100px]"></div>
            <div className="absolute w-[500px] h-[500px] bg-purple-500/5 bottom-0 left-0 rounded-full blur-[100px]"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50/30 via-white to-purple-50/30"></div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-24">

        {/* Profile Header - Horizontal Layout */}
        <div className={`glass-card rounded-3xl p-8 mb-6 animate-enter`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <div className={`absolute -inset-1 rounded-full blur-md opacity-50 ${theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-purple-500' : 'bg-gradient-to-r from-teal-400 to-purple-400'}`}></div>
              <img
                src={profile || `https://placehold.co/200x200/222/fff?text=${handle?.[0]?.toUpperCase() || '@'}`}
                alt={`@${handle}`}
                className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 ${theme === 'dark' ? 'border-[#0a0a0a]' : 'border-white'} shadow-xl`}
              />
              <div className={`absolute bottom-1 right-1 ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'} text-white p-1.5 rounded-full border-3 ${theme === 'dark' ? 'border-[#0a0a0a]' : 'border-white'}`}>
                <CheckCircle size={14} fill="currentColor" />
              </div>
              <div className="fixed top-4 right-6">
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-medium ${theme === 'dark' ? 'bg-[#1a1a1a] hover:bg-[#222] text-gray-400 hover:text-white' : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 shadow-sm border border-gray-200'}`}
                >
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
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${colors.text}`}>@{handle}</h1>
              {script && <p className={`text-sm sm:text-base mb-4 ${colors.subtext} max-w-lg`}>{script}</p>}

              {/* Location & Profession Pills */}
              <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
                {location && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-[#1a1a1a] text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                    <MapPin size={12} className="text-teal-500" /> {location}
                  </span>
                )}
                {profession && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-[#1a1a1a] text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                    <Briefcase size={12} className="text-purple-500" /> {profession}
                  </span>
                )}
              </div>

              {/* Stats and Follow Button Row */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-start">
                {/* Stats */}
                <div className="flex gap-6">
                  <div className="stat-badge text-center">
                    <div className={`text-2xl font-bold ${colors.text}`}>{followerCount.toLocaleString()}</div>
                    <div className={`text-xs ${colors.mutedText}`}>Followers</div>
                  </div>
                  <div className="stat-badge text-center">
                    <div className={`text-2xl font-bold ${colors.text}`}>{links.length}</div>
                    <div className={`text-xs ${colors.mutedText}`}>Links</div>
                  </div>
                </div>

                {/* Follow Button */}
                {user?._id && user._id !== targetUserId && (
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${isFollowing
                        ? theme === 'dark'
                          ? 'bg-[#1a1a1a] text-white hover:bg-[#222] border border-[#333]'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200'
                        : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-600 hover:to-emerald-700 shadow-md hover:shadow-lg'
                      } ${followLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {followLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isFollowing ? (
                      <>
                        <UserCheck size={16} />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-enter" style={{ animationDelay: '100ms' }}>

          {/* Left Column - Links */}
          <div className="lg:col-span-2 space-y-4">
            {links.length > 0 && (
              <>
                <h2 className={`text-lg font-bold mb-4 ${colors.text} flex items-center gap-2`}>
                  <LinkIcon size={18} className="text-teal-500" />
                  Quick Links
                </h2>
                {links.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`link-card glass-card group flex items-center justify-between p-4 rounded-2xl`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-teal-500/10 to-purple-500/10' : 'bg-gradient-to-br from-teal-50 to-purple-50'}`}>
                        <LinkIcon size={18} className="text-teal-500" />
                      </div>
                      <span className={`font-semibold text-sm truncate ${colors.text}`}>{item.linktext}</span>
                    </div>
                    <ExternalLink size={16} className={`${colors.subtext} group-hover:text-teal-500 transition-colors flex-shrink-0 ml-2`} />
                  </a>
                ))}
              </>
            )}
          </div>

          {/* Right Column - Mindset & Skills */}
          <div className="space-y-4">

            {/* Mindset Card */}
            {mindset && (
              <div className={`glass-card p-6 rounded-2xl`}>
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={18} className="text-teal-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-500">Mindset</span>
                </div>
                <p className={`text-sm leading-relaxed italic ${colors.text}`}>"{mindset}"</p>
              </div>
            )}

            {/* Skills Card */}
            {(skillsoff.length > 0 || skillsseek.length > 0) && (
              <div className={`glass-card p-6 rounded-2xl space-y-5`}>
                {skillsoff.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Wrench size={16} className="text-purple-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-500">Offering</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillsoff.map((skill, i) => (
                        <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${theme === 'dark' ? 'bg-[#1a1a1a] text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skillsseek.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Search size={16} className="text-orange-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-500">Seeking</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillsseek.map((skill, i) => (
                        <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${theme === 'dark' ? 'bg-[#1a1a1a] text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CTA Card */}
        <div className={`glass-card rounded-2xl p-6 mt-6 animate-enter`} style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className={`text-lg font-bold mb-1 ${colors.text}`}>Join DapLink Today</h3>
              <p className={`text-sm ${colors.subtext}`}>Create your professional profile in minutes</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link href="/Explorepeoples" className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${theme === 'dark' ? 'bg-[#1a1a1a] text-gray-300 hover:bg-[#222] hover:text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`}>
                <User size={16} /> Explore
              </Link>
              <button onClick={() => setModalOpen(true)} className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all text-sm flex items-center gap-2 shadow-md hover:shadow-lg">
                Jobs <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} theme={theme}>
          <div className={`p-8 w-full text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-purple-500"></div>
            <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${theme === 'dark' ? 'bg-teal-500/10' : 'bg-teal-50'}`}>
              <Lock size={24} className="text-teal-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Unlock Premium Features</h3>
            <p className={`mb-8 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Access exclusive job listings and connect with top recruiters
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/Pricing" className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all">
                View Pricing
              </Link>
              <button onClick={() => setModalOpen(false)} className={`text-sm py-2 ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-800'}`}>
                Maybe later
              </button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
}