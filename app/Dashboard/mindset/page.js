"use client";

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  Heart, MessageSquare, Repeat2, Share,
  Code2, MoreHorizontal, CheckCircle2,
  Sun, Moon, Loader2, Check, BarChart2,
  Image as ImageIcon, X, Info, Search
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/Authenticate';

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
// INDIVIDUAL POST COMPONENT
// ==========================================
const PostItem = ({ post, isDarkMode, daplinkUser, currentUser }) => {
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const menuRef = useRef(null);

  const textPrimary = isDarkMode ? 'text-[#e7e9ea]' : 'text-[#0f1419]';
  const textSecondary = isDarkMode ? 'text-[#71767b]' : 'text-[#536471]';
  const border = isDarkMode ? 'border-[#2f3336]' : 'border-[#eff3f4]';
  const hoverBg = isDarkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.03]';

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
    mutationFn: async () => axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}/like`, {}, { withCredentials: true }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (old) => old.map(p => p.id === post.id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
      return { previousPosts };
    },
    onError: (err, variables, context) => queryClient.setQueryData(['posts'], context.previousPosts),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
  });

  const repostMutation = useMutation({
    mutationFn: async () => axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}/repost`, {}, { withCredentials: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
    onError: () => toast.error("Failed to repost")
  });

  const deletePostMutation = useMutation({
    mutationFn: async () => axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}`, { withCredentials: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
    onError: () => toast.error("Failed to delete post")
  });

  const editPostMutation = useMutation({
    mutationFn: async () => axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}`, { content: editContent }, { withCredentials: true }),
    onSuccess: () => { setIsEditing(false); queryClient.invalidateQueries({ queryKey: ['posts'] }); },
    onError: () => toast.error("Failed to edit post")
  });

  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: async () => (await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}/comments`, { withCredentials: true })).data.comments,
    enabled: showComments,
  });

  const postCommentMutation = useMutation({
    mutationFn: async () => axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}/comments`, { content: commentText, authorId: uId }, { withCredentials: true }),
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
    <div className={`px-4 pt-3 pb-2 border-b ${border} ${hoverBg} transition-colors duration-200 cursor-pointer`}>
      <div className="flex gap-3 relative">
        <div className="flex flex-col items-center shrink-0">
          <Link href={`/u/${displayHandle.replace('@', '')}`}>
            <img src={displayAvatar} className="w-10 h-10 rounded-full object-cover z-10 hover:opacity-80 transition-opacity" alt={displayName} />
          </Link>
          {showComments && <div className={`w-0.5 h-full mt-2 rounded-full ${isDarkMode ? 'bg-[#333639]' : 'bg-[#cfd9de]'}`}></div>}
        </div>

        <div className="flex-1 min-w-0 pb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5 truncate">
              <Link href={`/u/${displayHandle.replace('@', '')}`} className={`font-bold text-[15px] hover:underline truncate ${textPrimary}`}>
                {displayName}
              </Link>
              {post.verified && <CheckCircle2 size={16} className="text-[#1d9bf0] fill-white dark:fill-black shrink-0 relative top-0.5" />}
              <span className={`text-[15px] ${textSecondary} truncate`}>{displayHandle}</span>
              <span className={`text-[15px] ${textSecondary}`}>·</span>
              <span className={`text-[15px] ${textSecondary} hover:underline`}>{timeAgo(post.time)}</span>
            </div>

            <div className="relative" ref={menuRef}>
              <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} className={`p-2 -mr-2 rounded-full hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors ${textSecondary}`}>
                <MoreHorizontal size={18} />
              </button>

              {isMenuOpen && (
                <div className={`absolute right-0 top-full mt-1 w-36 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden z-50 ${isDarkMode ? 'bg-black border border-gray-800' : 'bg-white border border-gray-200'}`}>
                  {isOwner ? (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-3 text-[15px] font-bold transition-colors ${isDarkMode ? 'hover:bg-white/5 text-gray-200' : 'hover:bg-black/5 text-gray-800'}`}>Edit post</button>
                      <button onClick={(e) => { e.stopPropagation(); deletePostMutation.mutate(); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-3 text-[15px] font-bold text-[#f4212e] transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>Delete</button>
                    </>
                  ) : (
                    <div className="px-4 py-3 text-[14px] text-gray-500 text-center cursor-default">Not your post</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="mt-1" onClick={(e) => e.stopPropagation()}>
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className={`w-full bg-transparent border rounded-lg p-3 outline-none resize-none ${border} ${textPrimary} text-[15px] focus:border-[#1d9bf0] transition-colors`} rows={3} autoFocus />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => { setIsEditing(false); setEditContent(post.content); }} className={`px-4 py-1.5 rounded-full text-[14px] font-bold ${textPrimary} border ${border} hover:bg-gray-500/10 transition-colors`}>Cancel</button>
                <button onClick={() => editPostMutation.mutate()} disabled={editPostMutation.isPending || !editContent.trim()} className="px-4 py-1.5 bg-[#1d9bf0] text-white rounded-full text-[14px] font-bold hover:bg-[#1a8cd8] transition-colors disabled:opacity-50 flex items-center gap-2">{editPostMutation.isPending && <Loader2 size={14} className="animate-spin" />} Save</button>
              </div>
            </div>
          ) : (
            <p className={`mt-0.5 text-[15px] leading-5 whitespace-pre-wrap wrap-break-word ${textPrimary}`}>
              {post.content}
            </p>
          )}

          {post.mediaUrl && (
            <div className={`mt-3 rounded-2xl overflow-hidden border ${border} bg-black/5`}>
              {isVideo(post.mediaUrl) ? (
                <video src={post.mediaUrl} controls className="w-full max-h-125 object-cover bg-black" onClick={(e) => e.stopPropagation()} />
              ) : (
                <img src={post.mediaUrl} alt="Post content" className="w-full h-auto max-h-125 object-cover" />
              )}
            </div>
          )}

          {post.tags?.length > 0 && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="text-[14px] text-[#1d9bf0] hover:underline cursor-pointer">#{tag}</span>
              ))}
            </div>
          )}

          <div className={`flex items-center justify-between mt-3 w-full lg:w-[85%] ${textSecondary}`}>
            <div className="flex items-center group text-[13px] hover:text-[#1d9bf0] transition-colors">
              <button onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }} className="w-8 h-8 -ml-2 rounded-full flex items-center justify-center group-hover:bg-[#1d9bf0]/10 transition-colors">
                <MessageSquare size={18} />
              </button>
              <span className="px-1">{baseComments > 0 ? baseComments : ''}</span>
            </div>

            <div className="flex items-center group text-[13px] hover:text-[#00ba7c] transition-colors">
              <button onClick={(e) => { e.stopPropagation(); repostMutation.mutate(); }} className="w-8 h-8 -ml-2 rounded-full flex items-center justify-center group-hover:bg-[#00ba7c]/10 transition-colors">
                <Repeat2 size={18} />
              </button>
              <span className="px-1">{baseShares > 0 ? baseShares : ''}</span>
            </div>

            <div className="flex items-center group text-[13px] hover:text-[#f91880] transition-colors">
              <button onClick={(e) => { e.stopPropagation(); toggleLikeMutation.mutate(); }} className="w-8 h-8 -ml-2 rounded-full flex items-center justify-center group-hover:bg-[#f91880]/10 transition-colors">
                <Heart size={18} className={post.liked ? "fill-[#f91880] text-[#f91880]" : ""} />
              </button>
              <span className={`px-1 ${post.liked ? 'text-[#f91880]' : ''}`}>{baseLikes > 0 ? baseLikes : ''}</span>
            </div>

            <div className="items-center group text-[13px] hover:text-[#1d9bf0] transition-colors hidden sm:flex">
              <button onClick={(e) => { 
                e.stopPropagation(); 
                if (isOwner) setShowAnalytics(true); 
                else toast("Only the author can view post analytics", { icon: '🔒', style: { borderRadius: '10px', background: isDarkMode ? '#333639' : '#fff', color: isDarkMode ? '#fff' : '#0f1419'} });
              }} className={`w-8 h-8 -ml-2 rounded-full flex items-center justify-center transition-colors ${isOwner ? 'group-hover:bg-[#1d9bf0]/10 cursor-pointer' : 'cursor-default'}`}>
                <BarChart2 size={18} />
              </button>
              <span className="px-1">{formatNumber(impressions)}</span>
            </div>

            <div className="flex items-center gap-2 group text-[13px] hover:text-[#1d9bf0] transition-colors">
              <button onClick={handleCopy} className="w-8 h-8 -ml-2 rounded-full flex items-center justify-center group-hover:bg-[#1d9bf0]/10 transition-colors">
                {copied ? <Check size={18} className="text-[#00ba7c]" /> : <Share size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="pl-13 pr-2 pt-2 mt-1 relative z-10" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-3 items-center mb-4">
            <img src={daplinkUser?.profile || `https://api.dicebear.com/7.x/avataaars/svg?seed=me`} className="w-8 h-8 rounded-full object-cover shrink-0" alt="Me" />
            <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Post your reply" className={`flex-1 bg-transparent text-[15px] outline-none ${textPrimary} placeholder:${textSecondary}`} onKeyDown={(e) => { if (e.key === 'Enter' && commentText.trim()) postCommentMutation.mutate(); }} />
            <button onClick={() => postCommentMutation.mutate()} disabled={!commentText.trim() || postCommentMutation.isPending} className="bg-[#1d9bf0] text-white font-bold px-4 py-1.5 rounded-full text-[14px] hover:bg-[#1a8cd8] disabled:opacity-50 disabled:bg-[#1d9bf0]/50 transition-colors">Reply</button>
          </div>
          {loadingComments ? (
            <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-[#1d9bf0]" /></div>
          ) : (
            <div className="space-y-0">
              {comments?.map((comment) => (
                <div key={comment._id} className="flex gap-3 py-2">
                  <img src={comment.author?.avatar || comment.author?.profile || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.handle || 'unknown'}`} className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" alt={comment.author?.handle} />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className={`font-bold text-[15px] ${textPrimary}`}>{comment.author?.handle || 'Unknown'}</span>
                      <span className={`text-[14px] ${textSecondary}`}>· {timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className={`text-[15px] leading-5 mt-0.5 ${textPrimary}`}>{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showAnalytics && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={(e) => { e.stopPropagation(); setShowAnalytics(false); }}>
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-black border border-[#2f3336] text-white' : 'bg-white border border-[#eff3f4] text-black'}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center px-4 py-3 border-b border-inherit">
               <button onClick={() => setShowAnalytics(false)} className={`p-2 rounded-full transition-colors -ml-2 mr-4 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}><X size={20} /></button>
               <h2 className="text-xl font-bold">Post Analytics</h2>
            </div>
            <div className="p-4 md:p-6">
               <div className={`p-4 rounded-xl border border-inherit mb-6 flex gap-3 ${isDarkMode ? 'bg-[#16181c]' : 'bg-[#f7f9f9]'}`}>
                  {post.mediaUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-black">
                       {isVideo(post.mediaUrl) ? <video src={post.mediaUrl} className="w-full h-full object-cover" /> : <img src={post.mediaUrl} className="w-full h-full object-cover" />}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                     <div className="flex items-baseline gap-1.5 text-[15px] mb-1">
                        <span className="font-bold truncate">{displayName}</span>
                        <span className={`truncate ${textSecondary}`}>{displayHandle}</span>
                        <span className={textSecondary}>·</span>
                        <span className={textSecondary}>{timeAgo(post.time)}</span>
                     </div>
                     <p className={`text-[14px] line-clamp-3 ${textSecondary}`}>{post.content}</p>
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-4 pb-6 border-b border-inherit mb-6 text-center">
                  <div><Heart size={20} className={`mx-auto mb-2 ${textSecondary}`} /><p className="text-xl font-bold">{baseLikes}</p></div>
                  <div><Repeat2 size={20} className={`mx-auto mb-2 ${textSecondary}`} /><p className="text-xl font-bold">{baseShares}</p></div>
                  <div><MessageSquare size={20} className={`mx-auto mb-2 ${textSecondary}`} /><p className="text-xl font-bold">{baseComments}</p></div>
               </div>
               <div className="grid grid-cols-2 gap-y-6">
                  <div><div className={`flex items-center gap-1 mb-1 text-[13px] ${textSecondary}`}>Impressions <Info size={14} /></div><p className="text-2xl font-bold">{impressions.toLocaleString()}</p></div>
                  <div><div className={`flex items-center gap-1 mb-1 text-[13px] ${textSecondary}`}>Engagements <Info size={14} /></div><p className="text-2xl font-bold">{engagements.toLocaleString()}</p></div>
                  <div><div className={`flex items-center gap-1 mb-1 text-[13px] ${textSecondary}`}>Detail expands <Info size={14} /></div><p className="text-2xl font-bold">{detailExpands.toLocaleString()}</p></div>
                  <div><div className={`flex items-center gap-1 mb-1 text-[13px] ${textSecondary}`}>Profile visits <Info size={14} /></div><p className="text-2xl font-bold">{profileVisits.toLocaleString()}</p></div>
               </div>
            </div>
          </div>
        </div>
      )}
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
  
  // NEW: State for Tabs
  const [activeTab, setActiveTab] = useState('feed'); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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

//Fetch posts based on activeTab

  const { data: postsData, isLoading: isPostsLoading } = useQuery({
    queryKey: ['posts', activeTab],
    queryFn: async () => (await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts?type=${activeTab}`, { withCredentials: true })).data.posts,
  });

  const { data: trendingTopics, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: async () => (await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/trending`, { withCredentials: true })).data.trending,
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return null;
      return (await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/search?q=${debouncedQuery}`, { withCredentials: true })).data;
    },
    enabled: !!debouncedQuery.trim()
  });

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('content', content);
      
      const extractedTags = content.match(/#[a-z0-9_]+/gi) || [];
      const cleanTags = extractedTags.map(t => t.replace('#', ''));
      formData.append('tags', JSON.stringify(cleanTags.length > 0 ? cleanTags : ["Update"]));
      
      if (userId) formData.append('authorId', userId);
      if (mediaFile) formData.append('media', mediaFile);

      return axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => { 
      setContent(''); 
      removeMedia(); 
      queryClient.invalidateQueries({ queryKey: ['posts'] }); 
      queryClient.invalidateQueries({ queryKey: ['trending'] }); 
      setActiveTab('myposts'); 
    }
  });

  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (file) { setMediaFile(file); setMediaPreview(URL.createObjectURL(file)); }
  };

  const removeMedia = () => { setMediaFile(null); setMediaPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const bgMain = isDarkMode ? 'bg-black' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-[#e7e9ea]' : 'text-[#0f1419]';
  const textSecondary = isDarkMode ? 'text-[#71767b]' : 'text-[#536471]';
  const border = isDarkMode ? 'border-[#2f3336]' : 'border-[#eff3f4]';
  const hoverBg = isDarkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.03]';

  return (
    <div className={`min-h-screen ${bgMain} ${textPrimary} font-sans flex justify-center max-w-325 mx-auto xl:justify-between gap-4 lg:gap-8 px-4 sm:px-8`}>
      <div className="hidden md:flex flex-col w-72 pt-2 sticky top-0 h-screen overflow-y-auto pb-20 pr-4 z-40">
        
        {/* Search Bar */}
        <div ref={searchRef} className="relative w-full">
          <div className={`flex items-center px-4 py-2.5 rounded-full border transition-colors ${isSearchFocused ? 'border-[#1d9bf0] bg-transparent' : isDarkMode ? 'border-transparent bg-[#202327]' : 'border-transparent bg-[#eff3f4]'}`}>
            <Search className={`w-4 h-4 mr-3 ${isSearchFocused ? 'text-[#1d9bf0]' : textSecondary}`} />
            <input 
              type="text" 
              placeholder="Search DapLink" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className={`bg-transparent outline-none w-full text-[15px] placeholder:${textSecondary}`} 
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={`w-5 h-5 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#1d9bf0] text-black' : 'bg-[#1d9bf0] text-white'}`}>
                <X size={12} strokeWidth={3} />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchFocused && searchQuery.trim() !== '' && (
            <div className={`absolute top-13 left-0 w-full rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden border ${isDarkMode ? 'bg-black border-[#2f3336]' : 'bg-white border-[#eff3f4]'}`}>
              {isSearching ? (
                <div className="p-4 text-center text-[15px] text-[#1d9bf0] flex justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div>
              ) : searchResults ? (
                <div>
                  {searchResults.users?.length > 0 && (
                    <div>
                      <div className={`px-4 py-2 text-[15px] font-bold border-b ${border}`}>People</div>
                      {searchResults.users.map(u => (
                        <Link key={u._id} href={`/u/${u.handle.replace('@','')}`} className={`flex items-center gap-3 px-4 py-3 transition-colors ${hoverBg}`}>
                          <img src={u.avatar} className="w-10 h-10 rounded-full object-cover" alt={u.name} />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[15px] truncate">{u.name}</p>
                            <p className={`text-[15px] ${textSecondary} truncate`}>@{u.handle}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchResults.users?.length === 0 && searchResults.posts?.length === 0 && (
                    <div className={`p-4 text-center text-[15px] ${textSecondary}`}>No results for "{searchQuery}"</div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 space-y-2">
           <button 
             onClick={() => setActiveTab('feed')} 
             className={`w-full flex items-center gap-4 px-4 py-3 rounded-full font-bold text-[18px] transition-colors ${activeTab === 'feed' ? 'bg-[#1d9bf0] text-white' : hoverBg}`}
           >
             Feed
           </button>
           <button 
             onClick={() => setActiveTab('myposts')} 
             className={`w-full flex items-center gap-4 px-4 py-3 rounded-full font-bold text-[18px] transition-colors ${activeTab === 'myposts' ? 'bg-[#1d9bf0] text-white' : hoverBg}`}
           >
             My Posts
           </button>
        </div>
      </div>

      {/*MIDDLE COLUMN*/}
      <div className={`w-full max-w-150 border-x ${border} min-h-screen relative`}>
        <div className={`sticky top-0 z-20 backdrop-blur-md bg-opacity-80 border-b ${border} ${isDarkMode ? 'bg-black/80' : 'bg-white/80'}`}>
          <div className="flex items-center justify-between px-4 h-13.25">
            <h1 className="font-bold text-[20px] tracking-tight cursor-pointer">
              {activeTab === 'feed' ? 'DapPost Feed' : 'My Posts'}
            </h1>
            <div className="md:hidden flex gap-2">
               <button onClick={() => setActiveTab('feed')} className={`text-[14px] font-bold ${activeTab === 'feed' ? 'text-[#1d9bf0]' : textSecondary}`}>Feed</button>
               <span className={textSecondary}>|</span>
               <button onClick={() => setActiveTab('myposts')} className={`text-[14px] font-bold ${activeTab === 'myposts' ? 'text-[#1d9bf0]' : textSecondary}`}>My Posts</button>
            </div>

            <button onClick={toggleTheme} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        <div className={`px-4 pt-4 pb-2 border-b ${border} flex gap-3`}>
          <div className="shrink-0 pt-1">
            <img src={daplink?.profile || `https://api.dicebear.com/7.x/avataaars/svg?seed=me`} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What is happening?!"
              className={`w-full bg-transparent outline-none text-[20px] resize-none placeholder:${textSecondary} pt-2 pb-2 overflow-hidden`}
              rows={1}
            />

            {mediaPreview && (
              <div className="relative mt-2 mb-3 rounded-2xl overflow-hidden border border-[#2f3336]">
                <button onClick={removeMedia} className="absolute top-2 right-2 z-10 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full backdrop-blur-sm transition-colors"><X size={18} /></button>
                {mediaFile?.type.startsWith('video/') ? <video src={mediaPreview} controls className="w-full max-h-125 object-cover" /> : <img src={mediaPreview} alt="Upload preview" className="w-full h-auto max-h-125 object-cover" />}
              </div>
            )}

            {content.length > 0 && !mediaPreview && (
              <div className={`border-b ${border} mb-2 w-[90%] mx-auto opacity-50`}></div>
            )}

            <div className="flex items-center justify-between mt-2 pt-1 border-t border-transparent">
              <div className="flex gap-1 text-[#1d9bf0] -ml-2">
                <input type="file" ref={fileInputRef} onChange={handleMediaSelect} accept="image/*,video/*" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#1d9bf0]/10 transition-colors" title="Media"><ImageIcon size={20} /></button>
                <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#1d9bf0]/10 transition-colors"><Code2 size={20} /></button>
              </div>
              <button
                onClick={() => createPostMutation.mutate()}
                disabled={(!content.trim() && !mediaFile) || createPostMutation.isPending}
                className="bg-[#1d9bf0] text-white font-bold px-5 py-1.5 rounded-full text-[15px] hover:bg-[#1a8cd8] disabled:opacity-50 disabled:bg-[#1d9bf0]/50 transition-colors flex items-center gap-2"
              >
                {createPostMutation.isPending && <Loader2 size={16} className="animate-spin" />} Post
              </button>
            </div>
          </div>
        </div>

        <div className="pb-20">
          {isPostsLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-[#1d9bf0]" /></div>
          ) : postsData?.length > 0 ? (
            postsData.map((post) => (
              <PostItem key={post.id} post={post} isDarkMode={isDarkMode} daplinkUser={daplink} currentUser={user} />
            ))
          ) : (
            <div className={`text-center py-10 text-[15px] ${textSecondary}`}>
               {activeTab === 'feed' ? "No posts yet. Be the first to post!" : "You haven't posted anything yet."}
            </div>
          )}
        </div>
      </div>

      {/*RIGHT COLUMN*/}
      <div className="hidden lg:block w-87.5 pt-2 pb-20 space-y-4 sticky top-0 h-screen overflow-y-auto pl-4">
        <div className={`rounded-2xl border flex flex-col ${isDarkMode ? 'bg-[#16181c] border-transparent' : 'bg-[#f7f9f9] border-[#eff3f4]'}`}>
          <h2 className="font-extrabold text-[20px] px-4 py-3">What's happening</h2>
          
          {isTrendingLoading ? (
            <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-[#1d9bf0]" /></div>
          ) : trendingTopics && trendingTopics.length > 0 ? (
            trendingTopics.map((trend, index) => (
              <div key={index} className={`px-4 py-3 cursor-pointer transition-colors ${hoverBg}`}>
                <div className="flex justify-between">
                  <span className={`text-[13px] ${textSecondary}`}>Trending topic</span>
                  <MoreHorizontal size={16} className={textSecondary} />
                </div>
                <p className="font-bold text-[15px] mt-0.5">
                  {trend.tag.startsWith('#') ? trend.tag : `#${trend.tag}`}
                </p>
                <p className={`text-[13px] mt-1 ${textSecondary}`}>{formatNumber(trend.posts * 14)} posts</p>
              </div>
            ))
          ) : (
            <div className={`px-4 py-6 text-center text-[15px] ${textSecondary}`}>
              No trending topics right now. Post something!
            </div>
          )}

          <div className={`px-4 py-3 cursor-pointer rounded-b-2xl transition-colors text-[#1d9bf0] text-[15px] ${hoverBg}`}>
            Show more
          </div>
        </div>
      </div>
      
    </div>
  );
}