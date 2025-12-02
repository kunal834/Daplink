'use client';
import React from 'react';

export default function Mindsettab({ Mindset, setMindset, theme }) {
  
  // Dynamic Input Styles
  const inputClasses = `w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all resize-none ${
    theme === 'dark' 
      ? 'bg-[#1A1A1A] border-white/10 text-white focus:border-teal-500/50 placeholder-gray-600' 
      : 'bg-white border-gray-200 text-gray-900 focus:border-teal-500 placeholder-gray-400'
  }`;

  return (
    <div className="space-y-6 animate-enter">
      <div>
        <label className={`block text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Mindset Wall
        </label>
        
        <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          Share your vision, values, and what drives you
        </p>
        
        <textarea
          rows={6}
          value={Mindset || ""}
          onChange={(e) => setMindset(e.target.value)}
          className={inputClasses}
          placeholder="e.g. 'Simplicity is the ultimate sophistication.'"
        />
      </div>
    </div>
  );
}