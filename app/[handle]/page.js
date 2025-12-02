"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Link as LinkIcon, Brain, Wrench, Share2, ExternalLink,
  CheckCircle, Moon, Sun, MapPin, Briefcase, Search,
  Loader2, User, ArrowRight, Lock, Sparkles
} from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';
import Modal from "@/Components/Modal";

/* -------------------------------------------------------------------------- */
/* STYLES & ANIMATIONS                                                        */
/* -------------------------------------------------------------------------- */
const PageStyles = ({ theme }) => (
  <style>{`
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes aurora {
      0% { transform: rotate(0deg) scale(1); opacity: 0.3; }
      50% { transform: rotate(180deg) scale(1.1); opacity: 0.5; }
      100% { transform: rotate(360deg) scale(1); opacity: 0.3; }
    }
    
    .animate-enter {
      animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
    }
    
    .animate-aurora { animation: aurora 25s infinite linear; }

    .glass-panel {
      background: ${theme === 'dark' ? 'rgba(20, 20, 20, 0.6)' : 'rgba(255, 255, 255, 0.7)'};
      backdrop-filter: blur(16px);
      border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.6)'};
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
    
    .link-card {
      transition: all 0.3s ease;
    }
    .link-card:hover {
      transform: translateY(-2px) scale(1.01);
      border-color: ${theme === 'dark' ? 'rgba(20, 184, 166, 0.5)' : 'rgba(20, 184, 166, 0.5)'};
      background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)'};
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

  // Dynamic Colors
  const colors = {
    bg: theme === 'dark' ? 'bg-[#050505]' : 'bg-[#F3F4F6]',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    subtext: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    card: theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200',
    linkHover: theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50',
    badge: theme === 'dark' ? 'bg-[#1A1A1A] text-gray-300 border-[#333]' : 'bg-gray-100 text-gray-700 border-gray-200',
    accentGradient: 'bg-gradient-to-br from-teal-500 to-emerald-600',
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

        if (json.result) {
          setData(json.result);
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
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className={`h-24 w-24 rounded-full ${theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-gray-200'}`}></div>
          <div className={`h-6 w-48 rounded ${theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-gray-200'}`}></div>
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
        <h2 className="text-2xl font-bold mb-2">User not found</h2>
        <Link href="/" className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-600 transition">
          Go Home
        </Link>
      </div>
    );
  }

  const { handle, profile, script, links = [], mindset, skillsoff = [], skillsseek = [], location, profession } = data;

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${colors.bg} font-sans selection:bg-teal-500 selection:text-white pb-24`}>
      <PageStyles theme={theme} />

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-purple-900/20 top-[-10%] right-[-10%] rounded-full blur-[120px] animate-aurora"></div>
        <div className="absolute w-[500px] h-[500px] bg-teal-900/20 bottom-[-10%] left-[-10%] rounded-full blur-[120px] animate-aurora" style={{ animationDelay: '-5s' }}></div>
        {theme === 'light' && <div className="absolute inset-0 bg-white/60 z-[-1]"></div>}
      </div>



      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto pt-32 px-4">
        <div className="flex justify-end mb-6 gap-4">
          <button onClick={copyToClipboard} className={`p-2.5 rounded-full border transition-all flex items-end gap-2 ${theme === 'dark' ? 'bg-[#111] border-[#333] text-white hover:bg-[#222]' : 'bg-white border-gray-200 text-slate-900 hover:bg-gray-50'}`}>
            {copied ? <CheckCircle size={18} className="text-green-500" /> : <Share2 size={20} />}
          </button>
        </div>

        {/* 1. Profile Header */}
        <div className="animate-enter text-center flex flex-col items-center mb-10">
          <div className="relative mb-6 group">
            <div className={`absolute -inset-1 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity duration-500 ${theme === 'dark' ? 'bg-gradient-to-r from-teal-500 to-purple-500' : 'bg-gradient-to-r from-teal-400 to-blue-400'}`}></div>
            <img
              src={profile || `https://placehold.co/200x200/222/fff?text=${handle?.[0]?.toUpperCase() || '@'}`}
              alt={`@${handle}`}
              className={`relative w-32 h-32 rounded-full object-cover border-4 ${theme === 'dark' ? 'border-[#050505]' : 'border-white'}`}
            />
            <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full border-4 border-[#050505]">
              <CheckCircle size={12} fill="currentColor" className="text-white" />
            </div>
          </div>

          <h1 className={`text-3xl font-bold tracking-tight mb-2 ${colors.text}`}>@{handle}</h1>

          {script && <p className={`text-base max-w-md leading-relaxed ${colors.subtext}`}>{script}</p>}

          {/* DYNAMIC LOCATION & PROFESSION */}
          <div className="flex gap-4 mt-4 text-sm text-gray-500 justify-center flex-wrap">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              <MapPin size={14} className="text-teal-500" /> {location || "Remote"}
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              <Briefcase size={14} className="text-purple-500" /> {profession || "Creator"}
            </span>
          </div>
        </div>

        {/* 2. Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 animate-enter delay-100">

          {/* Links Column */}
          {links.length > 0 && (
            <div className="sm:col-span-2 space-y-3">
              {links.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className={`link-card group flex items-center justify-between p-4 rounded-2xl border ${colors.card} ${colors.linkHover}`}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-[#1A1A1A] text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <LinkIcon size={20} />
                    </div>
                    <span className={`font-semibold text-sm sm:text-base truncate ${colors.text}`}>{item.linktext}</span>
                  </div>
                  <ExternalLink size={18} className={`${colors.subtext} group-hover:translate-x-1 transition-transform`} />
                </a>
              ))}
            </div>
          )}

          {/* Mindset Card */}
          {mindset && (
            <div className={`glass-panel p-6 rounded-3xl flex flex-col justify-between min-h-[160px]`}>
              <div className="flex items-center gap-2 mb-4 text-teal-500">
                <Brain size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Mindset</span>
              </div>
              <p className={`text-lg font-medium leading-relaxed italic ${colors.text}`}>"{mindset}"</p>
            </div>
          )}

          {/* Skills Card */}
          {(skillsoff.length > 0 || skillsseek.length > 0) && (
            <div className={`glass-panel p-6 rounded-3xl flex flex-col gap-6 h-full`}>
              {skillsoff.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-purple-500">
                    <Wrench size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Offering</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillsoff.map((skill, i) => (
                      <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${colors.badge}`}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {skillsseek.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-orange-500">
                    <Search size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Seeking</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillsseek.map((skill, i) => (
                      <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${colors.badge}`}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Call to Action Card */}
        <div className="relative overflow-hidden rounded-3xl p-8 text-center sm:text-left shadow-2xl border border-white/10" style={{ background: 'linear-gradient(135deg, #111 0%, #050505 100%)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] -mt-16 -mr-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -mb-16 -ml-16 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 justify-center sm:justify-start">
                Join the Daplink Family 
              </h3>
              <p className="text-gray-400 text-sm max-w-sm">Create your own professional profile and connect with others.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/Explorepeoples" className="px-5 py-2.5 bg-white/10 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition text-sm flex items-center justify-center gap-2">
                <User size={16} /> Explore People
              </Link>
              <button onClick={() => setModalOpen(true)} className="px-5 py-2.5 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 transition shadow-lg flex items-center justify-center gap-2 text-sm">
                <span>Jobs</span> <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} theme={theme}>
          <div className={`p-8 w-full text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 to-purple-500"></div>
            <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-6 ${theme === 'dark' ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-600'}`}>
              <Lock size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Unlock Opportunities</h3>
            <p className={`mb-8 text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              To access premium job listings and connect directly with recruiters, upgrade your DapLink plan.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/Pricing" className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98]">
                View Plans & Pricing
              </Link>
              <button onClick={() => setModalOpen(false)} className={`text-sm font-medium py-2 ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-800'}`}>
                Maybe later
              </button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
}