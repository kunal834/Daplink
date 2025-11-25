'use client';
import React from 'react';
import { Star } from 'lucide-react';

export default function TestimonialCard({ theme, name, role, text }) {
  return (
    <div className={`border p-8 rounded-3xl transition duration-300 hover:-translate-y-1 flex flex-col h-full ${theme === 'dark' ? 'bg-[#0A0A0A] border-[#1F1F1F] hover:border-teal-500/30' : 'bg-gray-50 border-gray-100 hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/5'}`}>
      
      {/* User Info */}
      <div className="flex items-center gap-4 mb-6">
        {/* Avatar Placeholder */}
        <div className={`w-12 h-12 rounded-full flex-shrink-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
          {/* Optional: Add <img src="..." /> here if you have user avatars */}
        </div>
        <div>
          <h4 className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{name}</h4>
          <p className={`text-xs uppercase tracking-wide font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{role}</p>
        </div>
      </div>
      
      {/* Quote Text */}
      <p className={`leading-relaxed mb-6 flex-grow ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>"{text}"</p>
      
      {/* Star Rating */}
      <div className="text-teal-500 text-xs flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={14} fill="currentColor" className="text-teal-500" />
        ))}
      </div>
    </div>
  );
}