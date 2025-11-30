'use client';
import React from 'react';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';

const categoryColors = {
  "Guides": "bg-indigo-500",
  "Product Updates": "bg-blue-500",
  "Company Culture": "bg-green-500",
  "Case Studies": "bg-yellow-500",
  "Tips & Tricks": "bg-red-500",
};

export default function ArticleCard({ article, theme }) {
  return (
    <div className={`group relative flex flex-col h-full rounded-[2rem] overflow-hidden border transition-all duration-300 hover:-translate-y-2 ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5 hover:border-teal-500/30' : 'bg-white border-gray-200 hover:border-teal-500/30 hover:shadow-xl'}`}>
      
      {/* Image Area */}
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg ${categoryColors[article.category] || 'bg-gray-500'}`}>
            {article.category}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-6">
        
        {/* Meta Info */}
        <div className={`flex items-center gap-4 text-xs mb-4 font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          <div className="flex items-center gap-1">
            <Calendar size={12} /> {article.date}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} /> {article.readTime}
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-xl font-bold mb-3 line-clamp-2 transition-colors group-hover:text-teal-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {article.title}
        </h3>

        {/* Summary */}
        <p className={`text-sm line-clamp-3 mb-6 flex-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {article.summary}
        </p>

        {/* Read More Link */}
        <div className={`flex items-center gap-2 text-sm font-bold mt-auto transition-colors ${theme === 'dark' ? 'text-white group-hover:text-teal-400' : 'text-gray-900 group-hover:text-teal-600'}`}>
          Read Article <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
    </div>
  );
}