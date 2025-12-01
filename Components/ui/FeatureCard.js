'use client';
import React from 'react';

export default function FeatureCard({ theme, icon: Icon, iconColor, iconBg, title, desc, badge, badgeColor, children }) {
  return (
    <div className={`glass-card p-8 rounded-[2rem] h-[420px] flex flex-col relative group transition-all duration-300 ${theme === 'dark' ? 'hover:border-teal-500/30' : 'hover:border-teal-500/50'}`}>
      {/* Icon */}
      <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center ${iconColor} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>
        <Icon size={24} />
      </div>
      
      {/* Title & Badge */}
      <div className="flex justify-between items-start mb-3">
        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
        {badge && <span className={`text-xs font-mono px-2 py-1 rounded border ${badgeColor}`}>{badge}</span>}
      </div>
      
      {/* Description */}
      <p className={`leading-relaxed mb-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{desc}</p>
      
      {children}
    </div>
  );
}