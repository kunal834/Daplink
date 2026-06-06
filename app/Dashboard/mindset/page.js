"use client";

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart, MessageSquare, Repeat2, Share,
  Code2, MoreHorizontal, CheckCircle2,
  Sun, Moon, Loader2, Check, BarChart2,
  Image as ImageIcon, X, Info, Search, Bell, Sparkles
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/Authenticate';
import { motion, AnimatePresence } from 'framer-motion';

// Helper for image loaders if needed
const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  return "now";
};

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num;
};

// ==========================================
// HELPER: FORMAT CONTENT WITH MENTIONS/TAGS
// ==========================================
const formatPostContent = (text, handleTagClick) => {
  if (!text) return null;
  const parts = text.split(/(\s+)/); 
  
  return parts.map((part, index) => {
    if (part.match(/^@[\w\d_.]+$/)) {
      return (
        <Link key={index} href={`/u/${part.slice(1)}`} className="text-indigo-500 hover:underline font-bold" onClick={(e) => e.stopPropagation()}>
          {part}
        </Link>
      );
    } else if (part.match(/^#[\w\d_]+$/)) {
      return (
        <span key={index} className="text-indigo-550 dark:text-indigo-400 hover:underline cursor-pointer font-bold" onClick={(e) => { e.stopPropagation(); if(handleTagClick) handleTagClick(part.slice(1)); }}>
          {part}
        </span>
      );
    }
    return part;
  });
};

// ==========================================
// INDIVIDUAL POST COMPONENT
// ==========================================
const PostItem = ({ post, isDarkMode, daplinkUser, currentUser, onTagClick }) => {
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [likedAnim, setLikedAnim] = useState(false);
  const menuRef = useRef(null);

  const textPrimary = isDarkMode ? 'text-zinc-100' : 'text-zinc-900';
  const textSecondary = isDarkMode ? 'text-zinc-550' : 'text-zinc-400';
  const border = isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/50';
  const hoverBg = isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-zinc-50/50';

  const uId = currentUser?._id || currentUser?.id;
  const dId = typeof currentUser?.daplinkID === 'object' ? (currentUser.daplinkID._id || currentUser.daplinkID.id) : currentUser?.daplinkID;
  const currentHandle = currentUser?.handle || daplinkUser?.handle;

  const isIdMatch = Boolean(post.authorId && (post.authorId.toString() === uId?.toString() || post.authorId.toString() === dId?.toString()));
  const isHandleMatch = Boolean(currentHandle && (post?.handle === `@${currentHandle}` || post?.handle === currentHandle));
  const isOwner = isIdMatch || isHandleMatch;

  const authorObj = post.author || (typeof post.authorId === 'object' ? post.authorId : null);
  
  let displayName = post.name;
  let displayHandle = post.handle;
  let displayAvatar = post.avatar;

  if (!displayName || displayName === "Unknown User") displayName = authorObj?.name || authorObj?.handle || authorObj?.daplinkID?.handle || "Unknown User";
  if (!displayHandle || displayHandle === "@unknown" || displayHandle === "unknown") displayHandle = authorObj?.handle || authorObj?.daplinkID?.handle || "unknown";
  if (displayHandle && !displayHandle.startsWith('@')) displayHandle = `@${displayHandle}`;
  if (!displayAvatar || displayAvatar.includes('unknown')) displayAvatar = authorObj?.avatar || authorObj?.profile || authorObj?.daplinkID?.profile || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayHandle}`;

  const baseLikes = post.likes || 0;
  const baseComments = post.comments || 0;
  const baseShares = post.shares || 0;
  const impressions = post.views > 0 ? post.views : ((baseLikes * 24) + (baseComments * 45) + (baseShares * 80) + 12);
  const engagements = baseLikes + baseComments + baseShares + Math.floor(impressions * 0.04);
  const detailExpands = Math.floor(impressions * 0.02);
  const profileVisits = Math.floor(impressions * 0.01);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLikeMutation = useMutation({
    mutationFn: async () => axios.post(`/api/backend/posts/${post.id}/like`, {}),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      
      // Fix potential undefined map crash by checking Array.isArray
      queryClient.setQueryData(['posts'], (old) => {
        if (!Array.isArray(old)) return [];
        return old.map(p => p.id === post.id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p);
      });
      
      if (!post.liked) {
        setLikedAnim(true);
        setTimeout(() => setLikedAnim(false), 600);
      }
      return { previousPosts };
    },
    onError: (err, variables, context) => queryClient.setQueryData(['posts'], context.previousPosts),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
  });

  const repostMutation = useMutation({
    mutationFn: async () => axios.post(`/api/backend/posts/${post.id}/repost`, {}),
    onSuccess: () => {
        toast.success("Reposted!");
        queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => toast.error("Failed to repost")
  });

  const deletePostMutation = useMutation({
    mutationFn: async () => axios.delete(`/api/backend/posts/${post.id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
    onError: () => toast.error("Failed to delete post")
  });

  const editPostMutation = useMutation({
    mutationFn: async () => axios.put(`/api/backend/posts/${post.id}`, { content: editContent }),
    onSuccess: () => { setIsEditing(false); queryClient.invalidateQueries({ queryKey: ['posts'] }); },
    onError: () => toast.error("Failed to edit post")
  });

  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: async () => (await axios.get(`/api/backend/posts/${post.id}/comments`)).data.comments,
    enabled: showComments,
  });

  const postCommentMutation = useMutation({
    mutationFn: async () => axios.post(`/api/backend/posts/${post.id}/comments`, { content: commentText, authorId: uId }),
    onSuccess: () => { setCommentText(""); queryClient.invalidateQueries({ queryKey: ['comments', post.id] }); queryClient.invalidateQueries({ queryKey: ['posts'] }); }
  });

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isVideo = (url) => url && (post.mediaType === 'video' || url.match(/\.(mp4|webm|ogg|mov)$/i));

  return (
    <div className={`px-5 py-5 border-b ${border} ${hoverBg} transition-all duration-300 cursor-pointer rounded-2xl mb-1`}>
      <div className="flex gap-4.5 relative">
        <div className="flex flex-col items-center shrink-0">
          <Link href={`/u/${displayHandle.replace('@', '')}`}>
             <div className="relative w-11 h-11 rounded-2xl overflow-hidden hover:opacity-85 transition-all shadow-xs border border-zinc-200/50 dark:border-white/5">
                <Image 
                  src={displayAvatar} 
                  alt={displayName} 
                  fill 
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(44, 44))}`}
                />
             </div>
          </Link>
          {showComments && <div className={`w-0.5 h-full mt-3.5 rounded-full ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200/80'}`}></div>}
        </div>

        <div className="flex-1 min-w-0 pb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5 truncate">
              <Link href={`/u/${displayHandle.replace('@', '')}`} className={`font-bold text-xs hover:underline truncate ${textPrimary}`}>
                {displayName}
              </Link>
              {post.verified && <CheckCircle2 size={13} className="text-blue-500 fill-white dark:fill-zinc-950 shrink-0 relative top-0.5" />}
              <span className={`text-[10px] font-semibold truncate ${textSecondary}`}>{displayHandle}</span>
              <span className={`text-[10px] font-semibold ${textSecondary}`}>·</span>
              <span className={`text-[10px] font-semibold ${textSecondary} hover:underline`}>{timeAgo(post.time)}</span>
            </div>

            <div className="relative" ref={menuRef}>
              <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} className={`p-2 -mr-2 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors ${textSecondary}`}>
                <MoreHorizontal size={15} />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className={`absolute right-0 top-full mt-1.5 w-36 rounded-2xl shadow-xl overflow-hidden z-50 backdrop-blur-md ${isDarkMode ? 'bg-zinc-950/95 border border-zinc-850' : 'bg-white/95 border border-zinc-150'}`}
                  >
                    {isOwner ? (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors ${isDarkMode ? 'hover:bg-white/5 text-zinc-200' : 'hover:bg-zinc-900/5 text-zinc-800'}`}>Edit post</button>
                        <button onClick={(e) => { e.stopPropagation(); deletePostMutation.mutate(); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-3 text-xs font-bold text-[#f4212e] transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-zinc-900/5'}`}>Delete</button>
                      </>
                    ) : (
                      <div className="px-4 py-3 text-[11px] text-zinc-500 text-center cursor-default">Not your post</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {isEditing ? (
            <div className="mt-2.5" onClick={(e) => e.stopPropagation()}>
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className={`w-full bg-transparent border-2 rounded-2xl p-4.5 outline-none resize-none ${border} ${textPrimary} text-xs focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all`} rows={3} autoFocus />
              <div className="flex justify-end gap-2 mt-2.5">
                <button onClick={() => { setIsEditing(false); setEditContent(post.content); }} className={`px-4.5 py-2 rounded-xl text-xs font-bold ${textPrimary} border ${border} hover:bg-zinc-800/10 transition-colors`}>Cancel</button>
                <button onClick={() => editPostMutation.mutate()} disabled={editPostMutation.isPending || !editContent.trim()} className="px-4.5 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2">{editPostMutation.isPending && <Loader2 size={12} className="animate-spin" />} Save</button>
              </div>
            </div>
          ) : (
            <p className={`mt-1.5 text-xs leading-relaxed whitespace-pre-wrap break-all ${textPrimary}`}>
              {formatPostContent(post.content, onTagClick)}
            </p>
          )}

          {post.mediaUrl && (
            <div className={`mt-4.5 rounded-3xl overflow-hidden border ${border} bg-black/5 dark:bg-white/[0.01] hover:scale-[1.005] transition-transform`}>
              {isVideo(post.mediaUrl) ? (
                <video src={post.mediaUrl} controls className="w-full max-h-125 object-cover bg-black" onClick={(e) => e.stopPropagation()} />
              ) : (
                <div className="relative w-full h-auto min-h-[250px]">
                   <Image 
                    src={post.mediaUrl} 
                    alt="Post content" 
                    width={800} 
                    height={600} 
                    className="w-full h-auto max-h-125 object-cover" 
                  />
                </div>
              )}
            </div>
          )}

          {post.tags?.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} onClick={(e) => { e.stopPropagation(); if(onTagClick) onTagClick(tag); }} className="text-[11px] font-bold text-indigo-500 hover:underline cursor-pointer">#{tag}</span>
              ))}
            </div>
          )}

          {/* Micro-Interaction Stats Panel */}
          <div className={`flex items-center justify-between mt-4 w-full lg:w-[85%] ${textSecondary}`}>
            <div className="flex items-center group text-[11px] font-bold hover:text-indigo-500 transition-colors">
              <button onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }} className="w-8.5 h-8.5 -ml-2 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/10 transition-all">
                <MessageSquare size={15} />
              </button>
              <span className="px-1.5">{baseComments > 0 ? baseComments : ''}</span>
            </div>

            <div className="flex items-center group text-[11px] font-bold hover:text-emerald-500 transition-colors">
              <button onClick={(e) => { e.stopPropagation(); repostMutation.mutate(); }} className="w-8.5 h-8.5 -ml-2 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-all">
                <Repeat2 size={15} />
              </button>
              <span className="px-1.5">{baseShares > 0 ? baseShares : ''}</span>
            </div>

            <div className="flex items-center group text-[11px] font-bold hover:text-rose-500 transition-colors">
              <motion.button 
                animate={likedAnim ? { scale: [1, 1.4, 0.9, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
                onClick={(e) => { e.stopPropagation(); toggleLikeMutation.mutate(); }} 
                className="w-8.5 h-8.5 -ml-2 rounded-xl flex items-center justify-center group-hover:bg-rose-500/10 transition-all relative"
              >
                <Heart size={15} className={post.liked ? "fill-rose-550 text-rose-550 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]" : ""} />
              </motion.button>
              <span className={`px-1.5 ${post.liked ? 'text-rose-550' : ''}`}>{baseLikes > 0 ? baseLikes : ''}</span>
            </div>

            <div className="items-center group text-[11px] font-bold hover:text-indigo-500 transition-colors hidden sm:flex">
              <button onClick={(e) => { 
                e.stopPropagation(); 
                if (isOwner) setShowAnalytics(true); 
                else toast("Only the author can view post analytics", { icon: '🔒', style: { borderRadius: '12px', background: isDarkMode ? '#1e1e24' : '#fff', color: isDarkMode ? '#fff' : '#0f1419'} });
              }} className={`w-8.5 h-8.5 -ml-2 rounded-xl flex items-center justify-center transition-all ${isOwner ? 'group-hover:bg-indigo-500/10 cursor-pointer' : 'cursor-default'}`}>
                <BarChart2 size={15} />
              </button>
              <span className="px-1.5">{formatNumber(impressions)}</span>
            </div>

            <div className="flex items-center gap-2 group text-[11px] hover:text-indigo-500 transition-colors">
              <button onClick={handleCopy} className="w-8.5 h-8.5 -ml-2 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/10 transition-all">
                {copied ? <Check size={15} className="text-emerald-500" strokeWidth={3} /> : <Share size={15} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-14 pr-2 pt-3 mt-1.5 relative z-10 overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-3.5 items-center mb-4.5">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-xs border border-zinc-200/50 dark:border-white/5 shrink-0">
                 <Image 
                  src={daplinkUser?.profile || `https://api.dicebear.com/7.x/avataaars/svg?seed=me`} 
                  alt="Me" 
                  fill 
                  className="object-cover" 
                />
              </div>
              <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Post your reply..." className={`flex-1 bg-transparent text-xs font-semibold outline-none py-2 ${textPrimary} placeholder:${textSecondary}`} onKeyDown={(e) => { if (e.key === 'Enter' && commentText.trim()) postCommentMutation.mutate(); }} />
              <button onClick={() => postCommentMutation.mutate()} disabled={!commentText.trim() || postCommentMutation.isPending} className="bg-indigo-650 hover:bg-indigo-600 text-white font-black px-4 py-1.75 rounded-xl text-[11px] disabled:opacity-50 transition-all cursor-pointer">Reply</button>
            </div>
            
            {loadingComments ? (
              <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-indigo-500" /></div>
            ) : (
              <div className="space-y-1.5">
                {comments?.map((comment) => (
                  <div key={comment._id} className="flex gap-3.5 py-3 border-t border-zinc-800/10 dark:border-zinc-800/30">
                    <div className="relative w-8 h-8 rounded-xl overflow-hidden mt-0.5 shrink-0 shadow-xs">
                       <Image 
                        src={comment.author?.avatar || comment.author?.profile || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.handle || 'unknown'}`} 
                        alt={comment.author?.handle || 'Avatar'} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`font-bold text-xs ${textPrimary}`}>{comment.author?.handle || 'Unknown'}</span>
                        <span className={`text-[10px] font-semibold ${textSecondary}`}>· {timeAgo(comment.createdAt)}</span>
                      </div>
                      <p className={`text-xs leading-relaxed mt-0.5 ${textPrimary}`}>{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Modal... */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-md p-4" 
            onClick={(e) => { e.stopPropagation(); setShowAnalytics(false); }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border backdrop-blur-xl ${isDarkMode ? 'bg-zinc-950/95 border-zinc-850 text-white' : 'bg-white border border-zinc-200 text-black'}`} 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-inherit">
                  <h2 className="text-base font-black tracking-tight">DapPost Analytics</h2>
                  <button onClick={() => setShowAnalytics(false)} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}><X size={16} /></button>
              </div>
              <div className="p-6">
                  <div className={`p-4 rounded-2xl border border-inherit mb-6 flex gap-3.5 ${isDarkMode ? 'bg-zinc-900/60' : 'bg-zinc-50'}`}>
                    {post.mediaUrl && (
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-black relative shadow-xs">
                         {isVideo(post.mediaUrl) ? <video src={post.mediaUrl} className="w-full h-full object-cover" /> : <Image src={post.mediaUrl} alt="Preview" fill className="object-cover" />}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                       <div className="flex items-baseline gap-1.5 text-xs mb-1">
                          <span className="font-bold truncate">{displayName}</span>
                          <span className={`truncate ${textSecondary}`}>{displayHandle}</span>
                          <span className={textSecondary}>·</span>
                          <span className={textSecondary}>{timeAgo(post.time)}</span>
                       </div>
                       <p className={`text-[11px] leading-relaxed line-clamp-2 ${textSecondary}`}>{post.content}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pb-6 border-b border-inherit mb-6 text-center">
                    <div className="p-3 rounded-2xl bg-zinc-800/10 dark:bg-white/5"><Heart size={18} className="mx-auto mb-1 text-rose-500" /><p className="text-base font-extrabold">{baseLikes}</p></div>
                    <div className="p-3 rounded-2xl bg-zinc-800/10 dark:bg-white/5"><Repeat2 size={18} className="mx-auto mb-1 text-emerald-500" /><p className="text-base font-extrabold">{baseShares}</p></div>
                    <div className="p-3 rounded-2xl bg-zinc-800/10 dark:bg-white/5"><MessageSquare size={18} className="mx-auto mb-1 text-indigo-500" /><p className="text-base font-extrabold">{baseComments}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <div><div className={`flex items-center gap-1 mb-1 text-[10px] font-extrabold uppercase tracking-wider ${textSecondary}`}>Impressions <Info size={12} /></div><p className="text-xl font-black">{impressions.toLocaleString()}</p></div>
                    <div><div className={`flex items-center gap-1 mb-1 text-[10px] font-extrabold uppercase tracking-wider ${textSecondary}`}>Engagements <Info size={12} /></div><p className="text-xl font-black">{engagements.toLocaleString()}</p></div>
                    <div><div className={`flex items-center gap-1 mb-1 text-[10px] font-extrabold uppercase tracking-wider ${textSecondary}`}>Detail expands <Info size={12} /></div><p className="text-xl font-black">{detailExpands.toLocaleString()}</p></div>
                    <div><div className={`flex items-center gap-1 mb-1 text-[10px] font-extrabold uppercase tracking-wider ${textSecondary}`}>Profile visits <Info size={12} /></div><p className="text-xl font-black">{profileVisits.toLocaleString()}</p></div>
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// MAIN FEED COMPONENT
// ==========================================
export default function DaplinkCommunityFeed() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const queryClient = useQueryClient();

  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  
  // Tag filter state & Navigation Tabs
  const [activeTab, setActiveTab] = useState('feed'); 
  const [currentTagFilter, setCurrentTagFilter] = useState(''); 
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // MENTIONS State
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [debouncedMentionQuery, setDebouncedMentionQuery] = useState('');
  const [debouncedMentionQuery, setDebouncedMentionQuery] = useState(''); 

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce for Mention Searching to drastically speed up typing!
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedMentionQuery(mentionQuery), 200);
    return () => clearTimeout(timer);
  }, [mentionQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(52, textareaRef.current.scrollHeight)}px`;
    }
  }, [content]);

  const extractedId = typeof user?.daplinkID === 'object' ? (user.daplinkID._id || user.daplinkID.id) : user?.daplinkID;
  const safeId = String(extractedId);
  const userId = user?._id || user?.id;

  const { data: daplink } = useQuery({
    queryKey: ['daplink', safeId],
    queryFn: async () => (await axios.get(`/api/getDaplink?daplinkID=${safeId}`)).data,
    enabled: !!extractedId && safeId !== '[object Object]' && safeId !== 'undefined',
  });

  const { data: postsData, isLoading: isPostsLoading } = useQuery({
    queryKey: ['posts', activeTab, currentTagFilter],
    queryFn: async () => {
      let url = `/api/backend/posts?type=${activeTab}`;
      if (currentTagFilter) url += `&tag=${currentTagFilter}`;
      return (await axios.get(url)).data.posts;
    },
  });

  const { data: trendingTopics, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: async () => (await axios.get(`/api/backend/posts/trending`)).data.trending,
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return null;
      return (await axios.get(`/api/backend/posts/search?q=${debouncedQuery}`)).data;
    },
    enabled: !!debouncedQuery.trim()
  });

  const { data: notificationsData, isLoading: isNotificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/notifications`, { withCredentials: true })).data.notifications,
    refetchInterval: 30000 
  });

  const { data: mentionSuggestions, isLoading: isFetchingMentions } = useQuery({
    queryKey: ['mentionSuggestions', debouncedMentionQuery],
    queryFn: async () => {
      if (!debouncedMentionQuery.trim()) return [];
      return (await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/search?q=${debouncedMentionQuery}`, { withCredentials: true })).data.users;
    },
    enabled: showMentionDropdown && debouncedMentionQuery.trim().length > 0,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notifId) => axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/notifications/${notifId}/read`, {}, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/notifications/read-all`, {}, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success("All caught up!");
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('content', content);
      
      const extractedTags = content.match(/#[a-z0-9_]+/gi) || [];
      const cleanTags = extractedTags.map(t => t.replace('#', ''));
      formData.append('tags', JSON.stringify(cleanTags));
      
      if (userId) formData.append('authorId', userId);
      if (mediaFile) formData.append('media', mediaFile);

      return axios.post(`/api/backend/posts`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => { 
      setContent(''); 
      removeMedia(); 
      queryClient.invalidateQueries({ queryKey: ['posts'] }); 
      queryClient.invalidateQueries({ queryKey: ['trending'] }); 
      setActiveTab('myposts'); 
      setCurrentTagFilter('');
    }
  });

  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (file) { setMediaFile(file); setMediaPreview(URL.createObjectURL(file)); }
  };

  const removeMedia = () => { setMediaFile(null); setMediaPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handleTagClick = (tag) => {
    setCurrentTagFilter(tag.replace('#', ''));
    setActiveTab('feed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setContent(val);

    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursorPos);
    
    const match = textBeforeCursor.match(/@([a-zA-Z0-9_]*)$/);

    if (match) {
      setMentionQuery(match[1]);
      setShowMentionDropdown(true);
    } else {
      setShowMentionDropdown(false);
    }
  };

  const handleMentionSelect = (userToMention) => {
    const cursorPos = textareaRef.current.selectionStart;
    const textBeforeCursor = content.slice(0, cursorPos);
    const textAfterCursor = content.slice(cursorPos);
    
    const match = textBeforeCursor.match(/@([a-zA-Z0-9_]*)$/);
    if (match) {
      const newTextBefore = textBeforeCursor.slice(0, match.index) + `@${userToMention.handle} `;
      setContent(newTextBefore + textAfterCursor);
      setShowMentionDropdown(false);
      setMentionQuery('');
      setDebouncedMentionQuery(''); 
      textareaRef.current.focus();
    }
  };

  const unreadCount = notificationsData?.filter(n => n.status === 'unread').length || 0;

  const bgMain = isDarkMode ? 'bg-transparent' : 'bg-transparent';
  const textPrimary = isDarkMode ? 'text-zinc-100' : 'text-zinc-900';
  const textSecondary = isDarkMode ? 'text-zinc-550' : 'text-zinc-400';
  const border = isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/50';
  const hoverBg = isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-zinc-50/50';

  return (
    <div className={`min-h-screen ${bgMain} ${textPrimary} font-sans flex justify-center max-w-325 mx-auto xl:justify-between gap-4 lg:gap-8 px-0 sm:px-4`}>
      <div className="hidden md:flex flex-col w-72 pt-2 sticky top-0 h-[calc(100vh-96px)] overflow-y-auto pb-20 pr-4 z-40">
        
        {/* Search Bar */}
        <div ref={searchRef} className="relative w-full">
          <div className={`flex items-center px-4 py-2.5 rounded-2xl border transition-colors ${isSearchFocused ? 'border-indigo-500 bg-transparent shadow-[0_0_15px_rgba(99,102,241,0.15)]' : isDarkMode ? 'border-transparent bg-zinc-900/60' : 'border-transparent bg-zinc-100/80'}`}>
            <Search className={`w-4 h-4 mr-3 ${isSearchFocused ? 'text-indigo-500' : textSecondary}`} />
            <input 
              type="text" 
              placeholder="Search DapLink..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className={`bg-transparent outline-none w-full text-xs font-semibold placeholder:${textSecondary}`} 
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={`w-5 h-5 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-indigo-500 text-black' : 'bg-indigo-500 text-white'}`}>
                <X size={12} strokeWidth={3} />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchQuery.trim() !== '' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute top-13 left-0 w-full rounded-2xl shadow-xl overflow-hidden border backdrop-blur-md ${isDarkMode ? 'bg-zinc-950/95 border-zinc-850' : 'bg-white/95 border-zinc-150'}`}
              >
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-indigo-500 flex justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div>
                ) : searchResults ? (
                  <div>
                    {searchResults.users?.length > 0 && (
                      <div>
                        <div className={`px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest border-b ${border} opacity-60`}>People</div>
                        {searchResults.users.map(u => (
                          <Link key={u._id} href={`/u/${u.handle.replace('@','')}`} className={`flex items-center gap-3 px-4 py-3 transition-colors ${hoverBg}`}>
                            <div className="relative w-9 h-9 rounded-xl overflow-hidden">
                               <Image src={u.avatar} alt={u.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-xs truncate">{u.name}</p>
                              <p className={`text-[10px] font-semibold ${textSecondary} truncate`}>@{u.handle}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.users?.length === 0 && searchResults.posts?.length === 0 && (
                      <div className={`p-4 text-center text-xs font-semibold ${textSecondary}`}>No results for &quot;{searchQuery}&quot;</div>
                    )}
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 space-y-2">
           <button 
             onClick={() => { setActiveTab('feed'); setCurrentTagFilter(''); }} 
             className={`w-full flex items-center gap-4 px-4 py-3.25 rounded-2xl font-bold text-xs tracking-tight transition-all ${activeTab === 'feed' && !currentTagFilter ? 'bg-indigo-600 text-white shadow-md shadow-indigo-650/15' : `${hoverBg} text-zinc-400 hover:text-zinc-150`}`}
           >
             Feed Canvas
           </button>
           <button 
             onClick={() => { setActiveTab('myposts'); setCurrentTagFilter(''); }} 
             className={`w-full flex items-center gap-4 px-4 py-3.25 rounded-2xl font-bold text-xs tracking-tight transition-all ${activeTab === 'myposts' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-650/15' : `${hoverBg} text-zinc-400 hover:text-zinc-150`}`}
           >
             My Content
           </button>
           <button 
             onClick={() => { setActiveTab('notifications'); setCurrentTagFilter(''); }} 
             className={`w-full flex items-center gap-4 px-4 py-3.25 rounded-2xl font-bold text-xs tracking-tight transition-all ${activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-650/15' : `${hoverBg} text-zinc-400 hover:text-zinc-150`}`}
           >
             <div className="relative">
                <Bell size={18} />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white dark:border-zinc-950"></span>}
             </div>
             Activity Hub
           </button>
        </div>
      </div>

      {/*MIDDLE COLUMN*/}
      <div className={`w-full max-w-150 border-x ${border} min-h-[calc(100vh-96px)] relative`}>
        <div className={`sticky top-0 z-20 backdrop-blur-md bg-opacity-80 border-b ${border} ${isDarkMode ? 'bg-zinc-950/80' : 'bg-white/80'}`}>
          <div className="flex items-center justify-between px-4 h-[53px]">
            <h1 className="font-extrabold text-xs uppercase tracking-widest cursor-pointer flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              {activeTab === 'feed' ? 'DapPost Feed' : activeTab === 'myposts' ? 'My Posts' : 'Notifications'}
            </h1>
            <div className="md:hidden flex gap-2 items-center">
               <button onClick={() => { setActiveTab('feed'); setCurrentTagFilter(''); }} className={`text-[10px] font-extrabold uppercase tracking-wide ${activeTab === 'feed' ? 'text-indigo-500 font-black' : textSecondary}`}>Feed</button>
               <span className={textSecondary}>|</span>
               <button onClick={() => { setActiveTab('myposts'); setCurrentTagFilter(''); }} className={`text-[10px] font-extrabold uppercase tracking-wide ${activeTab === 'myposts' ? 'text-indigo-500 font-black' : textSecondary}`}>Me</button>
               <span className={textSecondary}>|</span>
               <button onClick={() => { setActiveTab('notifications'); setCurrentTagFilter(''); }} className={`text-[10px] font-extrabold uppercase tracking-wide relative ${activeTab === 'notifications' ? 'text-indigo-500 font-black' : textSecondary}`}>
                 Notifs
                 {unreadCount > 0 && <span className="absolute -top-1 -right-2 w-2 h-2 bg-indigo-500 rounded-full"></span>}
               </button>
            </div>

            <button onClick={toggleTheme} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}>
              {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>

        {/* Tag Filter Indicator */}
        <AnimatePresence>
          {currentTagFilter && activeTab !== 'notifications' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`px-4 py-2 border-b flex justify-between items-center ${border} bg-indigo-500/10 text-indigo-500 overflow-hidden`}
            >
              <span className="font-extrabold text-[11px] uppercase tracking-wide">Showing results for #{currentTagFilter}</span>
              <button onClick={() => setCurrentTagFilter('')} className="p-1 hover:bg-indigo-500/20 rounded-xl"><X size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post Creation Area (Hide on notifications tab) */}
        {activeTab !== 'notifications' && (
          <div className={`px-5 pt-5 pb-3 border-b ${border} flex gap-4 bg-zinc-950/5 dark:bg-white/[0.005]`}>
            <div className="shrink-0 pt-1">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-xs border border-zinc-200/50 dark:border-white/5">
                 <Image src={daplink?.profile || `https://api.dicebear.com/7.x/avataaars/svg?seed=me`} alt="Avatar" fill className="object-cover" />
              </div>
            </div>

            <div className="flex-1 min-w-0 relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleTextChange} 
                placeholder="What is happening in your creator stack?!"
                className={`w-full bg-transparent outline-none text-base font-semibold resize-none placeholder:${textSecondary} pt-2 pb-2 overflow-hidden`}
                rows={1}
              />

              {/* MENTION DROPDOWN MENU */}
              <AnimatePresence>
                {showMentionDropdown && mentionQuery.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`absolute z-50 left-0 mt-1 w-72 rounded-2xl shadow-xl overflow-hidden border backdrop-blur-md ${isDarkMode ? 'bg-zinc-950/95 border-zinc-850' : 'bg-white/95 border-zinc-150'}`}
                  >
                    {isFetchingMentions ? (
                      <div className="p-4 flex justify-center"><Loader2 size={14} className="animate-spin text-indigo-555" /></div>
                    ) : mentionSuggestions?.length > 0 ? (
                      mentionSuggestions.map((mu) => (
                        <div 
                          key={mu._id} 
                          onClick={() => handleMentionSelect(mu)}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${hoverBg}`}
                        >
                          <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0">
                            <Image src={mu.avatar} alt={mu.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <p className={`font-bold text-xs truncate ${textPrimary}`}>{mu.name}</p>
                              <CheckCircle2 size={12} className="text-blue-500 fill-white dark:fill-zinc-950 shrink-0" />
                            </div>
                            <p className={`text-[10px] font-semibold truncate ${textSecondary}`}>@{mu.handle}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={`p-4 text-xs font-semibold text-center ${textSecondary}`}>No matching creators found</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {mediaPreview && (
                <div className="relative mt-3 mb-3 rounded-2xl overflow-hidden border border-zinc-800/60 shadow-md">
                  <button onClick={removeMedia} className="absolute top-2.5 right-2.5 z-10 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-xl backdrop-blur-md transition-colors"><X size={15} /></button>
                  {mediaFile?.type.startsWith('video/') ? <video src={mediaPreview} controls className="w-full max-h-125 object-cover" /> : <Image src={mediaPreview} alt="Upload preview" width={800} height={600} className="w-full h-auto max-h-125 object-cover" />}
                </div>
              )}

              {content.length > 0 && !mediaPreview && (
                <div className={`border-b ${border} mb-3.5 w-[95%] mx-auto opacity-30`}></div>
              )}

              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-transparent">
                <div className="flex gap-1 text-indigo-500 -ml-2">
                  <input type="file" ref={fileInputRef} onChange={handleMediaSelect} accept="image/*,video/*" className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="w-8.5 h-8.5 rounded-xl flex items-center justify-center hover:bg-indigo-500/10 transition-colors cursor-pointer animate-pulse" title="Media Attachment"><ImageIcon size={16} /></button>
                  <button className="w-8.5 h-8.5 rounded-xl flex items-center justify-center hover:bg-indigo-500/10 transition-colors cursor-pointer" title="Code block"><Code2 size={16} /></button>
                </div>
                
                <button
                  onClick={() => createPostMutation.mutate()}
                  disabled={(!content.trim() && !mediaFile) || createPostMutation.isPending}
                  className="bg-indigo-650 hover:bg-indigo-600 text-white font-black px-5 py-2 rounded-xl text-xs hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:bg-indigo-650/50 flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-650/10"
                >
                  {createPostMutation.isPending && <Loader2 size={12} className="animate-spin" />} Post Vibe
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic transition wrap for Post list feed / Notifications list */}
        <div className="pb-20">
          {activeTab === 'notifications' ? (
            // NOTIFICATIONS VIEW 
            <div>
              {unreadCount > 0 && (
                <div className={`px-4 py-3 flex justify-end border-b ${border}`}>
                  <button 
                    onClick={() => markAllAsReadMutation.mutate()}
                    disabled={markAllAsReadMutation.isPending}
                    className="text-[14px] text-[#1d9bf0] hover:underline font-bold transition-colors disabled:opacity-50"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
              {isNotificationsLoading ? (
                 <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-[#1d9bf0]" /></div>
              ) : notificationsData?.length > 0 ? (
                 notificationsData.map((notif) => {
                   const isUnread = notif.status === 'unread';
                   
                   let actionText = "interacted with your post";
                   let Icon = Bell;
                   let iconColor = "text-[#1d9bf0]";
                   
                   if (notif.notificationType === 'mention') {
                       actionText = "mentioned you in a post";
                   } else if (notif.notificationType === 'like') {
                       actionText = "liked your post";
                       Icon = Heart;
                       iconColor = "text-[#f91880]";
                   } else if (notif.notificationType === 'comment') {
                       actionText = "commented on your post";
                       Icon = MessageSquare;
                   } else if (notif.notificationType === 'repost') {
                       actionText = "reposted your post";
                       Icon = Repeat2;
                       iconColor = "text-[#00ba7c]";
                   }
                   
                   return (
                     <div 
                       key={notif._id} 
                       onClick={() => {
                         if (isUnread) markAsReadMutation.mutate(notif._id);
                       }}
                       className={`px-4 py-4 border-b cursor-pointer transition-colors flex gap-4 ${border} ${isUnread ? (isDarkMode ? 'bg-[#1d9bf0]/10' : 'bg-[#1d9bf0]/5') : hoverBg}`}
                     >
                        <div className="relative shrink-0 mt-1">
                          <Icon className={isUnread ? iconColor : textSecondary} size={24} />
                          {isUnread && <span className={`absolute top-0 right-0 w-2.5 h-2.5 bg-[#1d9bf0] rounded-full border-2 border-white dark:border-black`}></span>}
                        </div>
                        
                        <div className="flex-1">
                          <Image src={notif.senderId?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.senderId?.handle}`} className="w-8 h-8 rounded-full mb-2 object-cover" alt={notif.senderId?.handle} />
                          <p className={`text-[15px] ${textPrimary}`}>
                            <span className="font-bold">{notif.senderId?.handle}</span> {actionText}.
                          </p>
                          {notif.postId && <p className={`text-[15px] mt-1 line-clamp-2 ${textSecondary}`}>&quot;{notif.postId.content}&quot;</p>}
                        </div>
                     </div>
                   );
                 })
              ) : (
                 <div className={`text-center py-10 text-[15px] ${textSecondary}`}>No notifications yet.</div>
              )}
            </div>
          ) : (
            // POSTS VIEW
            isPostsLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-[#1d9bf0]" /></div>
            ) : postsData?.length > 0 ? (
              postsData.map((post) => (
                <PostItem key={post.id} post={post} isDarkMode={isDarkMode} daplinkUser={daplink} currentUser={user} onTagClick={handleTagClick} />
              ))
          <AnimatePresence mode="wait">
            {activeTab === 'notifications' ? (
              // NOTIFICATIONS VIEW 
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                key="notifications"
              >
                {unreadCount > 0 && (
                  <div className={`px-5 py-3 flex justify-end border-b ${border} bg-zinc-950/5 dark:bg-white/[0.005]`}>
                    <button 
                      onClick={() => markAllAsReadMutation.mutate()}
                      disabled={markAllAsReadMutation.isPending}
                      className="text-xs text-indigo-500 hover:underline font-extrabold uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      Mark all as read
                    </button>
                  </div>
                )}
                {isNotificationsLoading ? (
                   <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                ) : notificationsData?.length > 0 ? (
                   notificationsData.map((notif) => {
                     const isUnread = notif.status === 'unread';
                     
                     let actionText = "interacted with your post";
                     let Icon = Bell;
                     let iconColor = "text-indigo-500";
                     
                     if (notif.notificationType === 'mention') {
                         actionText = "mentioned you in a post";
                     } else if (notif.notificationType === 'like') {
                         actionText = "liked your post";
                         Icon = Heart;
                         iconColor = "text-rose-500";
                     } else if (notif.notificationType === 'comment') {
                         actionText = "commented on your post";
                         Icon = MessageSquare;
                     } else if (notif.notificationType === 'repost') {
                         actionText = "reposted your post";
                         Icon = Repeat2;
                         iconColor = "text-emerald-500";
                     }
                     
                     return (
                       <div 
                         key={notif._id} 
                         onClick={() => {
                           if (isUnread) markAsReadMutation.mutate(notif._id);
                         }}
                         className={`px-5 py-4.5 border-b cursor-pointer transition-all duration-300 flex gap-4.5 ${border} ${isUnread ? (isDarkMode ? 'bg-indigo-500/10 hover:bg-indigo-500/15' : 'bg-indigo-500/5 hover:bg-indigo-500/10') : hoverBg}`}
                       >
                          <div className="relative shrink-0 mt-1">
                            <Icon className={isUnread ? `${iconColor} drop-shadow-sm` : textSecondary} size={20} />
                            {isUnread && <span className={`absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-zinc-950`}></span>}
                          </div>
                          
                          <div className="flex-1">
                            <img src={notif.senderId?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.senderId?.handle}`} className="w-8 h-8 rounded-xl mb-2 object-cover border border-zinc-200/50 dark:border-white/5 shadow-xs" alt={notif.senderId?.handle} />
                            <p className={`text-xs ${textPrimary}`}>
                              <span className="font-extrabold">@{notif.senderId?.handle}</span> {actionText}.
                            </p>
                            {notif.postId && <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${textSecondary}`}>&quot;{notif.postId.content}&quot;</p>}
                          </div>
                       </div>
                     );
                   })
                ) : (
                   <div className={`text-center py-12 text-xs font-semibold leading-relaxed ${textSecondary}`}>No notifications yet. Activity will trigger alerts!</div>
                )}
              </motion.div>
            ) : (
              // POSTS VIEW
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                key="posts"
              >
                {isPostsLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                ) : postsData?.length > 0 ? (
                  postsData.map((post) => (
                    <PostItem key={post.id} post={post} isDarkMode={isDarkMode} daplinkUser={daplink} currentUser={user} onTagClick={handleTagClick} />
                  ))
                ) : (
                  <div className={`text-center py-12 text-xs font-semibold leading-relaxed ${textSecondary}`}>
                     {currentTagFilter ? `No posts found matching #${currentTagFilter}.` : activeTab === 'feed' ? "No posts yet. Be the first to share your stack vibes!" : "You haven't posted anything yet."}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/*RIGHT COLUMN (TRENDS)*/}
      <div className="hidden lg:block w-[320px] pt-2 pb-20 space-y-4 sticky top-0 h-[calc(100vh-96px)] overflow-y-auto pl-4">
        <div className={`rounded-3xl border flex flex-col p-1 transition-all ${isDarkMode ? 'bg-zinc-950/40 border-zinc-800/60 shadow-lg' : 'bg-white border-zinc-200/50 shadow-sm'}`}>
          <h2 className="font-extrabold text-[13px] uppercase tracking-widest px-5 py-4 border-b border-inherit opacity-85">Trending Stack Topics</h2>
          
          {isTrendingLoading ? (
            <div className="flex justify-center py-6"><Loader2 className="w-4 h-4 animate-spin text-indigo-500" /></div>
          ) : trendingTopics && trendingTopics.length > 0 ? (
            trendingTopics.map((trend, index) => (
              <div key={index} onClick={() => handleTagClick(trend.tag)} className={`px-5 py-4.5 cursor-pointer transition-colors border-b last:border-b-0 border-inherit ${hoverBg}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wide ${textSecondary}`}>Trending topic</span>
                  <MoreHorizontal size={14} className={textSecondary} />
                </div>
                <p className="font-bold text-xs mt-1 hover:underline text-indigo-500 dark:text-indigo-400">
                  {trend.tag.startsWith('#') ? trend.tag : `#${trend.tag}`}
                </p>
                <p className={`text-[10px] mt-1 font-semibold ${textSecondary}`}>{formatNumber(trend.posts * 14)} stack vibes</p>
              </div>
            ))
          ) : (
            <div className={`px-5 py-8 text-center text-xs font-semibold leading-relaxed ${textSecondary}`}>
              No trending topics cataloged right now. Post your vibes!
            </div>
          )}

          <div className={`px-5 py-4.5 cursor-pointer rounded-b-3xl text-center border-t border-inherit text-indigo-500 font-extrabold text-[10px] uppercase tracking-widest hover:bg-indigo-500/5 transition-colors`}>
            Show more
          </div>
        </div>
      </div>
      
    </div>
  );
}