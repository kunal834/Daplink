"use client";

import React from 'react';


export default function SkillSwapTab({ isDarkMode }) {
  const skillSwaps = [
    { id: 1, name: "Sarah Jenkins", teach: "React Native", learn: "UI Design", avatar: "SJ", color: "bg-pink-100 text-pink-600" },
    { id: 2, name: "Marcus Chen", teach: "3D Blender", learn: "Marketing", avatar: "MC", color: "bg-cyan-100 text-cyan-600" },
    { id: 3, name: "Priya Patel", teach: "Copywriting", learn: "SEO", avatar: "PP", color: "bg-emerald-100 text-emerald-600" },
    { id: 4, name: "Alex Ross", teach: "Python", learn: "Public Speaking", avatar: "AR", color: "bg-indigo-100 text-indigo-600" },
  ];
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div><h2 className="text-2xl font-bold tracking-tight">Skill Swap</h2><p className={`${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'} text-sm`}>Connect with other creators to trade expertise.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillSwaps.map((person) => (
          <div key={person.id} className={`p-6 rounded-3xl border transition-all ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 hover:shadow-md'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${person.color}`}>{person.avatar}</div>
              <div><h4 className="font-bold text-lg">{person.name}</h4><div className="flex gap-2 text-xs font-medium mt-1"><span className={`px-2 py-0.5 rounded ${isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'}`}>Online</span></div></div>
              <button className={`ml-auto px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-black hover:text-white'}`}>Connect</button>
            </div>
            <div className="flex gap-4">
              <div className="flex-1"><p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Teaching</p><p className={`font-semibold text-sm ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{person.teach}</p></div>
              <div className={`w-px ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}></div>
              <div className="flex-1"><p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Learning</p><p className={`font-semibold text-sm ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{person.learn}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};