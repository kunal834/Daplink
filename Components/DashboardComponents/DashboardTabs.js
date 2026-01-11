'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Plus, X, Link as LinkIcon, GripVertical, Globe, Trash2,
  Scissors, Copy, ArrowRight, History,
  User, Image as ImageIcon, Smartphone, Check,
  ExternalLink, Zap, BarChart3, Users, Briefcase,
  Sticker, Download, Settings, RefreshCw
} from 'lucide-react';

import Link from 'next/link';

export const UrlShortenerTab = ({ isDarkMode, userID, links, setLinks }) => {
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
    const response = await axios.post('/api/addLink', {
      url: longUrl,
      customCode: alias,
      userId: userID,
    })
    console.log("Response:",response);
    if (response) {
      const newLink = {
        id: Date.now(),
        title: title || alias || 'Untitled Link',
        original: longUrl,
        short: `${window.location.origin}/${alias || response.data.code}`,
        active: true,
        clicks: 0,
        createdAt: new Date()
      };

      setLinks([newLink, ...links]);
      setIsLoading(false);

      // Reset and Close
      setLongUrl(''); setAlias(''); setTitle('');
      setIsAdding(false);
      toast.success("URL Shortened successfully!");
    } else {
      toast.error(response.data.error || "Failed to shorten URL.");
      setIsLoading(false);
    }
  };

  const deleteLink = (id) => setLinks(links.filter(l => l.id !== id));

  const toggleLinkActive = (id) => {
    setLinks(links.map(l => l.id === id ? { ...l, active: !l.active } : l));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* 1. Header Section (Identical to LinksTab) */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">URL Shortener</h2>
          <p className={`text-sm ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
            Create and manage trackable short links.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg transition-all active:scale-95 group ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20' : 'bg-black hover:bg-zinc-800 text-white shadow-zinc-500/20'}`}
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Create Short Link
          </button>
        )}
      </div>

      {/* 2. Add Form (Identical to LinksTab structure) */}
      {isAdding && (
        <div className={`rounded-3xl p-6 shadow-xl border animate-in slide-in-from-top-4 duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 shadow-none' : 'bg-white shadow-zinc-200/50 border-zinc-100 ring-1 ring-zinc-50'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">New Short Link</h3>
            <button onClick={() => setIsAdding(false)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleShorten} className="space-y-5">
            <div className="space-y-2">
              <label className={`text-xs font-bold ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>TITLE (OPTIONAL)</label>
              <input
                autoFocus
                type="text"
                placeholder="e.g., Marketing Campaign Q4"
                className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all text-sm font-medium outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 focus:border-indigo-500 text-white placeholder:text-zinc-600' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-900 placeholder:text-zinc-400'}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className={`text-xs font-bold ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>DESTINATION URL</label>
              <input
                type="url"
                placeholder="https://very-long-url.com/..."
                className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all text-sm font-medium outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 focus:border-indigo-500 text-white placeholder:text-zinc-600' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-900 placeholder:text-zinc-400'}`}
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className={`text-xs font-bold ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>CUSTOM ALIAS (PREMIUM FEATURE)</label>
              <div className="flex">
                <span className={`inline-flex items-center px-4 rounded-l-xl border border-r-0 text-sm font-bold ${isDarkMode ? 'bg-zinc-800 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-transparent text-zinc-500'}`}>{process.env.NEXT_PUBLIC_HOST}/</span>

                <input
                  type="text"
                  placeholder="my-link"
                  className={`flex-1 px-4 py-3.5 rounded-r-xl border-2 border-l-0 transition-all text-sm font-medium outline-none ${isDarkMode ? 'bg-zinc-950 border-zinc-800 focus:border-indigo-500 text-white placeholder:text-zinc-600' : 'bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-900 placeholder:text-zinc-400'}`}
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] flex justify-center items-center gap-2 ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20' : 'bg-zinc-900 hover:bg-black text-white shadow-zinc-900/10'}`}
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Create Short Link'}
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className={`px-6 py-3.5 border rounded-xl font-bold text-sm transition-colors ${isDarkMode ? 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900 text-zinc-400' : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-600'}`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. List Section (Identical to LinksTab) */}
      <div className="space-y-3">
        {links.length === 0 && !isAdding && (
          <div className={`text-center py-20 rounded-3xl border border-dashed transition-colors group cursor-pointer ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300'}`} onClick={() => setIsAdding(true)}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110 ${isDarkMode ? 'bg-zinc-800 text-zinc-600 group-hover:text-indigo-400' : 'bg-zinc-50 text-zinc-300 group-hover:text-indigo-400'}`}>
              <Scissors className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-lg mb-1">No short links yet</h3>
            <p className={`text-sm max-w-xs mx-auto ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
              Create your first short URL to start tracking clicks.
            </p>
          </div>
        )}

        {links.map((link) => (
          <div key={link._id} className={`rounded-2xl p-4 pl-3 shadow-sm border transition-all flex items-center gap-4 group ${isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200/60 hover:border-zinc-300 hover:shadow-md'}`}>

            {/* Icon / Copy Button (Replaces Grip) */}
            <button
              onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_HOST}/${link.shortCode}`, link._id)}
              className={`p-2 rounded-lg transition-colors shrink-0 ${copiedId === link._id ? 'bg-emerald-500 text-white' : (isDarkMode ? 'text-zinc-600 hover:bg-zinc-800 hover:text-white' : 'text-zinc-300 hover:text-zinc-600 hover:bg-zinc-50')}`}
            >
              {copiedId === link.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h4 className={`font-bold truncate text-sm flex items-center gap-2 ${!link.isActive && 'opacity-50'}`}>
                {link.title}
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-500'}`}>
                  {link.shortCode}
                </span>
              </h4>
              <div className={`flex items-center gap-1.5 text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                <Globe className="w-3 h-3" />
                <span className="truncate max-w-[200px]">{link.originalUrl}</span>
              </div>
            </div>

            {/* Actions Right */}
            <div className="flex items-center gap-3 pr-2">
              {/* Clicks Badge */}
              <div className={`text-xs font-bold px-2 py-1 rounded-md hidden sm:block ${isDarkMode ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-50 text-zinc-400'}`}>
                {link.clicks} clicks
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleLinkActive(link._id)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${link.isActive ? (isDarkMode ? 'bg-indigo-600' : 'bg-zinc-900') : (isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200')}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${link.isActive ? 'left-6' : 'left-1'}`} />
              </button>

              {/* Delete Button */}
              <button
                onClick={() => deleteLink(link._id)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-zinc-600 hover:text-red-400 hover:bg-red-900/20' : 'text-zinc-300 hover:text-red-500 hover:bg-red-50'}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BioPageTab = ({ isDarkMode, profile, updateProfile }) => (
  <div className="space-y-8 animate-in fade-in duration-300">
    <div><h2 className="text-2xl font-bold tracking-tight">Bio Page</h2><p className={`${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'} text-sm`}>Customize your public profile and themes.</p></div>
    <section>
      <div className={`rounded-3xl p-6 shadow-sm border space-y-6 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200/60'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-900'}`}><User className="w-4 h-4" /> Profile Details</h3>
        <div className="flex items-start gap-8 flex-col sm:flex-row">
          <div className={`w-28 h-28 rounded-3xl flex items-center justify-center overflow-hidden border-2 border-dashed relative group cursor-pointer transition-all shrink-0 ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-600 hover:border-indigo-500 hover:text-indigo-500' : 'bg-zinc-50 border-zinc-200 text-zinc-300 hover:border-indigo-500 hover:text-indigo-500'}`}>
            {profile.avatarUrl ? <img src={profile.avatarUrl} className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10" />}
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"><span className="text-xs font-bold mb-1">UPLOAD</span><span className="text-[10px] opacity-70">Max 5MB</span></div>
          </div>
          <div className="flex-1 space-y-5 w-full">
            <div className="space-y-2"><label className={`text-xs font-bold ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>DISPLAY NAME</label><input type="text" value={profile.title || ''} onChange={(e) => updateProfile('title', e.target.value)} placeholder="@username" className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all text-sm font-bold ${isDarkMode ? 'bg-zinc-950 border-zinc-800 focus:border-indigo-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900'}`} /></div>
            <div className="space-y-2"><label className={`text-xs font-bold ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>BIO</label><textarea value={profile.bio || ''} onChange={(e) => updateProfile('bio', e.target.value)} placeholder="Tell the world who you are..." rows="3" className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all text-sm resize-none font-medium ${isDarkMode ? 'bg-zinc-950 border-zinc-800 focus:border-indigo-500 text-white' : 'bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:bg-white'}`} /></div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-900'}`}><Smartphone className="w-4 h-4" /> Themes</h3>
      <div className="grid grid-cols-2 gap-5">
        {['modern', 'ocean', 'sunset', 'light'].map((t) => (
          <button key={t} onClick={() => updateProfile('theme', t)} className={`relative h-44 rounded-[2rem] border-4 transition-all overflow-hidden text-left p-6 flex flex-col justify-end group ${profile.theme === t ? 'border-indigo-500 ring-4 ring-indigo-500/10' : isDarkMode ? 'border-transparent hover:border-zinc-700 bg-zinc-900' : 'border-transparent hover:border-zinc-200 hover:shadow-lg shadow-sm'}`}>
            <div className={`absolute inset-0 transition-transform duration-700 group-hover:scale-110 ${t === 'modern' ? 'bg-zinc-900' : t === 'ocean' ? 'bg-gradient-to-br from-blue-900 to-indigo-900' : t === 'sunset' ? 'bg-gradient-to-br from-orange-900 via-red-800 to-rose-900' : 'bg-white border border-zinc-100'}`} />
            <div className="relative z-10"><span className={`font-bold capitalize text-xl block mb-1 ${t === 'light' ? 'text-zinc-900' : 'text-white'}`}>{t}</span><span className={`text-xs font-medium uppercase tracking-wider ${t === 'light' ? 'text-zinc-400' : 'text-white/60'}`}>{t === 'modern' ? 'Minimal' : t === 'light' ? 'Clean' : 'Gradient'}</span></div>
            {profile.theme === t && (<div className="absolute top-5 right-5 bg-white text-black rounded-full p-1.5 shadow-xl animate-in zoom-in"><Check className="w-4 h-4" strokeWidth={4} /></div>)}
          </button>
        ))}
      </div>
    </section>
  </div>
);

export const AnalyticsTab = ({ isDarkMode }) => (
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




export const MindsetTab = ({ isDarkMode }) => {
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

export const CommunityTab = ({ isDarkMode }) => {
  const communities = [
    { id: 1, name: "Web3 Design", members: "1.2k", image: "bg-blue-100 text-blue-600", isNew: true },
    { id: 2, name: "Digital Artists", members: "8.5k", image: "bg-purple-100 text-purple-600" },
    { id: 3, name: "Indie Hackers", members: "24k", image: "bg-green-100 text-green-600" },
    { id: 4, name: "Content Creators", members: "45k", image: "bg-rose-100 text-rose-600" },
  ];
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-start">
        <div><h2 className="text-2xl font-bold tracking-tight">Community Hub</h2><p className={`${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'} text-sm`}>Find your tribe and collaborate.</p></div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>1,204 Creators Online</div>
      </div>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
        <div className="relative z-10 max-w-md"><h3 className="text-2xl font-bold mb-2">Join the Creator Circle</h3><p className="text-indigo-100 text-sm mb-6 leading-relaxed">Exclusive access to brand deals, collaboration opportunities, and expert workshops.</p><Link href="/Explorepeoples" className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg">Explore Peoples</Link></div>
        <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 opacity-20"><Users className="w-64 h-64" /></div>
      </div>
      <div>
        <h3 className={`font-bold mb-4 px-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Trending Communities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communities.map((c) => (
            <div key={c.id} className={`p-5 rounded-2xl border transition-all group cursor-pointer relative overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-indigo-500' : 'bg-white border-zinc-200 hover:border-indigo-300 hover:shadow-md'}`}>
              {c.isNew && <span className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">NEW</span>}
              <div className="flex items-center gap-4 mb-4"><div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.image}`}><Users className="w-6 h-6" /></div><div><h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{c.name}</h4><p className="text-xs text-zinc-500">{c.members} members</p></div></div>
              <button className={`w-full py-2.5 rounded-lg border text-xs font-bold transition-colors ${isDarkMode ? 'border-zinc-700 text-zinc-400 group-hover:bg-white group-hover:text-black' : 'border-zinc-200 text-zinc-600 group-hover:bg-black group-hover:text-white group-hover:border-black'}`}>Join Group</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const QrCodeTab = ({ isDarkMode, profile }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div><h2 className="text-2xl font-bold tracking-tight">QR Code Studio</h2><p className={`${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'} text-sm`}>Share your profile in the physical world.</p></div>
    <div className={`rounded-[2rem] p-8 border shadow-sm flex flex-col items-center justify-center text-center ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
      <div className="bg-white p-4 rounded-3xl shadow-2xl border border-zinc-100 mb-8 transform hover:scale-105 transition-transform duration-500">
        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://daplink.app/${profile.username}&color=000000&bgcolor=ffffff`} alt="QR Code" className="w-48 h-48 rounded-lg mix-blend-multiply" />
      </div>
      <h3 className="text-xl font-bold mb-2">Scan to visit</h3><p className="text-zinc-500 text-sm mb-8">daplink.app/{profile.username}</p>
      <div className="flex items-center gap-3 w-full max-w-xs">
        <button className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-black text-white hover:bg-zinc-800'}`}><Download className="w-4 h-4" /> Download PNG</button>
        <button className={`px-4 py-3 rounded-xl font-bold text-sm transition-colors ${isDarkMode ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}>SVG</button>
      </div>
    </div>
  </div>
);

export const SettingsTab = ({ isDarkMode, profile }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div><h2 className="text-2xl font-bold tracking-tight">Settings</h2><p className={`${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'} text-sm`}>Manage your account and preferences.</p></div>
    <div className={`rounded-3xl border shadow-sm overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
      <div className={`p-8 border-b ${isDarkMode ? 'bg-zinc-800/30 border-zinc-800' : 'bg-zinc-50/30 border-zinc-100'}`}>
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl border shadow-inner ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-500' : 'bg-gradient-to-tr from-zinc-200 to-zinc-100 border-white text-zinc-400'}`}>{profile.username ? profile.username[0].toUpperCase() : 'U'}</div>
          <div><h3 className="font-bold text-lg">My Account</h3><p className="text-xs text-zinc-500 font-medium mt-1">Free Plan · <span className="text-indigo-500 cursor-pointer hover:underline">Upgrade</span></p></div>
        </div>
      </div>
      <div className="p-8 space-y-8">
        <div>
          <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase">Username</label>
          <div className="flex group">
            <span className={`inline-flex items-center px-4 rounded-l-xl border border-r-0 text-sm font-medium transition-colors ${isDarkMode ? 'bg-zinc-950 border-zinc-700 text-zinc-500 group-hover:bg-zinc-900' : 'bg-zinc-50 border-zinc-200 text-zinc-500 group-hover:bg-zinc-100'}`}>daplink.app/</span>
            <input type="text" value={profile.username} disabled className={`flex-1 min-w-0 block w-full px-4 py-3 rounded-r-xl border font-medium sm:text-sm cursor-not-allowed ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-500' : 'bg-white border-zinc-200 text-zinc-400'}`} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase">Notifications</label>
          <div className="space-y-3">
            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}><span className={`text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Email Updates</span><div className={`w-10 h-6 rounded-full relative ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`}><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div></label>
            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}><span className={`text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Weekly Analytics Report</span><div className="w-10 h-6 bg-black rounded-full relative"><div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div></label>
          </div>
        </div>
        <div className={`pt-6 border-t flex items-center justify-between ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <div><p className="font-bold text-sm">Delete Account</p><p className="text-xs text-zinc-500 mt-1">This action cannot be undone.</p></div>
          <button className={`text-xs font-bold px-5 py-2.5 rounded-xl transition-colors border ${isDarkMode ? 'text-red-400 hover:bg-red-900/20 border-red-900/30' : 'text-red-600 hover:bg-red-50 border-red-100'}`}>Delete Account</button>
        </div>
      </div>
    </div>
  </div>
);

export const ReviewTab = ({ isDarkMode }) => {
  // State for form fields
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    clientname: '',
    profession: '',
    message: ''
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    const { data } = await axios.post(`/api/Review`, {
      ...formData,  //need of Spread Operator Open the formData box, take the items OUT, and put them directly here.
      rating: rating
    })

    console.log(data)
    if (data.success) {
      toast.success("Review Submitted successfully")
      setFormData()
      setRating(0);

      setFormData({ clientname: '', profession: '', message: '' });


    } else {
      toast.error("unable to submit review")
    }

    // Reset form

  };

  return (
    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
      <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
        Add a Testimonial
      </h2>
      <p className={`mb-8 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
        Manually add a review to showcase on your DapLink public profile.
      </p>

      <form onSubmit={handleSubmit} className="max-w-xl">

        {/* 1. Star Rating Section */}
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform active:scale-90"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={(hoverRating || rating) >= star ? "#F59E0B" : "none"}
                  stroke={isDarkMode ? "#52525B" : "#D4D4D8"}
                  strokeWidth="1.5"
                  className="w-8 h-8 transition-colors duration-200"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.545.044.77.77.356 1.145l-4.192 3.805a.562.562 0 00-.172.527l1.206 5.371c.14.623-.538 1.057-1.009.79l-4.813-2.766a.562.562 0 00-.568 0l-4.813 2.766c-.47.267-1.15-.167-1.01-.79l1.206-5.371a.562.562 0 00-.172-.527l-4.192-3.805c-.414-.375-.19-1.101.356-1.145l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-amber-500 text-sm mt-1 font-medium">
              {rating === 5 ? "Excellent!" : rating === 4 ? "Great!" : rating === 3 ? "Average" : "Poor"}
            </p>
          )}
        </div>

        {/* 2. Personal Details (Name & Profession) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Name Input */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Client Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sarah Jenkins"
              value={formData.clientname}
              onChange={(e) => setFormData({ ...formData, clientname: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl outline-none transition-all border ${isDarkMode
                ? 'bg-zinc-800/50 border-zinc-700 text-white focus:border-indigo-500 placeholder:text-zinc-600'
                : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-indigo-500 placeholder:text-zinc-400'
                }`}
            />
          </div>

          {/* Profession Input */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Profession / Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Designer"
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl outline-none transition-all border ${isDarkMode
                ? 'bg-zinc-800/50 border-zinc-700 text-white focus:border-indigo-500 placeholder:text-zinc-600'
                : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-indigo-500 placeholder:text-zinc-400'
                }`}
            />
          </div>
        </div>

        {/* 3. Review Text Area */}
        <div className="mb-8">
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
            Review Message
          </label>
          <textarea
            required
            rows="4"
            placeholder="Write the feedback about the service here..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl outline-none transition-all resize-none border ${isDarkMode
              ? 'bg-zinc-800/50 border-zinc-700 text-white focus:border-indigo-500 placeholder:text-zinc-600'
              : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-indigo-500 placeholder:text-zinc-400'
              }`}
          ></textarea>
        </div>

        {/* 4. Submit Button */}
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
        >
          <span>Submit Review</span>
        </button>

      </form>
    </div>
  );
};

