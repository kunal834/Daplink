'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  User, ImageIcon, Smartphone, Check, ExternalLink, Zap, 
  BarChart3, Sticker, Download, Settings, Star, Camera,
  TrendingUp, MousePointerClick, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

// ==========================================
// 1. BIO PAGE TAB
// ==========================================
export const BioPageTab = ({ isDarkMode, profile, updateProfile }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div>
      <h2 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Bio Page</h2>
      <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Craft your digital identity and choose your aesthetic.</p>
    </div>

    <section>
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-lg border transition-all ${isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-rose-500 opacity-50"></div>
        
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
          <User className="w-4 h-4" /> Profile Details
        </h3>
        
        <div className="flex flex-col sm:flex-row items-start gap-8">
          <div className={`w-32 h-32 rounded-3xl flex items-center justify-center overflow-hidden border-2 border-dashed relative group cursor-pointer transition-all shrink-0 ${
            isDarkMode ? 'bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:border-indigo-500 hover:text-indigo-400' : 'bg-zinc-50 border-zinc-300 text-zinc-400 hover:border-indigo-500 hover:text-indigo-600'
          }`}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Avatar" />
            ) : (
              <Camera className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" />
            )}
            <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
              <span className="text-xs font-bold tracking-wider mb-1">UPLOAD</span>
              <span className="text-[10px] font-medium opacity-70">Max 5MB</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-5 w-full">
            <div className="space-y-2">
              <label className={`text-xs font-bold tracking-wider ml-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>DISPLAY NAME</label>
              <input 
                type="text" 
                value={profile.title || ''} 
                onChange={(e) => updateProfile('title', e.target.value)} 
                placeholder="@username" 
                className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-semibold shadow-sm ${
                  isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600' : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white'
                }`} 
              />
            </div>
            <div className="space-y-2">
              <label className={`text-xs font-bold tracking-wider ml-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>BIO</label>
              <textarea 
                value={profile.bio || ''} 
                onChange={(e) => updateProfile('bio', e.target.value)} 
                placeholder="Tell the world who you are..." 
                rows="3" 
                className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm resize-none font-medium shadow-sm ${
                  isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600' : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white'
                }`} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
        <Smartphone className="w-4 h-4" /> Themes
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['modern', 'ocean', 'sunset', 'light'].map((t) => (
          <button 
            key={t} 
            onClick={() => updateProfile('theme', t)} 
            className={`relative h-48 rounded-2xl border-2 transition-all duration-300 overflow-hidden text-left p-5 flex flex-col justify-end group ${
              profile.theme === t 
                ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-500/10' 
                : isDarkMode ? 'border-zinc-800 hover:border-zinc-600' : 'border-zinc-200 hover:border-zinc-300 hover:shadow-md'
            }`}
          >
            <div className={`absolute inset-0 transition-transform duration-700 group-hover:scale-105 ${
              t === 'modern' ? 'bg-zinc-900' : 
              t === 'ocean' ? 'bg-linear-to-br from-blue-900 via-indigo-900 to-slate-900' : 
              t === 'sunset' ? 'bg-linear-to-br from-orange-600 via-red-600 to-purple-900' : 
              'bg-zinc-50 border border-zinc-200'
            }`} />
            
            <div className="relative z-10 w-full backdrop-blur-md bg-black/20 p-3 rounded-xl border border-white/10">
              <span className={`font-bold capitalize text-lg block ${t === 'light' ? 'text-zinc-900' : 'text-white'}`}>{t}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 block ${t === 'light' ? 'text-zinc-500' : 'text-white/70'}`}>
                {t === 'modern' ? 'Minimal' : t === 'light' ? 'Clean' : 'Gradient'}
              </span>
            </div>
            
            {profile.theme === t && (
              <div className="absolute top-4 right-4 bg-indigo-500 text-white rounded-full p-1.5 shadow-xl animate-in zoom-in duration-300">
                <Check className="w-3.5 h-3.5" strokeWidth={4} />
              </div>
            )}
          </button>
        ))}
      </div>
    </section>
  </div>
);

// ==========================================
// 2. ANALYTICS TAB
// ==========================================
export const AnalyticsTab = ({ isDarkMode }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div>
      <h2 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Analytics</h2>
      <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Track your growth and understand your audience.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Views Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 ${
        isDarkMode ? 'bg-zinc-900/80 border-zinc-800 hover:shadow-lg hover:shadow-indigo-500/5' : 'bg-white border-zinc-200 hover:shadow-xl hover:shadow-zinc-200/50'
      }`}>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors"></div>
        <div className="absolute top-6 right-6 p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform duration-500">
          <TrendingUp className="w-6 h-6" />
        </div>
        
        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Lifetime Views</p>
        <h3 className={`text-5xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>1,204</h3>
        
        <div className="flex items-center gap-2 mt-6">
          <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-500/20">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m3 17 6-6 4 4 8-8"/><path d="M17 7h4v4"/></svg>
            +12%
          </div>
          <span className={`text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>vs last week</span>
        </div>
      </div>

      {/* Clicks Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 ${
        isDarkMode ? 'bg-zinc-900/80 border-zinc-800 hover:shadow-lg hover:shadow-purple-500/5' : 'bg-white border-zinc-200 hover:shadow-xl hover:shadow-zinc-200/50'
      }`}>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors"></div>
        <div className="absolute top-6 right-6 p-3 rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform duration-500">
          <MousePointerClick className="w-6 h-6" />
        </div>
        
        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Lifetime Clicks</p>
        <h3 className={`text-5xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>843</h3>
        
        <div className="flex items-center gap-2 mt-6">
          <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-500/20">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m3 17 6-6 4 4 8-8"/><path d="M17 7h4v4"/></svg>
            +8%
          </div>
          <span className={`text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>vs last week</span>
        </div>
      </div>
    </div>

    {/* Chart Section */}
    <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200'}`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className={`font-bold flex items-center gap-2 text-lg ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
          <BarChart3 className="w-5 h-5 text-indigo-500" /> Traffic Activity
        </h3>
        <select className={`text-sm rounded-xl px-4 py-2 font-semibold outline-none cursor-pointer border transition-colors ${
          isDarkMode ? 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:border-zinc-600 focus:border-indigo-500' : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300 focus:border-indigo-500'
        }`}>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      </div>
      
      <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 relative">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          {[1,2,3,4].map(i => <div key={i} className={`w-full h-px ${isDarkMode ? 'bg-zinc-600' : 'bg-zinc-300'}`}></div>)}
        </div>

        {[30, 45, 25, 60, 75, 50, 80, 40, 70, 90, 65, 85].map((h, i) => (
          <div key={i} className={`flex-1 transition-all duration-500 rounded-t-md relative group z-10 ${
            isDarkMode ? 'bg-zinc-800 hover:bg-indigo-500' : 'bg-zinc-200 hover:bg-indigo-500'
          }`} style={{ height: `${h}%` }}>
            <div className={`absolute -top-12 left-1/2 -translate-x-1/2 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 font-bold shadow-xl translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap bg-zinc-900`}>
              {h * 10} views
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-zinc-900"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ==========================================
// 3. MINDSET TAB
// ==========================================
export const MindsetTab = ({ isDarkMode }) => {
  const mindsetQuotes = [
    { id: 1, text: "Build in silence, let success make the noise.", author: "@alex_creator", theme: isDarkMode ? "bg-amber-500/10 border-amber-500/20 text-amber-200" : "bg-amber-50 border-amber-100 text-amber-900" },
    { id: 2, text: "Consistency is the only currency that matters.", author: "@sarah_j", theme: isDarkMode ? "bg-blue-500/10 border-blue-500/20 text-blue-200" : "bg-blue-50 border-blue-100 text-blue-900" },
    { id: 3, text: "Your network is your net worth.", author: "@hustle_daily", theme: isDarkMode ? "bg-rose-500/10 border-rose-500/20 text-rose-200" : "bg-rose-50 border-rose-100 text-rose-900" },
    { id: 4, text: "Ship fast, learn faster.", author: "@dev_guru", theme: isDarkMode ? "bg-purple-500/10 border-purple-500/20 text-purple-200" : "bg-purple-50 border-purple-100 text-purple-900" },
  ];
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Mindset Wall</h2>
        <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Daily vision and values. A sticky-note wall for your soul.</p>
      </div>

      <div className={`p-2 pl-4 rounded-2xl border flex items-center gap-3 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/50 ${
        isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <input 
          type="text" 
          placeholder="Add your daily affirmation..." 
          className={`flex-1 bg-transparent outline-none font-medium text-sm py-3 ${isDarkMode ? 'text-white placeholder:text-zinc-600' : 'text-zinc-900 placeholder:text-zinc-400'}`} 
        />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors shadow-md">
          Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mindsetQuotes.map((quote) => (
          <div 
            key={quote.id} 
            className={`p-6 sm:p-8 rounded-3xl border shadow-sm backdrop-blur-sm transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 min-h-45 flex flex-col justify-between relative overflow-hidden group ${quote.theme}`}
          >
            <Sticker className="w-8 h-8 opacity-20 mb-4 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
            <p className="font-bold text-xl leading-snug tracking-tight relative z-10">&ldquo;{quote.text}&rdquo;</p>
            <p className="text-xs font-bold opacity-60 mt-6 tracking-widest uppercase">{quote.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. QR CODE TAB
// ==========================================
export const QrCodeTab = ({ isDarkMode, profile }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div>
      <h2 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>QR Studio</h2>
      <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Share your profile seamlessly in the physical world.</p>
    </div>

    <div className={`rounded-3xl p-8 sm:p-12 border shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden ${
      isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200'
    }`}>
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg bg-linear-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none"></div>

      <div className="relative group perspective-1000 mb-8">
        <div className={`absolute -inset-1 bg-linear-to-r from-indigo-500 via-purple-500 to-rose-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>
        <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-zinc-100 transform transition-transform duration-500 group-hover:scale-[1.02]">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://daplink.app/${profile.username || 'user'}&color=000000&bgcolor=ffffff`} 
            alt="QR Code" 
            className="w-48 h-48 rounded-lg" 
          />
        </div>
      </div>

      <h3 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Scan to connect</h3>
      <p className={`text-sm font-medium mb-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>daplink.app/{profile.username || 'user'}</p>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
        <button className="flex-1 w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02]">
          <Download className="w-4 h-4" /> Download PNG
        </button>
        <button className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm transition-all border ${
          isDarkMode ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700' : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
        }`}>
          SVG
        </button>
      </div>
    </div>
  </div>
);

// ==========================================
// 5. SETTINGS TAB
// ==========================================
export const SettingsTab = ({ isDarkMode, profile }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div>
      <h2 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Settings</h2>
      <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Manage your account, plan, and preferences.</p>
    </div>

    <div className={`rounded-3xl border shadow-lg overflow-hidden ${isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200'}`}>
      
      {/* Plan Header */}
      <div className={`p-6 sm:p-8 border-b ${isDarkMode ? 'bg-zinc-800/30 border-zinc-800' : 'bg-zinc-50/50 border-zinc-100'}`}>
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl border shadow-inner ${
            isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'
          }`}>
            {(profile.username || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h3 className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>My Account</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Free Plan</span>
              <span className="w-1 h-1 rounded-full bg-zinc-500"></span>
              <span className="text-sm font-bold text-indigo-500 cursor-pointer hover:text-indigo-400 transition-colors">Upgrade</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Username */}
        <div>
          <label className={`block text-xs font-bold tracking-widest mb-3 uppercase ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Username</label>
          <div className="flex group shadow-sm rounded-xl">
            <span className={`inline-flex items-center px-4 rounded-l-xl border border-r-0 text-sm font-medium transition-colors ${
              isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-300 text-zinc-500'
            }`}>
              daplink.app/
            </span>
            <input 
              type="text" 
              value={profile.username || ''} 
              disabled 
              className={`flex-1 min-w-0 block w-full px-4 py-3 rounded-r-xl border font-semibold sm:text-sm cursor-not-allowed transition-colors ${
                isDarkMode ? 'bg-zinc-900/50 border-zinc-800 text-zinc-500' : 'bg-white border-zinc-300 text-zinc-400'
              }`} 
            />
          </div>
        </div>

        {/* Notifications */}
        <div>
          <label className={`block text-xs font-bold tracking-widest mb-3 uppercase ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Notifications</label>
          <div className="space-y-3">
            {[
              { label: "Email Updates", active: true },
              { label: "Weekly Analytics Report", active: false }
            ].map((item, i) => (
              <label key={i} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                isDarkMode ? 'border-zinc-800 hover:bg-zinc-800/50' : 'border-zinc-200 hover:bg-zinc-50'
              }`}>
                <span className={`text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>{item.label}</span>
                <div className={`w-11 h-6 rounded-full relative transition-colors ${
                  item.active ? 'bg-indigo-500' : isDarkMode ? 'bg-zinc-700' : 'bg-zinc-300'
                }`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${item.active ? 'left-6' : 'left-1'}`}></div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <div>
            <p className={`font-bold text-base flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              <AlertCircle className="w-4 h-4 text-red-500" /> Delete Account
            </p>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>Permanently remove your data. This action cannot be undone.</p>
          </div>
          <button className={`text-sm font-bold px-6 py-3 rounded-xl transition-colors border shadow-sm ${
            isDarkMode ? 'text-red-400 hover:bg-red-500/10 border-red-500/20' : 'text-red-600 hover:bg-red-50 border-red-200'
          }`}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// 6. REVIEW TAB
// ==========================================
export const ReviewTab = ({ isDarkMode }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({ clientname: '', profession: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/Review`, { ...formData, rating });
      if (data.success) {
        toast.success("Review Submitted successfully");
        setRating(0);
        setFormData({ clientname: '', profession: '', message: '' });
      } else {
        toast.error("Unable to submit review");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Add Testimonial</h2>
        <p className={`mt-1 text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Manually curate and add reviews to your public profile.</p>
      </div>

      <div className={`p-6 sm:p-8 rounded-3xl border shadow-lg ${isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <form onSubmit={handleSubmit} className="max-w-2xl">
          
          {/* Star Rating Section */}
          <div className="mb-8 p-6 rounded-2xl border flex flex-col items-center sm:items-start text-center sm:text-left shadow-sm bg-linear-to-b from-transparent to-black/5 dark:to-white/5">
            <label className={`block text-xs font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Select Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star 
                    className={`w-10 h-10 transition-colors duration-300 ${
                      (hoverRating || rating) >= star 
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                        : isDarkMode ? 'text-zinc-700' : 'text-zinc-300'
                    }`} 
                    strokeWidth={1.5}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className={`ml-4 text-sm font-bold px-3 py-1.5 rounded-lg ${
                  isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
                }`}>
                  {rating === 5 ? "Excellent!" : rating === 4 ? "Great!" : rating === 3 ? "Average" : "Poor"}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className={`block text-xs font-bold tracking-widest uppercase mb-2 ml-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Client Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Jenkins"
                value={formData.clientname}
                onChange={(e) => setFormData({ ...formData, clientname: e.target.value })}
                className={`w-full px-4 py-3.5 rounded-xl outline-none transition-all border focus:ring-2 focus:ring-indigo-500/50 shadow-sm font-medium text-sm ${
                  isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600' : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white'
                }`}
              />
            </div>
            <div>
              <label className={`block text-xs font-bold tracking-widest uppercase mb-2 ml-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Profession
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Designer"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className={`w-full px-4 py-3.5 rounded-xl outline-none transition-all border focus:ring-2 focus:ring-indigo-500/50 shadow-sm font-medium text-sm ${
                  isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600' : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white'
                }`}
              />
            </div>
          </div>

          <div className="mb-8">
            <label className={`block text-xs font-bold tracking-widest uppercase mb-2 ml-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Review Message
            </label>
            <textarea
              required
              rows="4"
              placeholder="Write the feedback about the service here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`w-full px-4 py-3.5 rounded-xl outline-none transition-all resize-none border focus:ring-2 focus:ring-indigo-500/50 shadow-sm font-medium text-sm ${
                isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600' : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white'
              }`}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-10 py-3.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};