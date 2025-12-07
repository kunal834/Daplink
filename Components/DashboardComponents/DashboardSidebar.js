"use client";

import React from 'react';
import { 
  Layout, User, BarChart3, Users, RefreshCw, 
  Briefcase, Brain, QrCode, Settings 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isDarkMode }) => {
  const menuItems = [
    { id: 'links', icon: Layout, label: 'Links' },
    { id: 'appearance', icon: User, label: 'Bio Page' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'community', icon: Users, label: 'Community', badge: '1,204' },
    { id: 'skillswap', icon: RefreshCw, label: 'Skill Swap' },
    { id: 'jobs', icon: Briefcase, label: 'Job Finder', badge: 'AI' },
    { id: 'mindset', icon: Brain, label: 'Mindset Wall' },
    { id: 'qrcode', icon: QrCode, label: 'QR Code' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className={`w-18 md:w-64 h-full border-r flex flex-col justify-between py-6 shrink-0 z-10 ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200/60'}`}>
      <div className="flex flex-col gap-1 px-2 md:px-4">
        <p className={`px-3 text-xs font-bold uppercase tracking-widest mb-2 hidden md:block ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>Menu</p>
        {menuItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
              activeTab === item.id 
                ? (isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20')
                : (isDarkMode ? 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900')
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : isDarkMode ? 'text-zinc-600 group-hover:text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-900'}`} />
            <span className="hidden md:block">{item.label}</span>
            {item.badge && (
              <span className={`hidden md:flex ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                 activeTab === item.id 
                   ? 'bg-indigo-500 text-white' 
                   : isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="px-6 hidden md:block">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700 blur-xl" />
          <div className="relative z-10">
            <p className="text-xs font-medium text-indigo-200 mb-1">Pro Plan</p>
            <p className="text-sm font-bold mb-4">Unlock Everything</p>
            <button className="w-full bg-white text-indigo-600 text-xs font-bold py-2.5 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm">Upgrade</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
