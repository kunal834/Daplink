"use client";

import React from 'react';
import { Sticker } from 'lucide-react';



export default function MindsetTab ({ isDarkMode }) {
  const mindsetQuotes = [
    { id: 1, text: "Build in silence, let success make the noise.", author: "@alex_creator", color: "bg-yellow-100 text-yellow-800" },
    { id: 2, text: "Consistency is the only currency that matters.", author: "@sarah_j", color: "bg-blue-100 text-blue-800" },
    { id: 3, text: "Your network is your net worth.", author: "@hustle_daily", color: "bg-rose-100 text-rose-800" },
    { id: 4, text: "Ship fast, learn faster.", author: "@dev_guru", color: "bg-purple-100 text-purple-800" },
  ];
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div><h2 className="text-2xl font-bold tracking-tight">Mindset Wall</h2><p className={`${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'} text-sm`}>Daily vision and values. A sticky-note wall for your soul.</p></div>
      <div className={`p-4 rounded-2xl border mb-6 flex gap-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <input type="text" placeholder="Add your daily affirmation..." className={`flex-1 bg-transparent outline-none font-medium ${isDarkMode ? 'text-white placeholder:text-zinc-600' : 'text-zinc-900'}`} />
        <button className="text-indigo-500 font-bold text-sm">Post</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {mindsetQuotes.map((quote) => (
          <div key={quote.id} className={`p-6 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-md shadow-sm transform hover:-translate-y-1 transition-transform ${quote.color} min-h-[160px] flex flex-col justify-between`}><Sticker className="w-5 h-5 opacity-20 mb-2" /><p className="font-bold text-lg leading-tight">"{quote.text}"</p><p className="text-xs font-bold opacity-60 mt-4">{quote.author}</p></div>
        ))}
      </div>
    </div>
  );
};