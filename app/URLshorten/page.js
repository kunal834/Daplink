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
            {`Create and manage trackable short links.`}
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
              <label className={`text-xs font-bold ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>{`TITLE (OPTIONAL)`}</label>
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
              <label className={`text-xs font-bold ml-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>{`CUSTOM ALIAS (PREMIUM FEATURE)`}</label>
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

export default UrlShortenerTab;