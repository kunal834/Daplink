'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search as SearchIcon, Sun, Moon,
  Bell, Share2, LogOut, BarChart3, RefreshCw, Zap, X, CheckCircle2
} from 'lucide-react';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/context/Authenticate';
import { motion, AnimatePresence } from 'framer-motion';

const TopBar = ({ isDarkMode, setIsDarkMode }) => {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  
  const daplink = user?.daplinkID;

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const notifications = [
    { id: 1, title: "100 Views Milestone", time: "2m ago", icon: <BarChart3 className="w-4 h-4 text-emerald-400 animate-pulse" /> },
    { id: 2, title: "New Feature: Skill Swap", time: "1h ago", icon: <RefreshCw className="w-4 h-4 text-indigo-400 rotate-12" /> },
    { id: 3, title: "Weekly Report Ready", time: "1d ago", icon: <Zap className="w-4 h-4 text-amber-400" /> },
  ];

  const username = daplink?.handle || 'user';
  const initial = username[0]?.toUpperCase() || 'U';

  const copyLink = () => {
    navigator.clipboard.writeText(`daplink.app/u/${username}`);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  useEffect(() => {
    if (!loading && (!user?.isProfileComplete || !daplink)) {
      router.replace("/Generate");
    }
  }, [user, daplink, loading, router]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['dashboard-topbar-search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return null;
      const response = await axios.get(`/api/backend/posts/search?q=${encodeURIComponent(debouncedQuery)}`);
      return response.data;
    },
    enabled: Boolean(debouncedQuery),
    staleTime: 30 * 1000,
  });

  const currentHandle = String(user?.handle || daplink?.handle || '').replace(/^@/, '').toLowerCase();
  const peopleResults = (searchResults?.users || [])
    .filter((person) => {
      const handle = String(person?.handle || person?.daplinkID?.handle || '').replace(/^@/, '').toLowerCase();
      return handle && handle !== currentHandle;
    })
    .slice(0, 20);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery, isSearchFocused]);

  const openProfile = (person) => {
    const handle = String(person?.handle || '').replace(/^@/, '');
    if (!handle) return;
    router.push(`/u/${handle}`);
    setIsSearchFocused(false);
  };

  const handleSearchSubmit = (event) => {
    if (!searchQuery.trim()) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (peopleResults.length > 0) {
        setActiveIndex((prev) => (prev + 1) % peopleResults.length);
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (peopleResults.length > 0) {
        setActiveIndex((prev) => (prev - 1 + peopleResults.length) % peopleResults.length);
      }
      return;
    }

    if (event.key === 'Escape') {
      setIsSearchFocused(false);
      return;
    }

    if (event.key !== 'Enter') return;

    const selectedUser = peopleResults[activeIndex] || peopleResults[0];
    if (selectedUser?.handle) {
      event.preventDefault();
      openProfile(selectedUser);
      return;
    }

    router.push(`/Dashboard/mindset`);
    setIsSearchFocused(false);
  };

  if (!user || loading) {
    return (
      <header className="h-16 flex items-center px-6 border-b">
        <div className="w-36 h-6 bg-zinc-200 rounded animate-pulse" />
      </header>
    );
  }

  return (
    <header className={`w-full h-16 border-b flex items-center justify-between px-6 shrink-0 z-30 sticky top-0 backdrop-blur-xl ${isDarkMode ? 'bg-zinc-950/70 border-zinc-800/60 shadow-md' : 'bg-white/70 border-zinc-200/60'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-9.5 h-9.5 rounded-2xl flex items-center justify-center shadow-md hover:rotate-6 transition-all duration-300 ${isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200'}`}>
          <Link href="/"> 
            <Image src="/innovate.png" alt="Logo" width={24} height={24} className="hover:scale-110 transition-transform" /> 
          </Link>
        </div>
        <div className="leading-none">
          <Link href="/" className={`font-black text-[15px] hidden sm:block tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>DapLink</Link>
          <span className={`text-[9px] font-extrabold uppercase tracking-widest block mt-0.5 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Creator OS</span>
        </div>
      </div>

      {/* Search Bar */}
      <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-8 relative">
        <SearchIcon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isSearchFocused ? 'text-indigo-500' : isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
        <input
          type="text"
          placeholder="Search creators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onKeyDown={handleSearchSubmit}
          className={`w-full pl-10 pr-10 py-2 rounded-2xl text-xs font-semibold outline-none border transition-all duration-300 ${
            isSearchFocused
              ? (isDarkMode 
                  ? 'bg-zinc-900 border-indigo-500/80 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                  : 'bg-white border-zinc-900 text-zinc-900 shadow-md')
              : (isDarkMode 
                  ? 'bg-zinc-900/50 border-zinc-800 text-zinc-300 focus:bg-zinc-900' 
                  : 'bg-zinc-50 border-zinc-200/80 text-zinc-800 focus:bg-white')
          }`}
        />

        <AnimatePresence>
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={() => setSearchQuery('')}
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSearchFocused && searchQuery.trim() !== '' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute top-12 left-0 w-full rounded-2xl shadow-2xl border overflow-hidden z-50 backdrop-blur-xl ${
                isDarkMode ? 'bg-zinc-950/95 border-zinc-800' : 'bg-white/95 border-zinc-200'
              }`}
            >
              {isSearching ? (
                <div className={`px-4 py-4 text-xs font-bold text-center ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Searching...</div>
              ) : peopleResults.length > 0 ? (
                <div>
                  <div className="max-h-64 overflow-y-auto">
                    {peopleResults.map((person, index) => {
                      const handle = String(person.handle || '').replace(/^@/, '');
                      const displayName = person.name || handle || 'Unknown User';
                      const avatar = person.avatar || person.profile || person.daplinkID?.profile || '';
                      const initials = String(displayName).slice(0, 2).toUpperCase();
                      const isHighlighted = index === activeIndex;

                      return (
                        <button
                          key={person._id || handle || index}
                          type="button"
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => openProfile(person)}
                          className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                            isHighlighted
                              ? (isDarkMode ? 'bg-zinc-900/80 text-white border-l-3 border-indigo-500 pl-3.25' : 'bg-zinc-100 text-zinc-900 border-l-3 border-zinc-900 pl-3.25')
                              : (isDarkMode ? 'hover:bg-zinc-900/40 text-zinc-300' : 'hover:bg-zinc-50 text-zinc-700')
                          }`}
                        >
                          <div className={`w-8.5 h-8.5 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold ${
                            isDarkMode ? 'bg-zinc-800 text-zinc-200 border border-zinc-700' : 'bg-zinc-200 text-zinc-700 border border-zinc-300/50'
                          }`}>
                            {avatar ? (
                              <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                              initials
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-xs leading-tight font-bold truncate flex items-center gap-1">
                              <span className="truncate">{displayName}</span>
                              {person.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                            </div>
                            <div className={`text-[10px] font-semibold mt-0.5 leading-tight ${isDarkMode ? 'text-zinc-500' : 'text-slate-500'}`}>
                              @{handle}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className={`px-4 py-2.5 border-t flex items-center justify-between text-[9px] font-extrabold tracking-widest uppercase ${
                    isDarkMode ? 'border-zinc-900 text-zinc-500' : 'border-zinc-100 text-slate-400'
                  }`}>
                    <span>{peopleResults.length} results</span>
                    <span>↑↓ Navigate   ↵ Select</span>
                  </div>
                </div>
              ) : (
                <div className={`px-4 py-4 text-xs font-bold text-center ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  No people found for "{searchQuery.trim()}"
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className={`w-9.5 h-9.5 flex items-center justify-center rounded-2xl transition-all duration-300 cursor-pointer ${
            isDarkMode 
              ? 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800' 
              : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 border border-zinc-200/50'
          }`}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)} 
            className={`w-9.5 h-9.5 flex items-center justify-center rounded-2xl transition-all duration-300 relative cursor-pointer ${
              isDarkMode 
                ? 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800' 
                : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 border border-zinc-200/50'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse"></span>
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={`absolute top-12 right-0 w-80 rounded-2xl shadow-2xl border p-2 z-50 backdrop-blur-xl ${
                  isDarkMode ? 'bg-zinc-950/95 border-zinc-850' : 'bg-white/95 border-zinc-100'
                }`}
              >
                <div className={`px-3 py-2 border-b flex justify-between items-center mb-1 ${isDarkMode ? 'border-zinc-900' : 'border-zinc-100'}`}>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-60">Notifications</span>
                  <span className="text-[9px] font-extrabold text-indigo-500 uppercase cursor-pointer hover:underline">Clear all</span>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-zinc-900/50' : 'hover:bg-zinc-50'}`}>
                    <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800/80' : 'bg-zinc-100 border-zinc-200/50'}`}>
                      {n.icon}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>{n.title}</p>
                      <p className="text-[10px] font-semibold text-zinc-500 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Copy Share Link */}
        <div className={`hidden lg:flex items-center rounded-2xl pl-4 pr-1 py-1 text-xs border shadow-xs hover:shadow transition-all duration-300 group ${
          isDarkMode 
            ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700' 
            : 'bg-zinc-50 border-zinc-200/60 text-zinc-600 hover:border-zinc-300'
        }`}>
          <span className={`truncate max-w-37.5 font-bold transition-colors ${isDarkMode ? 'group-hover:text-white' : 'group-hover:text-black'}`}>
            {`daplink.online/u/${username}`}
          </span>
          <button 
            onClick={copyLink} 
            className={`ml-2 w-7.5 h-7.5 flex items-center justify-center rounded-xl border shadow-xs hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
              isDarkMode 
                ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-indigo-400' 
                : 'bg-white border-zinc-200 text-zinc-500 hover:text-indigo-600'
            }`}
            title="Copy digital bio link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className={`h-6 w-px mx-1 hidden sm:block ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
        
        {/* Logout */}
        <button 
          onClick={handleLogout} 
          className={`w-9.5 h-9.5 flex items-center justify-center rounded-2xl transition-all duration-300 cursor-pointer ${
            isDarkMode 
              ? 'text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800' 
              : 'text-zinc-500 hover:text-black hover:bg-zinc-50 border border-transparent'
          }`}
          title="Sign out of Creator OS"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>

        {/* Profile Avatar */}
        {daplink?.profile ? (
          <div className="relative w-9.5 h-9.5 rounded-2xl overflow-hidden shadow-md ring-2 ring-white/10 cursor-pointer hover:ring-indigo-500/50 transition-all duration-300">
            <Image
              src={daplink?.profile}
              alt="User avatar"
              fill
              sizes="38px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-9.5 h-9.5 rounded-2xl bg-linear-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs font-black shadow-md ring-2 ring-white/10 cursor-pointer hover:ring-indigo-500/50 transition-all duration-300">
            {initial}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
