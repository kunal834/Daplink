"use client";

import React from 'react';

import {
  Link as LinkIcon, Image as ImageIcon,
  ExternalLink, Zap, BarChart3,
} from 'lucide-react';


export default function AnalyticsTab({ isDarkMode }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div><h2 className="text-2xl font-bold tracking-tight">Analytics</h2><p className={`${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'} text-sm`}>Track your growth and audience.</p></div>
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-6 rounded-[2rem] border shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500"><ExternalLink className={`w-32 h-32 ${isDarkMode ? 'text-white' : 'text-black'}`} /></div>
          <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Lifetime Views</p><h3 className="text-5xl font-black tracking-tighter">1,204</h3>
          <div className="text-emerald-600 text-xs font-bold mt-4 flex items-center gap-1 bg-emerald-500/10 w-fit px-2.5 py-1.5 rounded-lg border border-emerald-500/20"><div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-emerald-600"></div>+12% <span className="text-emerald-600/70 font-medium ml-1">vs last week</span></div>
        </div>
        <div className={`p-6 rounded-[2rem] border shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500"><Zap className={`w-32 h-32 ${isDarkMode ? 'text-white' : 'text-black'}`} /></div>
          <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Lifetime Clicks</p><h3 className="text-5xl font-black tracking-tighter">843</h3>
          <div className="text-emerald-600 text-xs font-bold mt-4 flex items-center gap-1 bg-emerald-500/10 w-fit px-2.5 py-1.5 rounded-lg border border-emerald-500/20"><div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-emerald-600"></div>+8% <span className="text-emerald-600/70 font-medium ml-1">vs last week</span></div>
        </div>
      </div>
      <div className={`p-8 rounded-[2rem] border shadow-sm ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex items-center justify-between mb-8"><h3 className="font-bold flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Traffic Activity</h3><select className={`text-xs border rounded-lg px-3 py-1.5 font-bold outline-none cursor-pointer ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'}`}><option>Last 7 Days</option><option>Last 30 Days</option></select></div>
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
          {[30, 45, 25, 60, 75, 50, 80, 40, 70, 90, 65, 85].map((h, i) => (
            <div key={i} className={`flex-1 transition-all rounded-t-xl relative group ${isDarkMode ? 'bg-zinc-800 hover:bg-indigo-600' : 'bg-zinc-100 hover:bg-zinc-900'}`} style={{ height: `${h}%` }}>
              <div className={`absolute -top-12 left-1/2 -translate-x-1/2 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all font-bold shadow-xl translate-y-2 group-hover:translate-y-0 z-10 whitespace-nowrap ${isDarkMode ? 'bg-indigo-600' : 'bg-zinc-900'}`}>{h * 10} views<div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${isDarkMode ? 'bg-indigo-600' : 'bg-zinc-900'}`}></div></div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}