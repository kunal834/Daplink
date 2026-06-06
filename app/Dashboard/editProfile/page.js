"use client";

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Check, Globe, GripVertical, Layout, Palette,
  Plus, Save, SlidersHorizontal, Sparkles, Trash2,
  Upload, UserCircle, MapPin, Sparkle, Camera,
  Share2, Vote, Mic
} from 'lucide-react';
import { useAuth } from '@/context/Authenticate';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const PRESETS = [
  {
    id: 'classic',
    name: 'Midnight',
    bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700',
    text: 'text-white',
    defaultAccent: '#8b5cf6',
    defaultBg: '#0f172a',
    font: 'Inter, system-ui, sans-serif',
  },
  {
    id: 'light',
    name: 'Paper',
    bg: 'bg-gradient-to-br from-zinc-100 via-slate-100 to-zinc-200',
    text: 'text-zinc-900',
    defaultAccent: '#0ea5e9',
    defaultBg: '#f4f4f5',
    font: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  {
    id: 'modern',
    name: 'Electric',
    bg: 'bg-gradient-to-br from-violet-700 via-fuchsia-600 to-blue-600',
    text: 'text-white',
    defaultAccent: '#ec4899',
    defaultBg: '#3b0764',
    font: "'Poppins', system-ui, sans-serif",
  },
  {
    id: 'sunset',
    name: 'Sunset',
    bg: 'bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600',
    text: 'text-white',
    defaultAccent: '#f97316',
    defaultBg: '#7c2d12',
    font: "'Nunito Sans', system-ui, sans-serif",
  },
  {
    id: 'forest',
    name: 'Forest',
    bg: 'bg-gradient-to-br from-emerald-700 via-green-700 to-lime-700',
    text: 'text-white',
    defaultAccent: '#22c55e',
    defaultBg: '#14532d',
    font: "'Manrope', system-ui, sans-serif",
  },
  {
    id: 'ocean',
    name: 'Ocean',
    bg: 'bg-gradient-to-br from-cyan-700 via-blue-700 to-indigo-800',
    text: 'text-white',
    defaultAccent: '#06b6d4',
    defaultBg: '#082f49',
    font: "'DM Sans', system-ui, sans-serif",
  },
];

const ACCENTS = ['#8b5cf6', '#0ea5e9', '#22c55e', '#f97316', '#ec4899', '#ef4444'];
const BG_STYLES = ['soft', 'mesh', 'spotlight'];
const BTN_STYLES = ['solid', 'glass', 'outline'];
const FONTS = [
  { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { label: 'Plus Jakarta', value: "'Plus Jakarta Sans', system-ui, sans-serif" },
  { label: 'Poppins', value: "'Poppins', system-ui, sans-serif" },
  { label: 'Manrope', value: "'Manrope', system-ui, sans-serif" },
  { label: 'Nunito Sans', value: "'Nunito Sans', system-ui, sans-serif" },
  { label: 'DM Sans', value: "'DM Sans', system-ui, sans-serif" },
];
const DEFAULT_VIBE = {
  accent: ACCENTS[0],
  backgroundColor: '#0f172a',
  bgStyle: 'soft',
  buttonStyle: 'solid',
  radius: 18,
  blur: 10,
  softText: true,
  font: FONTS[0].value,
  customBackground: '',
  layoutStyle: 'bento',
  cardStyle: 'glass',
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || min));
const mergeVibe = (source = {}) => ({
  ...DEFAULT_VIBE,
  ...source,
  radius: clamp(source.radius ?? DEFAULT_VIBE.radius, 8, 30),
  blur: clamp(source.blur ?? DEFAULT_VIBE.blur, 0, 24),
});

const hexToRgb = (hex) => {
  const cleaned = String(hex || '').replace('#', '');
  if (!/^[0-9A-Fa-f]{6}$/.test(cleaned)) return null;
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  };
};

const getContrastTextColor = (bgHex, fallback = '#ffffff') => {
  const rgb = hexToRgb(bgHex);
  if (!rgb) return fallback;
  const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return yiq >= 150 ? '#18181b' : '#ffffff';
};

