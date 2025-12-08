'use client';

import React from 'react';
import { 
  Link as LinkIcon, Search as SearchIcon, Sun, Moon, 
  Bell, Share2, LogOut, BarChart3, RefreshCw, Zap 
} from 'lucide-react';

import Link from 'next/link';

const TopBar = ({ 
  isDarkMode, 
  setIsDarkMode, 
  notificationsOpen, 
  setNotificationsOpen, 
  searchQuery, 
  setSearchQuery, 
  profile, 
  copyLink, 
  handleLogout 
}) => {
  
  const notifications = [
    { id: 1, title: "100 Views Milestone", time: "2m ago", icon: <BarChart3 className="w-4 h-4 text-emerald-500" /> },
    { id: 2, title: "New Feature: Skill Swap", time: "1h ago", icon: <RefreshCw className="w-4 h-4 text-indigo-500" /> },
    { id: 3, title: "Weekly Report Ready", time: "1d ago", icon: <Zap className="w-4 h-4 text-amber-500" /> },
  ];

  // Safely access profile properties with fallbacks
  const username = profile?.username || 'user';
  const initial = username[0] ? username[0].toUpperCase() : 'U';

  return (
    <header className={`w-full h-16 border-b flex items-center justify-between px-6 shrink-0 z-30 sticky top-0 backdrop-blur-xl ${isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-zinc-200/60'}`}>
        <div className="flex items-center gap-3">
           <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg hover:rotate-3 transition-transform cursor-pointer ${isDarkMode ? 'bg-white shadow-indigo-900/20' : 'bg-white shadow-zinc-900/10'}`}>
              {/* <LinkIcon className="text-white w-5 h-5" /> */}

              <Link href="/">  <img src="/innovate.png" alt="" /> </Link>
            </div>
            <div>
              <Link href="/" className="font-bold text-lg hidden sm:block tracking-tight leading-none">DapLink</Link>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Creator OS</span>
            </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
           <SearchIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
           <input 
             type="text" 
             placeholder="Search people, skills, or communities..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm font-medium outline-none border transition-all ${
               isDarkMode 
                 ? 'bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500 focus:bg-zinc-800' 
                 : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-black focus:bg-white'
             }`}
           />
        </div>
        
        <div className="flex items-center gap-4">
           <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
             {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>

           <div className="relative">
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors relative ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
                <Bell className="w-5 h-5" /><span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              {notificationsOpen && (
                <div className={`absolute top-12 right-0 w-80 rounded-2xl shadow-2xl border p-2 animate-in fade-in slide-in-from-top-2 z-50 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                   <div className={`px-4 py-2 flex justify-between items-center border-b mb-2 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-50'}`}><h3 className="font-bold text-sm">Notifications</h3><span className="text-xs text-indigo-500 font-medium cursor-pointer">Mark read</span></div>
                   <div className="space-y-1">{notifications.map(n => (<div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-100'}`}>{n.icon}</div><div><p className="text-sm font-semibold">{n.title}</p><p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{n.time}</p></div></div>))}</div>
                </div>
              )}
           </div>

          <div className={`hidden md:flex items-center rounded-full pl-4 pr-1 py-1 text-sm border shadow-sm hover:shadow transition-all group ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200/60 text-zinc-600'}`}>
            {/* FIX: Ensure we only render the string property 'username', not the object 'profile' */}
            <span className={`truncate max-w-[150px] font-medium transition-colors ${isDarkMode ? 'group-hover:text-white' : 'group-hover:text-black'}`}>daplink.app/{username}</span>
            <button onClick={copyLink} className={`ml-2 w-7 h-7 flex items-center justify-center rounded-full border shadow-sm hover:scale-105 active:scale-95 transition-all ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-indigo-400' : 'bg-white border-zinc-200 text-zinc-500 hover:text-indigo-600'}`}><Share2 className="w-3.5 h-3.5" /></button>
          </div>
          <div className={`h-6 w-px mx-1 hidden sm:block ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
          <button onClick={handleLogout} className={`transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-black'}`}><LogOut className="w-5 h-5" /></button>
          {/* FIX: Ensure initial is a string */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-md ring-2 ring-white/10 cursor-pointer hover:ring-indigo-500/50 transition-all">{initial}</div>
        </div>
      </header>
  );
};

export default TopBar;