"use client";

import React from 'react';
import { Link as LinkIcon, ExternalLink } from 'lucide-react';

const MobilePreview = ({ profile, links }) => {
  const themeClasses = {
    modern: "bg-zinc-950 text-white",
    ocean: "bg-gradient-to-b from-blue-950 to-indigo-900 text-white",
    sunset: "bg-gradient-to-b from-orange-900 via-red-900 to-rose-950 text-white",
    light: "bg-white text-zinc-900",
  };

  const buttonClasses = {
    modern: "bg-zinc-800/50 hover:bg-zinc-800 text-white border-zinc-700/50 backdrop-blur-md",
    ocean: "bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-md",
    sunset: "bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-md",
    light: "bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border-zinc-200 shadow-sm",
  };

  const bgClass = themeClasses[profile] || themeClasses.modern;
  const btnClass = buttonClasses[profile] || buttonClasses.modern;

  return (
    <div className="relative w-[320px] h-[640px] border-[14px] border-zinc-900 rounded-[3.5rem] shadow-2xl overflow-hidden bg-black z-10 mx-auto ring-1 ring-zinc-200/50">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-20 flex items-center justify-end px-3 gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
         <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
      </div>
      <div className={`w-full h-full overflow-y-auto ${bgClass} p-6 pt-16 no-scrollbar transition-colors duration-500`}>
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-24 h-24 rounded-full bg-zinc-200 mb-5 overflow-hidden border-4 border-white/10 shadow-xl ring-1 ring-white/10 relative group">
             {profile ? <img src={profile} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-gradient-to-tr from-indigo-500 to-purple-500 text-white">{profile ? profile : 'U'}</div>}
          </div>
          <h2 className="text-xl font-bold mb-2 text-center leading-tight tracking-tight">{profile || "@username"}</h2>
          <p className="text-sm opacity-60 text-center max-w-[240px] font-medium leading-relaxed">{profile || "Welcome to my digital space."}</p>
        </div>
        {/* <div className="space-y-3 px-1">
          {links.length === 0 && <div className="text-center opacity-40 text-sm py-8 italic border border-dashed border-white/10 rounded-xl">Links appear here...</div>}
          {links.filter(l => l.active).map((link, idx) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={`block w-full p-4 rounded-2xl border text-center font-semibold transition-all active:scale-[0.98] text-sm ${btnClass} animate-in fade-in slide-in-from-bottom-2 flex items-center justify-center gap-2`} style={{ animationDelay: `${idx * 50}ms` }}>
              {link.title} <ExternalLink className="w-3 h-3 opacity-50 absolute right-4" />
            </a>
          ))}
        </div> */}
        <div className="mt-16 flex justify-center opacity-30 hover:opacity-100 transition-opacity pb-8">
           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full backdrop-blur-md"><LinkIcon className="w-3 h-3" /> DapLink</div>
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;