function PhonePreview({ profile, links, preset, vibe, aiConfig, avatarBorder, statusGlow }) {
  const active = links.filter((l) => l.active && l.title.trim());
  const textColor = getContrastTextColor(vibe.backgroundColor, preset.id === 'light' ? '#18181b' : '#ffffff');

  const overlayClass =
    vibe.bgStyle === 'mesh'
      ? 'bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.26),transparent_42%),radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.18),transparent_44%)]'
      : vibe.bgStyle === 'spotlight'
        ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.33),transparent_52%)]'
        : 'bg-gradient-to-b from-transparent to-black/10';

  const buttonStyle =
    vibe.buttonStyle === 'glass'
      ? {
          backgroundColor: 'rgba(255,255,255,0.14)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: textColor,
          backdropFilter: `blur(${vibe.blur}px)`,
        }
      : vibe.buttonStyle === 'outline'
        ? {
            backgroundColor: 'transparent',
            border: `1px solid ${vibe.accent}`,
            color: textColor,
          }
        : {
            backgroundColor: vibe.accent,
            border: '1px solid transparent',
            color: '#fff',
            boxShadow: `0 8px 20px ${vibe.accent}45`,
          };

  const getCardStyle = (styleType) => {
    const isDark = textColor === '#ffffff';
    if (styleType === 'flat') {
      return {
        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        border: '1px solid rgba(120,120,120,0.15)',
        borderRadius: `${vibe.radius}px`,
        color: textColor,
      };
    }
    if (styleType === 'glow') {
      return {
        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
        border: `1.5px solid ${vibe.accent}`,
        borderRadius: `${vibe.radius}px`,
        boxShadow: `0 0 15px ${vibe.accent}25`,
        color: textColor,
      };
    }
    // Default 'glass'
    return {
      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
      backdropFilter: `blur(${vibe.blur}px)`,
      border: '1px solid rgba(120,120,120,0.1)',
      borderRadius: `${vibe.radius}px`,
      color: textColor,
    };
  };

  return (
    <div className="relative mx-auto h-[620px] w-[305px] overflow-hidden rounded-[3rem] border-[10px] border-zinc-900 bg-black shadow-2xl transition-all duration-500">
      <div 
        className="absolute inset-0 z-0 transition-colors duration-500" 
        style={{ backgroundColor: vibe.backgroundColor }} 
      />
      {!vibe.customBackground ? (
        <div className={`absolute inset-0 ${preset.bg} opacity-85 transition-all duration-500`} />
      ) : (
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            backgroundImage: `url(${vibe.customBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.75,
          }}
        />
      )}
      <div className={`absolute inset-0 ${overlayClass} z-0`} />
      
      <div className="absolute inset-0 z-20 pointer-events-none bg-linear-to-tr from-transparent via-white/[0.05] to-white/[0.12] mix-blend-overlay" />

      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 absolute left-4" />
        <div className="w-10 h-1 bg-zinc-900 rounded-full" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center overflow-y-auto p-5 pt-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ fontFamily: vibe.font }}>
        
        {/* Render layouts dynamically based on vibe.layoutStyle */}
        {vibe.layoutStyle === 'bento' && (
          <div className="w-full space-y-3 mt-4 animate-fade-in">
            {/* Bento Profile Card */}
            <div style={getCardStyle(vibe.cardStyle)} className="w-full p-4 flex flex-col items-center justify-center text-center">
              <div className={`relative mb-2 shrink-0 ${
                avatarBorder === 'emerald-glow' ? 'p-[2px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-green-500 animate-pulse' :
                avatarBorder === 'aurora' ? 'p-[2px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500' :
                avatarBorder === 'neon-sunset' ? 'p-[2px] bg-gradient-to-tr from-orange-500 via-rose-500 to-fuchsia-600' :
                avatarBorder === 'cyberpunk' ? 'p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' :
                'border border-white/20'
              } rounded-full`}>
                <div className="h-12 w-12 rounded-full overflow-hidden bg-zinc-900">
                  <img src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || 'user')}`} alt="avatar" className="h-full w-full object-cover" />
                </div>
                {statusGlow && (
                  <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-zinc-950 ${
                    statusGlow === 'online' ? 'bg-emerald-500' :
                    statusGlow === 'busy' ? 'bg-rose-500' :
                    statusGlow === 'away' ? 'bg-amber-500' : 'bg-zinc-500'
                  }`} />
                )}
              </div>
              <h2 className="text-xs font-black truncate">@{profile.name || 'user'}</h2>
              <p className="text-[9px] opacity-75 mt-1 line-clamp-2 max-w-[200px]">{profile.bio || 'Digital Creator'}</p>
            </div>

            {/* Bento Stats Card */}
            <div style={getCardStyle(vibe.cardStyle)} className="w-full py-2 px-3 flex items-center justify-around text-[10px] font-extrabold uppercase tracking-wide">
              <div className="flex flex-col items-center">
                <span>1.4k</span>
                <span className="text-[7px] opacity-65 font-bold">Followers</span>
              </div>
              <div className="w-px h-5 bg-zinc-700/35" />
              <div className="flex flex-col items-center">
                <span>350</span>
                <span className="text-[7px] opacity-65 font-bold">Following</span>
              </div>
            </div>

            {/* Bento Links Grid */}
            <div className="grid grid-cols-2 gap-2">
              {active.map((link, idx) => (
                <div 
                  key={link.id} 
                  style={{ ...getCardStyle(vibe.cardStyle), ...buttonStyle }} 
                  className={`p-3 text-center text-[9px] font-extrabold rounded-xl truncate flex items-center justify-center ${
                    idx % 3 === 0 ? 'col-span-2 py-3.5 text-xs' : ''
                  }`}
                >
                  {link.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {vibe.layoutStyle === 'split' && (
          <div className="w-full space-y-3 mt-4 animate-fade-in">
            {/* Split Top Sticky Profile Card */}
            <div style={getCardStyle(vibe.cardStyle)} className="w-full p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 border border-white/10">
                <img src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || 'user')}`} alt="avatar" className="h-full w-full object-cover" />
              </div>
              <div className="text-left min-w-0">
                <h2 className="text-xs font-black truncate">@{profile.name || 'user'}</h2>
                <p className="text-[9px] opacity-75 line-clamp-2 mt-0.5">{profile.bio || 'Digital Creator'}</p>
              </div>
            </div>

            {/* Scrollable Links Portion */}
            <div className="w-full space-y-2.5 max-h-[300px] overflow-y-auto pr-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {active.map((link) => (
                <div 
                  key={link.id} 
                  style={{ ...getCardStyle(vibe.cardStyle), ...buttonStyle, borderRadius: `${vibe.radius}px` }} 
                  className="w-full py-3.25 px-4 text-center text-xs font-bold truncate transition-all border"
                >
                  {link.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {vibe.layoutStyle === 'minimal' && (
          <div style={getCardStyle(vibe.cardStyle)} className="w-full p-5 mt-6 flex flex-col items-center shadow-lg border backdrop-blur-xl animate-fade-in">
            <div className="relative mb-3">
              <div className="h-12 w-12 rounded-full overflow-hidden border border-white/10 bg-zinc-900">
                <img src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || 'user')}`} alt="avatar" className="h-full w-full object-cover" />
              </div>
              {statusGlow && (
                <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border border-zinc-950 ${
                  statusGlow === 'online' ? 'bg-emerald-500' :
                  statusGlow === 'busy' ? 'bg-rose-500' : 'bg-zinc-500'
                }`} />
              )}
            </div>
            <h2 className="text-sm font-black" style={{ color: textColor }}>@{profile.name || 'user'}</h2>
            <p className="text-[9px] opacity-75 text-center mt-1 mb-4 max-w-[200px] line-clamp-2" style={{ color: textColor }}>{profile.bio || 'Digital Creator'}</p>

            <div className="w-full space-y-2">
              {active.map((link) => (
                <div 
                  key={link.id} 
                  style={{ ...buttonStyle, borderRadius: '999px' }} 
                  className="w-full py-2.5 px-4 text-xs font-bold text-center border truncate transition-all hover:scale-[1.01]"
                >
                  {link.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {(vibe.layoutStyle === 'classic' || !vibe.layoutStyle) && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <div className="relative mt-6 mb-4">
              <div className={`h-20 w-20 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${
                avatarBorder === 'emerald-glow' ? 'p-[3px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-green-500 animate-pulse' :
                avatarBorder === 'aurora' ? 'p-[3px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' :
                avatarBorder === 'neon-sunset' ? 'p-[3px] bg-gradient-to-tr from-orange-500 via-rose-500 to-fuchsia-600 shadow-[0_0_15px_rgba(244,63,94,0.5)]' :
                avatarBorder === 'cyberpunk' ? 'p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-[0_0_15px_rgba(236,72,153,0.5)]' :
                'border-2 border-white/20'
              }`}>
                <div className="h-full w-full rounded-full overflow-hidden bg-zinc-850">
                  <img
                    src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || 'user')}`}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              {statusGlow && (
                <span className={`absolute bottom-0 right-0 h-4.5 w-4.5 rounded-full border-[3px] border-zinc-950 transition-all ${
                  statusGlow === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' :
                  statusGlow === 'busy' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' :
                  statusGlow === 'away' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' :
                  'bg-zinc-500'
                }`} />
              )}
            </div>
            
            <h2 className="mb-1 text-lg font-black tracking-tight" style={{ color: textColor }}>
              {profile.name ? `@${profile.name.replace('@', '')}` : 'Your Name'}
            </h2>
            
            {profile.location && (
              <div className="flex items-center gap-1 mb-3 opacity-80" style={{ color: textColor }}>
                <MapPin className="w-3 h-3 text-indigo-400" />
                <span className="text-[10px] font-bold tracking-wide uppercase">{profile.location}</span>
              </div>
            )}

            <p className={`mb-6 px-4 text-center text-xs leading-relaxed max-w-[240px] ${vibe.softText ? 'opacity-75' : 'opacity-95'}`} style={{ color: textColor }}>
              {profile.bio || 'Tell the world who you are...'}
            </p>

            <div className="w-full space-y-3 px-1">
              {active.map((link) => (
                <motion.div
                  layout
                  key={link.id}
                  className="w-full cursor-pointer px-4 py-3.25 text-center text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ ...buttonStyle, borderRadius: `${vibe.radius}px` }}
                >
                  {link.title}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-8 text-[9px] font-extrabold tracking-widest uppercase pb-4" style={{ color: `${textColor}70` }}>
          DAPLINK PREVIEW
        </div>

        {aiConfig?.aiEnabled && (
          <div 
            className="absolute bottom-5 right-5 z-40 p-3 rounded-2xl bg-indigo-600 text-white shadow-xl flex items-center justify-center border border-white/20 hover:scale-105 transition-transform"
            title="Chat with AI Twin"
          >
            <Sparkles className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [tab, setTab] = useState('links');
  const [profile, setProfile] = useState({ name: '', bio: '', avatar: '', location: '' });
  const [links, setLinks] = useState([]);
  const [draggedLinkId, setDraggedLinkId] = useState(null);
  const [preset, setPreset] = useState(PRESETS[0]);
  const [vibe, setVibe] = useState(mergeVibe());
  const [message, setMessage] = useState('');
  const daplink = user?.daplinkID;

  // AI Twin States
  const [aiConfig, setAiConfig] = useState({
    aiEnabled: false,
    aiPrompt: "Hi there! I'm an AI assistant. How can I help you today?",
    aiContext: "",
    aiFaqs: [],
  });
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  // Dynamic Avatar & Post States
  const [statusGlow, setStatusGlow] = useState('online');
  const [avatarBorder, setAvatarBorder] = useState('classic');
  const [postType, setPostType] = useState('text');
  const [postContent, setPostContent] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [audioUrl, setAudioUrl] = useState('');
  const [postStatus, setPostStatus] = useState('');

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, idx) => idx !== index));
    }
  };

  const handlePollOptionChange = (index, value) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      setPostStatus("Post content is required");
      return;
    }
    try {
      setPostStatus("Publishing post...");
      const payload = {
        type: postType,
        content: postContent.trim()
      };
      if (postType === 'poll') {
        const cleanedOptions = pollOptions.filter(o => o.trim());
        if (cleanedOptions.length < 2) {
          setPostStatus("At least 2 poll options are required");
          return;
        }
        payload.pollOptions = cleanedOptions;
      } else if (postType === 'audio') {
        if (!audioUrl.trim()) {
          setPostStatus("Audio URL is required");
          return;
        }
        payload.audioUrl = audioUrl.trim();
      }

      const res = await axios.post('/api/posts', payload);
      if (res.data.success) {
        setPostStatus("Post published successfully!");
        setPostContent('');
        setPollOptions(['', '']);
        setAudioUrl('');
        setTimeout(() => setPostStatus(''), 3000);
      } else {
        setPostStatus(res.data.message || "Failed to publish post");
      }
    } catch (err) {
      console.error(err);
      setPostStatus(err.response?.data?.message || "Failed to publish post");
    }
  };

  const ui = isDark
    ? {
        text: 'text-white',
        muted: 'text-zinc-500',
        panel: 'border-zinc-800 bg-zinc-900/60 backdrop-blur-md shadow-lg',
        input: 'border-zinc-800 bg-zinc-950 text-white placeholder:text-zinc-600 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10',
        activeTab: 'bg-white text-zinc-950 shadow-md',
        tab: 'text-zinc-400 hover:text-white',
        border: 'border-zinc-800/80',
      }
    : {
        text: 'text-zinc-900',
        muted: 'text-zinc-500',
        panel: 'border-zinc-200 bg-white/80 backdrop-blur-md shadow-sm',
        input: 'border-zinc-200/80 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:ring-2 focus:ring-zinc-900/5',
        activeTab: 'bg-zinc-900 text-white shadow-sm',
        tab: 'text-zinc-500 hover:text-zinc-900',
        border: 'border-zinc-200/70',
      };

  useEffect(() => {
    if (!daplink) return;
    const dbPreset = PRESETS.find((p) => p.id === daplink.theme) || PRESETS[0];
    const mappedLinks = Array.isArray(daplink.links)
      ? daplink.links.map((l, idx) => ({
          id: `${idx + 1}`,
          title: l.linktext || '',
          url: l.link || '',
          active: true,
        }))
      : [];

    setPreset(dbPreset);
    setVibe(
      mergeVibe({
        accent: dbPreset.defaultAccent,
        backgroundColor: dbPreset.defaultBg,
        font: dbPreset.font,
        ...(daplink.themeConfig || {}),
      })
    );
    setProfile({
      name: daplink.handle || '',
      bio: daplink.script || '',
      avatar: daplink.profile || '',
      location: daplink.location || '',
    });
    setLinks(mappedLinks.length ? mappedLinks : [{ id: '1', title: 'My Link', url: '', active: true }]);

    // Map AI Config from DB
    setAiConfig({
      aiEnabled: daplink.aiConfig?.aiEnabled ?? false,
      aiPrompt: daplink.aiConfig?.aiPrompt ?? "Hi there! I'm an AI assistant. How can I help you today?",
      aiContext: daplink.aiConfig?.aiContext ?? "",
      aiFaqs: Array.isArray(daplink.aiConfig?.aiFaqs) ? daplink.aiConfig.aiFaqs : [],
    });
    setStatusGlow(daplink.statusGlow || 'online');
    setAvatarBorder(daplink.avatarBorder || 'classic');
  }, [daplink]);

  const mutation = useMutation({
    mutationFn: async (payload) => axios.put('/api/Updatedetails', payload),
    onMutate: () => {
      setMessage('Publishing...');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daplink', user?.daplinkID?._id || user?._id] });
      setMessage('Changes published!');
      setTimeout(() => setMessage(''), 2500);
    },
    onError: (error) => {
      setMessage(error?.response?.data?.message || 'Failed to publish');
    },
  });

  const activeLinks = useMemo(() => links.filter((l) => l.active).length, [links]);

  const publishChanges = () => {
    mutation.mutate({
      handle: profile.name,
      script: profile.bio,
      profile: profile.avatar,
      location: profile.location,
      theme: preset.id,
      themeConfig: vibe,
      links: links.map((l) => ({ title: l.title, url: l.url })),
      aiConfig: aiConfig,
      statusGlow,
      avatarBorder,
    });
  };

  const addLink = () => setLinks((prev) => [...prev, { id: String(Date.now()), title: 'New Link', url: '', active: true }]);
  const updateLink = (id, key, value) => setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: value } : l)));
  const removeLink = (id) => setLinks((prev) => prev.filter((l) => l.id !== id));
  const toggleLink = (id) => setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l)));
  const reorderLinks = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;
    setLinks((prev) => {
      const fromIndex = prev.findIndex((l) => l.id === fromId);
      const toIndex = prev.findIndex((l) => l.id === toId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleDragStart = (id) => (e) => {
    setDraggedLinkId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (targetId) => (e) => {
    e.preventDefault();
    const sourceId = draggedLinkId || e.dataTransfer.getData('text/plain');
    reorderLinks(sourceId, targetId);
    setDraggedLinkId(null);
  };

  const handleDragEnd = () => setDraggedLinkId(null);

  const onAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfile((p) => ({ ...p, avatar: String(reader.result || '') }));
    reader.readAsDataURL(file);
  };

  const onThemeBackgroundUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage('Please upload an image file');
      return;
    }
    if (file.size > 1024 * 1024) {
      setMessage('Theme background must be under 1MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setVibe((v) => ({ ...v, customBackground: String(reader.result || '') }));
      setMessage('Background image loaded');
      setTimeout(() => setMessage(''), 1800);
    };
    reader.readAsDataURL(file);
  };

  if (authLoading) return <div className={`flex h-64 items-center justify-center ${ui.muted}`}>Loading Profile...</div>;

  return (
    <div className={`flex flex-col gap-10 xl:flex-row ${ui.text} animate-in fade-in duration-500`}>
      <div className="flex-1 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-black tracking-tight ${ui.text}`}>Digital Bio Canvas</h1>
            <p className={`text-sm mt-1 font-semibold ${ui.muted}`}>Design your custom aesthetic and share it globally.</p>
          </div>
          
          <button
            onClick={publishChanges}
            disabled={mutation.isPending}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3.25 text-xs font-extrabold transition-all duration-300 shadow-md ${
              isDark 
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/10' 
                : 'bg-zinc-950 text-white hover:bg-black shadow-zinc-900/15'
            } disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
          >
            {mutation.isPending ? 'Publishing...' : 'Publish Changes'}
            <Save size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className={`flex w-fit flex-wrap gap-1.5 rounded-2xl border p-1.5 ${ui.panel}`}>
          {[
            { id: 'links', icon: Layout, label: `Blocks (${activeLinks})` },
            { id: 'appearance', icon: Palette, label: 'Appearance' },
            { id: 'profile', icon: UserCircle, label: 'Profile Detail' },
            { id: 'feed', icon: Share2, label: 'Manage Feed' },
            { id: 'aitwin', icon: Sparkles, label: 'AI Digital Twin' },
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold relative transition-all duration-300 cursor-pointer ${
                  isSelected ? ui.activeTab : ui.tab
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {tab === 'links' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <button 
                  onClick={addLink} 
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-4.5 font-bold transition-colors cursor-pointer hover:border-indigo-500/50 hover:text-indigo-400 ${ui.border} ${ui.muted}`}
                >
                  <Plus size={16} />
                  Add Custom Link Block
                </button>

                <div className="space-y-3">
                  {links.map((link) => (
                    <motion.div
                      layout
                      key={link.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop(link.id)}
                      className={`flex items-center gap-4 rounded-2xl border p-4.5 transition-all duration-300 ${ui.panel} ${draggedLinkId === link.id ? 'ring-2 ring-indigo-500/50 scale-[0.99] opacity-70' : ''}`}
                    >
                      <button
                        type="button"
                        draggable
                        onDragStart={handleDragStart(link.id)}
                        onDragEnd={handleDragEnd}
                        className={`cursor-grab active:cursor-grabbing p-1 rounded-lg hover:bg-zinc-800/10 dark:hover:bg-white/5 transition-colors ${ui.muted}`}
                        aria-label="Drag to reorder block"
                        title="Drag to reorder"
                      >
                        <GripVertical size={16} />
                      </button>

                      <div className="flex-1 space-y-2 min-w-0">
                        <input
                          value={link.title}
                          onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                          className={`w-full rounded-xl border px-3 py-2 text-xs font-bold outline-none transition-all ${ui.input}`}
                          placeholder="Link Text"
                        />
                        <div className="flex items-center gap-2">
                          <Globe size={13} className={ui.muted} />
                          <input
                            value={link.url}
                            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                            className={`w-full rounded-xl border px-3 py-1.75 text-[11px] font-semibold outline-none transition-all ${ui.input}`}
                            placeholder="Destination URL (https://...)"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={() => toggleLink(link.id)} 
                        className={`relative h-6 w-11 rounded-full cursor-pointer transition-colors duration-300 shrink-0 ${
                          link.active ? 'bg-indigo-600 shadow-md shadow-indigo-600/20' : isDark ? 'bg-zinc-800' : 'bg-zinc-300'
                        }`}
                      >
                        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 ${link.active ? 'left-6' : 'left-1'}`} />
                      </button>

                      <button 
                        onClick={() => removeLink(link.id)} 
                        className={`p-2 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className={`rounded-3xl border p-6 space-y-6 ${ui.panel}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-inherit">
                  <div className="relative w-22 h-22 rounded-3xl overflow-hidden group border-2 border-dashed border-zinc-700/50 flex items-center justify-center shrink-0">
                    <img
                      src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || 'user')}`}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 backdrop-blur-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Camera size={20} className="text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={onAvatarUpload} />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Avatar & Visual Identity</h3>
                    <p className={`text-xs mt-1 leading-relaxed ${ui.muted}`}>Upload a PNG, JPG, or SVG. Dicebear placeholder will generate automatically based on your handle if none is provided.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`block text-[10px] font-bold uppercase tracking-widest ml-1 ${ui.muted}`}>Display Handle</label>
                      <input
                        value={profile?.name}
                        disabled={true}
                        className={`w-full rounded-2xl border px-4 py-3 text-xs font-semibold cursor-not-allowed leading-none opacity-60 ${ui.input}`}
                        placeholder="Display Handle"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`block text-[10px] font-bold uppercase tracking-widest ml-1 ${ui.muted}`}>Location</label>
                      <input
                        value={profile.location}
                        onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                        className={`w-full rounded-2xl border px-4 py-3 text-xs font-semibold leading-none ${ui.input}`}
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-[10px] font-bold uppercase tracking-widest ml-1 ${ui.muted}`}>Biography</label>
                    <textarea
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                      className={`w-full resize-none rounded-2xl border px-4 py-3 text-xs font-semibold leading-relaxed ${ui.input}`}
                      placeholder="Write a tiny description of your work..."
                    />
                  </div>
                </div>

                {/* Custom Avatar Ring and status selector */}
                <div className="pt-6 border-t border-inherit space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Avatar Identity Rings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`block text-[10px] font-bold uppercase tracking-widest ml-1 ${ui.muted}`}>Status Glow Ring</label>
                      <select
                        value={statusGlow}
                        onChange={(e) => setStatusGlow(e.target.value)}
                        className={`w-full rounded-2xl border px-4 py-3 text-xs font-semibold leading-none cursor-pointer ${ui.input}`}
                      >
                        <option value="online">Online (Emerald Glow)</option>
                        <option value="busy">Busy (Ruby Glow)</option>
                        <option value="away">Away (Amber Glow)</option>
                        <option value="offline">Offline (Muted Gray)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className={`block text-[10px] font-bold uppercase tracking-widest ml-1 ${ui.muted}`}>Border Glow Gradient</label>
                      <select
                        value={avatarBorder}
                        onChange={(e) => setAvatarBorder(e.target.value)}
                        className={`w-full rounded-2xl border px-4 py-3 text-xs font-semibold leading-none cursor-pointer ${ui.input}`}
                      >
                        <option value="classic">Classic (Standard Ring)</option>
                        <option value="emerald-glow">Emerald Glow (Pulse Verde)</option>
                        <option value="aurora">Aurora Glow (Purple/Cyan Mesh)</option>
                        <option value="neon-sunset">Neon Sunset (Pink/Orange Glow)</option>
                        <option value="cyberpunk">Cyberpunk Glow (Yellow/Purple Neon)</option>
                      </select>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {tab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className={`relative overflow-hidden rounded-3xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${ui.panel}`}>
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl" style={{ background: `${vibe.accent}55` }} />
                  <div className="relative z-10">
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${ui.muted}`}>Vibe Studio</p>
                    <h3 className="mt-1 text-lg font-black tracking-tight">Interactive Themes</h3>
                  </div>
                  <span className={`rounded-full border px-4 py-1 text-xs font-extrabold shadow-sm bg-white/5 backdrop-blur-xs w-fit ${ui.border}`}>{preset.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {PRESETS.map((p) => {
                    const isSelected = preset.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPreset(p);
                          setVibe((v) =>
                            mergeVibe({
                              ...v,
                              accent: p.defaultAccent,
                              backgroundColor: p.defaultBg,
                              font: p.font,
                            })
                          );
                        }}
                        className={`rounded-3xl border p-2 text-left transition-all duration-300 cursor-pointer ${
                          isSelected 
                            ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg' 
                            : isDark ? 'border-zinc-800 hover:border-zinc-700' : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className={`h-22 rounded-2xl ${p.bg} shadow-inner`} />
                        <div className="mt-2.5 flex items-center justify-between px-1.5 pb-0.5">
                          <span className="text-[11px] font-extrabold uppercase tracking-wide">{p.name}</span>
                          {isSelected && <Check size={12} className="text-indigo-500" strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Layout Templates Studio */}
                <div className={`rounded-3xl border p-5 ${ui.panel}`}>
                  <div className="mb-4 flex items-center gap-2">
                    <Layout size={14} className="text-teal-400" />
                    <p className="text-xs font-bold uppercase tracking-wider">Layout Template Studio</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-5">
                    {[
                      { id: 'classic', name: 'Standard List', desc: 'Classic centered vertical flow.' },
                      { id: 'bento', name: 'Bento Grid', desc: 'Modern dashboard grid structure.' },
                      { id: 'split', name: 'Split Screen', desc: 'Side-by-side profile and links.' },
                      { id: 'minimal', name: 'Minimalist Card', desc: 'Single floating translucent card.' }
                    ].map((lay) => {
                      const isSel = vibe.layoutStyle === lay.id;
                      return (
                        <button
                          key={lay.id}
                          type="button"
                          onClick={() => setVibe((v) => ({ ...v, layoutStyle: lay.id }))}
                          className={`rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-28 relative hover:scale-[1.01] ${
                            isSel 
                              ? 'border-indigo-500 ring-4 ring-indigo-500/10 bg-indigo-500/5' 
                              : isDark ? 'border-zinc-800 hover:border-zinc-700 bg-black/10' : 'border-zinc-200 hover:border-zinc-300 bg-white'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider block">{lay.name}</span>
                            <span className={`text-[8px] leading-tight block mt-1 ${ui.muted}`}>{lay.desc}</span>
                          </div>
                          {isSel && (
                            <span className="absolute bottom-3 right-3 h-4 w-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[8px] font-black">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-4 border-t border-inherit">
                    <div className="space-y-2">
                      <label className={`block text-[10px] font-bold uppercase tracking-widest ml-1 ${ui.muted}`}>Card Border & Panel Styling Preset</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'glass', name: 'Glassmorphic' },
                          { id: 'flat', name: 'Flat Solid' },
                          { id: 'glow', name: 'Neon Glow' }
                        ].map((c) => {
                          const isSel = vibe.cardStyle === c.id;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setVibe((v) => ({ ...v, cardStyle: c.id }))}
                              className={`rounded-xl border py-2.5 text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                                isSel 
                                  ? 'border-indigo-500 text-indigo-500 bg-indigo-500/5' 
                                  : isDark ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-850' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                              }`}
                            >
                              {c.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className={`rounded-3xl border p-5 ${ui.panel}`}>
                    <div className="mb-4 flex items-center gap-2">
                      <Sparkles size={14} className="text-amber-400" />
                      <p className="text-xs font-bold uppercase tracking-wider">Accent Palette</p>
                    </div>
                    <div className="mb-4 flex items-center gap-3">
                      <input
                        type="color"
                        value={vibe.accent}
                        onChange={(e) => setVibe((v) => ({ ...v, accent: e.target.value }))}
                        className="h-11 w-14 cursor-pointer rounded-xl border border-zinc-700/50 bg-transparent p-1 shadow-sm"
                      />
                      <input
                        value={vibe.accent}
                        onChange={(e) => setVibe((v) => ({ ...v, accent: e.target.value }))}
                        className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none ${ui.input}`}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ACCENTS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setVibe((v) => ({ ...v, accent: c }))}
                          className={`h-7 w-7 rounded-full cursor-pointer transition-all ${vibe.accent === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : 'hover:scale-105'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className={`rounded-3xl border p-5 ${ui.panel}`}>
                    <div className="mb-4 flex items-center gap-2">
                      <Palette size={14} className="text-indigo-400" />
                      <p className="text-xs font-bold uppercase tracking-wider">Background Customizer</p>
                    </div>
                    <div className="mb-4 flex items-center gap-3">
                      <input
                        type="color"
                        value={vibe.backgroundColor}
                        onChange={(e) => setVibe((v) => ({ ...v, backgroundColor: e.target.value }))}
                        className="h-11 w-14 cursor-pointer rounded-xl border border-zinc-700/50 bg-transparent p-1 shadow-sm"
                      />
                      <input
                        value={vibe.backgroundColor}
                        onChange={(e) => setVibe((v) => ({ ...v, backgroundColor: e.target.value }))}
                        className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none ${ui.input}`}
                      />
                    </div>
                    <div className="flex gap-2">
                      <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider bg-white/5 hover:bg-white/10 transition-colors ${ui.border}`}>
                        <Upload size={12} />
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={onThemeBackgroundUpload} />
                      </label>
                      <button
                        type="button"
                        onClick={() => setVibe((v) => ({ ...v, customBackground: '' }))}
                        className={`rounded-xl border px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider bg-white/5 hover:bg-white/10 transition-colors cursor-pointer ${ui.border}`}
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className={`rounded-3xl border p-5 ${ui.panel}`}>
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkle size={13} className="text-teal-400" />
                      <p className="text-xs font-bold uppercase tracking-wider">Cover Styling Mode</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {BG_STYLES.map((b) => {
                        const isSel = vibe.bgStyle === b;
                        return (
                          <button
                            key={b}
                            onClick={() => setVibe((v) => ({ ...v, bgStyle: b }))}
                            className={`rounded-xl border py-2.5 text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                              isSel 
                                ? 'border-indigo-500 text-indigo-500 bg-indigo-500/5' 
                                : isDark ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                            }`}
                          >
                            {b}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={`rounded-3xl border p-5 ${ui.panel}`}>
                    <div className="mb-3 flex items-center gap-2">
                      <UserCircle size={14} className="text-rose-450" />
                      <p className="text-xs font-bold uppercase tracking-wider">Typography Family</p>
                    </div>
                    <select
                      value={vibe.font}
                      onChange={(e) => setVibe((v) => ({ ...v, font: e.target.value }))}
                      className={`w-full rounded-xl border px-3 py-2.5 text-xs font-semibold outline-none cursor-pointer ${ui.input}`}
                    >
                      {FONTS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={`rounded-3xl border p-5 ${ui.panel}`}>
                    <div className="mb-3 flex items-center gap-2">
                      <Layout size={14} className="text-amber-400" />
                      <p className="text-xs font-bold uppercase tracking-wider">Block Button Styling</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {BTN_STYLES.map((b) => {
                        const isSel = vibe.buttonStyle === b;
                        return (
                          <button
                            key={b}
                            onClick={() => setVibe((v) => ({ ...v, buttonStyle: b }))}
                            className={`rounded-xl border py-2.5 text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                              isSel 
                                ? 'border-indigo-500 text-indigo-500 bg-indigo-500/5' 
                                : isDark ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                            }`}
                          >
                            {b}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={`rounded-3xl border p-5 ${ui.panel}`}>
                    <div className="mb-4 flex items-center gap-2">
                      <SlidersHorizontal size={14} className="text-indigo-400" />
                      <p className="text-xs font-bold uppercase tracking-wider">Fine Tune Parameters</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className={`text-[10px] font-extrabold uppercase tracking-wider ${ui.muted}`}>Border Radius ({vibe.radius}px)</label>
                        </div>
                        <input
                          type="range"
                          min={8}
                          max={30}
                          value={vibe.radius}
                          onChange={(e) => setVibe((v) => ({ ...v, radius: Number(e.target.value) }))}
                          className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className={`text-[10px] font-extrabold uppercase tracking-wider ${ui.muted}`}>Glass Panel Blur ({vibe.blur}px)</label>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={24}
                          value={vibe.blur}
                          onChange={(e) => setVibe((v) => ({ ...v, blur: Number(e.target.value) }))}
                          className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === 'feed' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Feed Composer Card */}
                <div className={`rounded-3xl border p-6 space-y-5 ${ui.panel}`}>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-indigo-500" />
                      Publish Interactive Post
                    </h3>
                    <p className={`text-xs ${ui.muted}`}>Create rich updates, interactive polls, or voice note files to engage your community feed.</p>
                  </div>

                  {/* Post Type Selector */}
                  <div className="flex gap-2 p-1 rounded-xl bg-black/10 dark:bg-white/5 border border-zinc-800/10 dark:border-white/5 w-fit">
                    {[
                      { id: 'text', icon: Layout, label: 'Text Card' },
                      { id: 'poll', icon: Vote, label: 'Interactive Poll' },
                      { id: 'audio', icon: Mic, label: 'Voice Note' },
                    ].map((type) => {
                      const Icon = type.icon;
                      const active = postType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setPostType(type.id)}
                          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold cursor-pointer transition-all ${
                            active 
                              ? 'bg-indigo-600 text-white shadow-sm' 
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <Icon size={12} />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Post Content Input */}
                  <div className="space-y-2">
                    <label className={`block text-[10px] font-bold uppercase tracking-widest ml-1 ${ui.muted}`}>Post Message</label>
                    <textarea
                      rows={3}
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className={`w-full resize-none rounded-2xl border px-4 py-3 text-xs font-semibold leading-relaxed ${ui.input}`}
                      placeholder={
                        postType === 'poll' ? "Ask a question to your audience..." :
                        postType === 'audio' ? "Describe your voice memo..." :
                        "Share an update, link, or announcement with your followers..."
                      }
                    />
                  </div>

                  {/* Type Specific Fields */}
                  {postType === 'poll' && (
                    <div className="space-y-3 p-4.5 rounded-2xl border border-dashed border-zinc-700/50">
                      <div className="flex items-center justify-between">
                        <label className={`block text-[10px] font-bold uppercase tracking-widest ${ui.muted}`}>Poll Options (2-4)</label>
                        {pollOptions.length < 4 && (
                          <button
                            type="button"
                            onClick={handleAddPollOption}
                            className="text-[10px] font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1 hover:text-indigo-300"
                          >
                            <Plus size={10} /> Add Option
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {pollOptions.map((opt, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              value={opt}
                              onChange={(e) => handlePollOptionChange(index, e.target.value)}
                              className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold ${ui.input}`}
                              placeholder={`Option ${index + 1}`}
                            />
                            {pollOptions.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePollOption(index)}
                                className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {postType === 'audio' && (
                    <div className="space-y-3 p-4.5 rounded-2xl border border-dashed border-zinc-700/50">
                      <label className={`block text-[10px] font-bold uppercase tracking-widest ${ui.muted}`}>Audio File URL</label>
                      <div className="flex items-center gap-2">
                        <Mic size={14} className="text-zinc-500" />
                        <input
                          value={audioUrl}
                          onChange={(e) => setAudioUrl(e.target.value)}
                          className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold ${ui.input}`}
                          placeholder="https://example.com/voice-note.mp3"
                        />
                      </div>
                      <p className={`text-[10px] ${ui.muted}`}>Provide a link to an audio file (mp3, wav, ogg) to display an interactive audio card.</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleCreatePost}
                    className="w-full py-3.25 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-indigo-600/10 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Publish to Feed
                  </button>

                  {postStatus && (
                    <div className={`text-center text-xs font-bold py-1 ${
                      postStatus.includes("successfully") ? "text-emerald-500" : "text-amber-400"
                    }`}>
                      {postStatus}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {tab === 'aitwin' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* AI Enable Toggle Card */}
                <div className={`rounded-3xl border p-6 flex items-center justify-between ${ui.panel}`}>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      AI Digital Twin Assistant
                    </h3>
                    <p className={`text-xs ${ui.muted}`}>Enable a real-time AI assistant trained on your bio and links to chat with visitors.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setAiConfig(prev => ({ ...prev, aiEnabled: !prev.aiEnabled }))} 
                    className={`relative h-6 w-11 rounded-full cursor-pointer transition-colors duration-300 shrink-0 ${
                      aiConfig.aiEnabled ? 'bg-indigo-600 shadow-md shadow-indigo-600/20' : isDark ? 'bg-zinc-800' : 'bg-zinc-300'
                    }`}
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 ${aiConfig.aiEnabled ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {/* AI Settings Form */}
                <div className={`rounded-3xl border p-6 space-y-5 ${ui.panel}`}>
                  <div className="space-y-2">
                    <label className={`block text-[10px] font-bold uppercase tracking-widest ml-1 ${ui.muted}`}>AI Welcome Message</label>
                    <input
                      value={aiConfig.aiPrompt}
                      onChange={(e) => setAiConfig(prev => ({ ...prev, aiPrompt: e.target.value }))}
                      className={`w-full rounded-2xl border px-4 py-3 text-xs font-semibold leading-none ${ui.input}`}
                      placeholder="e.g. Hi! I'm Kunal's AI assistant. Ask me anything!"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-[10px] font-bold uppercase tracking-widest ml-1 ${ui.muted}`}>AI Knowledge Base / Persona Context</label>
                    <textarea
                      rows={5}
                      value={aiConfig.aiContext}
                      onChange={(e) => setAiConfig(prev => ({ ...prev, aiContext: e.target.value }))}
                      className={`w-full resize-none rounded-2xl border px-4 py-3 text-xs font-semibold leading-relaxed ${ui.input}`}
                      placeholder="Write details about your services, custom biography, working hours, pricing, or how you want the AI to represent you..."
                    />
                  </div>
                </div>

                {/* FAQ Trainer Section */}
                <div className={`rounded-3xl border p-6 space-y-6 ${ui.panel}`}>
                  <div>
                    <h3 className="text-sm font-bold">Trained FAQ Base</h3>
                    <p className={`text-xs mt-1 ${ui.muted}`}>Provide exact Q&A pairs to train your AI on specific questions visitors frequently ask.</p>
                  </div>

                  {/* FAQ Creator Form */}
                  <div className="flex flex-col gap-3 p-4.5 rounded-2xl border border-dashed border-zinc-700/50">
                    <input
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      className={`w-full rounded-xl border px-3.5 py-2.25 text-xs font-bold ${ui.input}`}
                      placeholder="FAQ Question (e.g. Can I hire you for freelance work?)"
                    />
                    <textarea
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      rows={2}
                      className={`w-full resize-none rounded-xl border px-3.5 py-2.25 text-xs font-semibold ${ui.input}`}
                      placeholder="FAQ Answer (e.g. Yes! I am open to remote contract opportunities.)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!faqQuestion.trim() || !faqAnswer.trim()) return;
                        setAiConfig(prev => ({
                          ...prev,
                          aiFaqs: [...prev.aiFaqs, { question: faqQuestion.trim(), answer: faqAnswer.trim() }]
                        }));
                        setFaqQuestion('');
                        setFaqAnswer('');
                      }}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-colors"
                    >
                      Add to AI Knowledge Base
                    </button>
                  </div>

                  {/* FAQ List */}
                  <div className="space-y-3">
                    {aiConfig.aiFaqs.map((faq, index) => (
                      <div key={index} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-zinc-800/10 dark:border-white/5">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-indigo-400">Q: {faq.question}</p>
                          <p className={`text-xs font-semibold ${ui.text}`}>A: {faq.answer}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setAiConfig(prev => ({
                              ...prev,
                              aiFaqs: prev.aiFaqs.filter((_, idx) => idx !== index)
                            }));
                          }}
                          className="text-zinc-500 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {aiConfig.aiFaqs.length === 0 && (
                      <p className={`text-center text-xs py-4 ${ui.muted}`}>No FAQs trained yet. Add Q&A above to train your AI.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`border-t pt-5 ${ui.border}`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${message.includes('published') || message === '' ? 'bg-emerald-500' : 'bg-amber-400 animate-ping'}`} />
            <p className={`text-[10px] font-extrabold uppercase tracking-widest ${ui.muted}`}>
              SYSTEM STATUS: <span className={ui.text}>{message || 'ALL SAVED & READY'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden w-[360px] xl:block">
        <div className="sticky top-24">
          <PhonePreview profile={profile} links={links} preset={preset} vibe={vibe} aiConfig={aiConfig} avatarBorder={avatarBorder} statusGlow={statusGlow} />
        </div>
      </div>
    </div>
  );
}
