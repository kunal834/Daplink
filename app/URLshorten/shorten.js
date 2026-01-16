'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Plus, X, Copy, Trash2, Check,
  Globe, BarChart3, QrCode, Sparkles,
  ArrowUpRight, Zap
} from 'lucide-react';

const UrlShortenerTab = ({ isDarkMode, userID, links, setLinks }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Form Inputs
  const [longUrl, setLongUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [title, setTitle] = useState('');

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!longUrl) return;
    setIsLoading(true);

    try {
      const response = await axios.post('/api/addLink', {
        url: longUrl,
        customCode: alias,
        userId: userID,
      });

      if (response) {
        const newLink = {
          _id: Date.now(),
          title: title || alias || 'Untitled Link',
          originalUrl: longUrl,
          shortCode: alias || response.data.code,
          isActive: true,
          clicks: 0,
          createdAt: new Date()
        };

        const currentLinks = Array.isArray(links) ? links : [];
        setLinks([newLink, ...currentLinks]);
        
        setIsLoading(false);
        setLongUrl(''); setAlias(''); setTitle('');
        setIsAdding(false);
        toast.success("Link successfully shortened!");
      }
    } catch (error) {
      toast.error("Failed to shorten URL.");
      setIsLoading(false);
    }
  };

  const deleteLink = (id) => {
    if (Array.isArray(links)) {
      setLinks(links.filter(l => l._id !== id));
    }
  };

  const toggleLinkActive = (id) => {
    if (Array.isArray(links)) {
      setLinks(links.map(l => l._id === id ? { ...l, isActive: !l.isActive } : l));
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getFavicon = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* 1. Header with Stats Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Zap className={`w-8 h-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} fill="currentColor" fillOpacity={0.2} />
            Smart Links
          </h2>
          <p className={`mt-2 text-base ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Manage your shortened URLs, track performance, and generate QR codes.
          </p>
        </div>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className={`
              group relative overflow-hidden px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95
              ${isDarkMode 
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-500/20' 
                : 'bg-zinc-900 text-white shadow-zinc-900/20'}
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Create New Link
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
          </button>
        )}
      </div>

      {/* 2. Advanced Add Form - IMPROVED VISIBILITY & INTERACTIVITY */}
      {isAdding && (
        <div className={`
          relative overflow-hidden rounded-3xl p-8 border animate-in slide-in-from-top-4 duration-500
          ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800 backdrop-blur-xl' : 'bg-white border-zinc-200 shadow-2xl shadow-zinc-200/50'}
        `}>
          {/* Form Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                <Sparkles className="w-5 h-5 text-amber-400" />
                New Short Link
              </h3>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Paste your long URL below to create a trackable short link.</p>
            </div>
            <button onClick={() => setIsAdding(false)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleShorten} className="space-y-6">
            
            {/* Long URL Input (Prominent & Interactive) */}
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Destination URL</label>
              <div className={`
                group flex items-center px-4 py-4 rounded-2xl border-2 transition-all duration-200 ease-in-out
                focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10
                ${isDarkMode 
                  ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-white' 
                  : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-900'}
              `}>
                <Globe className={`w-5 h-5 mr-3 shrink-0 transition-colors ${isDarkMode ? 'text-zinc-500 group-focus-within:text-indigo-400' : 'text-zinc-400 group-focus-within:text-indigo-500'}`} />
                <input
                  autoFocus
                  type="url"
                  placeholder="https://super-long-website-url.com/products/..."
                  className={`w-full bg-transparent outline-none font-medium text-lg placeholder:opacity-50 ${isDarkMode ? 'placeholder:text-zinc-600' : 'placeholder:text-zinc-400'}`}
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Reference Title</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Campaign"
                  className={`
                    w-full px-5 py-3.5 rounded-2xl border-2 outline-none font-medium transition-all duration-200
                    focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
                    ${isDarkMode 
                      ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-white placeholder:text-zinc-600' 
                      : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-900 placeholder:text-zinc-400'}
                  `}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Alias Input (Fixed Background Issue) */}
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Custom Alias</label>
                <div className={`
                  flex rounded-2xl border-2 overflow-hidden transition-all duration-200
                  focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10
                  ${isDarkMode 
                    ? 'border-zinc-800 bg-zinc-950 hover:border-zinc-700' 
                    : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'}
                `}>
                  <div className={`px-4 py-3.5 text-sm font-bold flex items-center border-r-2 select-none ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-500'}`}>
                    {`daplink.short/`}
                  </div>
                  <input
                    type="text"
                    placeholder="custom-name"
                    className={`flex-1 px-4 py-3.5 bg-transparent outline-none font-bold text-sm ${isDarkMode ? 'text-white placeholder:text-zinc-600' : 'text-zinc-900 placeholder:text-zinc-400'}`}
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
               <button
                type="submit"
                disabled={isLoading}
                className={`
                  flex-1 py-4 rounded-xl font-bold text-base shadow-lg transition-transform active:scale-[0.98] flex justify-center items-center gap-2
                  ${isDarkMode 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20' 
                    : 'bg-black hover:bg-zinc-800 text-white shadow-zinc-900/20'}
                `}
              >
                {isLoading ? <span className="animate-spin text-xl">◌</span> : 'Shorten Link'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Link List Cards */}
      <div className="space-y-4">
        {(!Array.isArray(links) || links.length === 0) && !isAdding && (
          <div className="text-center py-24">
             <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${isDarkMode ? 'bg-zinc-900 text-zinc-700' : 'bg-zinc-100 text-zinc-300'}`}>
                <Globe className="w-10 h-10" />
             </div>
             <h3 className={`text-xl font-bold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>No links created yet</h3>
          </div>
        )}

        {Array.isArray(links) && links.map((link) => (
          <div 
            key={link._id} 
            className={`
              group relative flex flex-col sm:flex-row items-center gap-4 p-4 rounded-3xl border transition-all duration-300
              ${isDarkMode 
                ? 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700' 
                : 'bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/40'}
              ${!link.isActive ? 'opacity-60 grayscale-[0.5]' : ''}
            `}
          >
            
            {/* A. Favicon & Identity */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className={`
                relative w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 overflow-hidden
                ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-100'}
              `}>
                {getFavicon(link.originalUrl) ? (
                  <img src={getFavicon(link.originalUrl)} alt="icon" className="w-8 h-8 object-contain" />
                ) : (
                  <Globe className="w-6 h-6 opacity-30" />
                )}
                {/* Active Indicator */}
                {link.isActive && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-950"></span>
                )}
              </div>
              
              <div className="min-w-0 flex-1 sm:hidden">
                 <h4 className={`font-bold truncate ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{link.title}</h4>
                 <div className="text-xs opacity-60 truncate">{link.originalUrl}</div>
              </div>
            </div>

            {/* B. Content Middle */}
            <div className="flex-1 min-w-0 text-center sm:text-left hidden sm:block">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-bold text-base truncate max-w-[200px] lg:max-w-md ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  {link.title}
                </h4>
                <a 
                  href={link.short} 
                  target="_blank" 
                  rel="noreferrer"
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-mono flex items-center gap-1 hover:underline ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-500'}`}
                >
                  <ArrowUpRight className="w-2.5 h-2.5" />
                  /{link.shortCode}
                </a>
              </div>
              <div className={`flex items-center gap-4 text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                <span className="flex items-center gap-1 truncate max-w-[250px]">
                  {link.originalUrl}
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-500/30"></span>
                <span>{new Date(link.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* C. Actions & Stats */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0 border-dashed border-zinc-700/20">
              
              {/* Click Stat */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-bold">{link.clicks}</span>
              </div>

              <div className="h-6 w-px bg-zinc-500/20 mx-1 hidden sm:block"></div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_HOST}/${link.shortCode}`, link._id)}
                  className={`p-2.5 rounded-xl transition-all ${copiedId === link._id ? 'bg-emerald-500 text-white' : (isDarkMode ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900')}`}
                  title="Copy Link"
                >
                  {copiedId === link._id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'}`}
                  title="Show QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>

                {/* Switcher */}
                <button
                  onClick={() => toggleLinkActive(link._id)}
                  className={`
                    ml-2 w-10 h-6 rounded-full relative transition-colors duration-300 border-2
                    ${link.isActive 
                      ? (isDarkMode ? 'bg-indigo-600 border-indigo-600' : 'bg-black border-black') 
                      : (isDarkMode ? 'bg-transparent border-zinc-700' : 'bg-zinc-200 border-zinc-200')}
                  `}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${link.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                
                 {/* Delete */}
                 <button
                  onClick={() => deleteLink(link._id)}
                  className={`ml-1 p-2.5 rounded-xl transition-all group-hover:opacity-100 sm:opacity-0 ${isDarkMode ? 'hover:bg-red-500/10 text-zinc-600 hover:text-red-500' : 'hover:bg-red-50 text-zinc-400 hover:text-red-600'}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default UrlShortenerTab;