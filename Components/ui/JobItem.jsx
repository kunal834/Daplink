'use client';
import React from 'react';

export default function JobItem({ theme, title, wage }) {
  return (
    <div className={`border p-3 rounded-xl backdrop-blur-sm group-hover:translate-x-2 transition-transform duration-300 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
      <div className="flex justify-between items-center mb-1">
        <span className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{title}</span>
        <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold">{wage}</span>
      </div>
      <div className={`h-1 w-12 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}></div>
    </div>
  );
}