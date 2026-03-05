'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  ArrowRight, 
  Hexagon, 
  Palette, 
  Code2, 
  Video,
  Sparkles
} from 'lucide-react';

export default function CommunityTab({ isDarkMode }) {
  const communities = [
    { 
      id: 1, 
      name: "Web3 Design", 
      members: "1.2k", 
      description: "Shaping the decentralized web's user experience.",
      icon: Hexagon,
      color: "blue",
      themeBg: isDarkMode ? "bg-blue-500/10" : "bg-blue-50",
      themeText: isDarkMode ? "text-blue-400" : "text-blue-600",
      themeBorder: isDarkMode ? "hover:border-blue-500/50" : "hover:border-blue-300",
      isNew: true 
    },
    { 
      id: 2, 
      name: "Digital Artists", 
      members: "8.5k", 
      description: "Share WIPs, get critiques, and explore new mediums.",
      icon: Palette,
      color: "purple",
      themeBg: isDarkMode ? "bg-purple-500/10" : "bg-purple-50",
      themeText: isDarkMode ? "text-purple-400" : "text-purple-600",
      themeBorder: isDarkMode ? "hover:border-purple-500/50" : "hover:border-purple-300",
    },
    { 
      id: 3, 
      name: "Indie Hackers", 
      members: "24k", 
      description: "Building profitable side projects in public.",
      icon: Code2,
      color: "emerald",
      themeBg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50",
      themeText: isDarkMode ? "text-emerald-400" : "text-emerald-600",
      themeBorder: isDarkMode ? "hover:border-emerald-500/50" : "hover:border-emerald-300",
    },
    { 
      id: 4, 
      name: "Content Creators", 
      members: "45k", 
      description: "Strategies for YouTube, TikTok, and audience growth.",
      icon: Video,
      color: "rose",
      themeBg: isDarkMode ? "bg-rose-500/10" : "bg-rose-50",
      themeText: isDarkMode ? "text-rose-400" : "text-rose-600",
      themeBorder: isDarkMode ? "hover:border-rose-500/50" : "hover:border-rose-300",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
            Community Hub
          </h2>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Find your tribe, share knowledge, and collaborate.
          </p>
        </div>

        <div className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border shadow-sm ${
          isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
        }`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          1,204 Creators Online
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 shadow-xl border border-white/10 group bg-zinc-900">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Premium Access
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Join the Creator Circle
            </h3>
            <p className="text-indigo-100/80 text-base sm:text-lg mb-8 leading-relaxed max-w-md">
              Unlock exclusive brand deals, high-tier collaboration opportunities, and expert-led workshops.
            </p>
            <Link
              href="/Explorepeoples"
              className="inline-flex items-center gap-2 bg-white text-zinc-900 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-white/10"
            >
              Explore Peoples
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Hero Decorative Icon */}
          <div className="hidden md:flex relative items-center justify-center w-48 h-48">
            <div className="absolute inset-0 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700" />
            <Users className="w-32 h-32 text-white/90 drop-shadow-2xl transition-transform duration-700 group-hover:scale-110" strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* Communities Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
            Trending Communities
          </h3>
          <button className={`text-sm font-medium hover:underline ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {communities.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className={`p-6 rounded-2xl border transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-45 ${
                  isDarkMode
                    ? 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50'
                    : 'bg-white border-zinc-200 hover:shadow-lg hover:shadow-zinc-200/50'
                } ${c.themeBorder}`}
              >
                {/* NEW Badge */}
                {c.isNew && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-indigo-500 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-wider shadow-sm">
                      New
                    </span>
                  </div>
                )}

                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3 ${c.themeBg} ${c.themeText}`}>
                    <Icon className="w-6 h-6" strokeWidth={2} />
                  </div>

                  <h4 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    {c.name}
                  </h4>
                  <p className={`text-sm line-clamp-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {c.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-inherit">
                  {/* Fake Member Avatars + Count */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                            isDarkMode ? 'border-zinc-900 bg-zinc-800 text-zinc-400' : 'border-white bg-zinc-100 text-zinc-500'
                          }`}
                        >
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {c.members}
                    </span>
                  </div>

                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-zinc-800 text-zinc-300 hover:bg-white hover:text-black'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    Join
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}