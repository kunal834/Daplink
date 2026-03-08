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

  const notifications = [
    { id: 1, title: "100 Views Milestone", time: "2m ago", icon: <BarChart3 className="w-4 h-4 text-emerald-500" /> },
    { id: 2, title: "New Feature: Skill Swap", time: "1h ago", icon: <RefreshCw className="w-4 h-4 text-indigo-500" /> },
    { id: 3, title: "Weekly Report Ready", time: "1d ago", icon: <Zap className="w-4 h-4 text-amber-500" /> },
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
    <header className={`w-full h-16 border-b flex items-center justify-between px-6 shrink-0 z-30 sticky top-0 backdrop-blur-xl ${isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-zinc-200/60'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg hover:rotate-3 transition-transform cursor-pointer ${isDarkMode ? 'bg-white shadow-indigo-900/20' : 'bg-white shadow-zinc-900/10'}`}>
          <Link href="/"> <Image src="/innovate.png" alt="Logo" width={48} height={48} /> </Link>
        </div>
        <div>
          <Link href="/" className="font-bold text-lg hidden sm:block tracking-tight leading-none">DapLink</Link>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Creator OS</span>
        </div>
      </div>

      {/* Search Bar */}
      <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-8 relative">
        <SearchIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
        <input
          type="text"
          placeholder="Search people"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onKeyDown={handleSearchSubmit}
          className={`w-full pl-10 pr-10 py-2 rounded-xl text-sm font-medium outline-none border transition-all ${isDarkMode
            ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500 focus:bg-zinc-800'
            : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black focus:bg-white'
            }`}
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {isSearchFocused && searchQuery.trim() !== '' && (
          <div className={`absolute top-12 left-0 w-full rounded-xl shadow-2xl border overflow-hidden z-50 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-[#f3f4f6] border-zinc-200'}`}>
            {isSearching ? (
              <div className={`px-4 py-3 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Searching...</div>
            ) : peopleResults.length > 0 ? (
              <div>
                <div className="max-h-64 overflow-y-auto">
                {peopleResults.map((person, index) => {
                  const handle = String(person.handle || '').replace(/^@/, '');
                  const displayName = person.name || handle || 'Unknown User';
                  const avatar = person.avatar || person.profile || person.daplinkID?.profile || '';
                  const initials = String(displayName).slice(0, 2).toUpperCase();
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={person._id || handle || index}
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => openProfile(person)}
                      className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors ${isActive
                        ? (isDarkMode ? 'bg-zinc-800/80' : 'bg-zinc-200/70')
                        : (isDarkMode ? 'hover:bg-zinc-800/60' : 'hover:bg-zinc-200/50')
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold ${isDarkMode ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-300 text-zinc-700'}`}>
                        {avatar ? (
                          <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          initials
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className={`text-base leading-tight font-semibold truncate flex items-center gap-1 ${isDarkMode ? 'text-zinc-100' : 'text-slate-800'}`}>
                          <span className="truncate">{displayName}</span>
                          {person.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
                        </div>
                        <div className={`text-xs leading-tight mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                          @{handle}
                        </div>
                      </div>
                    </button>
                  );
                })}
                </div>

                <div className={`px-4 py-2.5 border-t flex items-center justify-between text-[11px] font-semibold tracking-widest uppercase ${isDarkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-slate-500'}`}>
                  <span>{peopleResults.length} results found</span>
                  <span>↑↓ Navigate   ↵ Select</span>
                </div>
              </div>
            ) : (
              <div className={`px-4 py-3 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                No people found for "{searchQuery.trim()}"
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button onClick={() => setNotificationsOpen(!notificationsOpen)} className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors relative ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
            <Bell className="w-5 h-5" />
          </button>

          {notificationsOpen && (
            <div className={`absolute top-12 right-0 w-80 rounded-2xl shadow-2xl border p-2 z-50 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
              {notifications.map(n => (
                <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl">
                  {n.icon}
                  <div>
                    <p className="text-sm font-semibold">{n.title}</p>
                    <p className="text-xs text-zinc-400">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`hidden md:flex items-center rounded-full pl-4 pr-1 py-1 text-sm border shadow-sm hover:shadow transition-all group ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200/60 text-zinc-600'}`}>
          <span className={`truncate max-w-37.5 font-medium transition-colors ${isDarkMode ? 'group-hover:text-white' : 'group-hover:text-black'}`}>
            {`daplink.app/u/${username}`}
          </span>
          <button onClick={copyLink} className={`ml-2 w-7 h-7 flex items-center justify-center rounded-full border shadow-sm hover:scale-105 active:scale-95 transition-all ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-indigo-400' : 'bg-white border-zinc-200 text-zinc-500 hover:text-indigo-600'}`}>
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className={`h-6 w-px mx-1 hidden sm:block ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
        
        <button onClick={handleLogout} className={`transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-black'}`}>
          <LogOut className="w-5 h-5" />
        </button>
        {daplink?.profile ? (
          <div className="relative w-9 h-9 rounded-full overflow-hidden shadow-md ring-2 ring-white/10 cursor-pointer hover:ring-indigo-500/50 transition-all">
            <Image
              src={daplink?.profile}
              alt="User avatar"
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-md ring-2 ring-white/10 cursor-pointer hover:ring-indigo-500/50 transition-all">
            {initial}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
