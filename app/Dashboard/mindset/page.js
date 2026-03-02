"use client";

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Heart, MessageSquare, Repeat2, Share,
  Code2, MoreHorizontal, CheckCircle2,
  Sun, Moon, Loader2, Check, BarChart2,
  Image as ImageIcon, X
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

// INDIVIDUAL POST COMPONENT
const PostItem = ({ post, isDarkMode, daplinkUser, currentUser }) => {
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
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

  if (!displayName || displayName === "Unknown User") {
    displayName = authorObj?.name || authorObj?.handle || authorObj?.daplinkID?.handle || "Unknown User";
  }

  if (!displayHandle || displayHandle === "@unknown" || displayHandle === "unknown") {
    displayHandle = authorObj?.handle || authorObj?.daplinkID?.handle || "unknown";
  }

  if (displayHandle && !displayHandle.startsWith('@')) {
    displayHandle = `@${displayHandle}`;
  }

  if (!displayAvatar || displayAvatar.includes('unknown')) {
    displayAvatar = authorObj?.avatar || authorObj?.profile || authorObj?.daplinkID?.profile || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayHandle}`;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLikeMutation = useMutation({
    mutationFn: async () => axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}/like`, {}, { withCredentials: true }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (old) => old.map(p =>
        p.id === post.id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      ));
      return { previousPosts };
    },
    onError: (err, variables, context) => queryClient.setQueryData(['posts'], context.previousPosts),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
  });

  const repostMutation = useMutation({
    mutationFn: async () => axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}/repost`, {}, { withCredentials: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
    onError: (error) => {
      toast.error("Failed to repost");
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async () => axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}`, { withCredentials: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
    onError: (error) => {
      toast.error("Failed to delete post");
    }
  });

  const editPostMutation = useMutation({
    mutationFn: async () => axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}`, { content: editContent }, { withCredentials: true }),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      toast.error("Failed to edit post");
    }
  });

  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}/comments`, { withCredentials: true });
      return res.data.comments;
    },
    enabled: showComments,
  });

  const postCommentMutation = useMutation({
    mutationFn: async () => axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}/comments`, { content: commentText, authorId: uId }, { withCredentials: true }),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ['comments', post.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const handleCopy = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isVideo = (url) => {
    if (!url) return false;
    if (post.mediaType === 'video') return true;
    return url.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  return (
    <div className={`px-4 pt-3 pb-2 border-b ${border} ${hoverBg} transition-colors duration-200 cursor-pointer`}>
      <div className="flex gap-3 relative">
        <div className="flex flex-col items-center shrink-0">
          <img src={displayAvatar} className="w-10 h-10 rounded-full object-cover z-10" alt={displayName} />
          {showComments && (
            <div className={`w-0.5 h-full mt-2 rounded-full ${isDarkMode ? 'bg-[#333639]' : 'bg-[#cfd9de]'}`}></div>
          )}
        </div>

        <div className="flex-1 min-w-0 pb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5 truncate">
              <span className={`font-bold text-[15px] hover:underline truncate ${textPrimary}`}>{displayName}</span>
              {post.verified && <CheckCircle2 size={16} className="text-[#1d9bf0] fill-white dark:fill-black shrink-0 relative top-0.5" />}
              <span className={`text-[15px] ${textSecondary} truncate`}>{displayHandle}</span>
              <span className={`text-[15px] ${textSecondary}`}>·</span>
              <span className={`text-[15px] ${textSecondary} hover:underline`}>{timeAgo(post.time)}</span>
            </div>

            <div className="relative" ref={menuRef}>
              <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} className={`p-2 rounded-full hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors ${textSecondary}`}>
                <MoreHorizontal size={18} />
              </button>

              {isMenuOpen && (
                <div className={`absolute right-0 top-full mt-1 w-36 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden z-50 ${isDarkMode ? 'bg-black border border-gray-800' : 'bg-white border border-gray-200'}`}>
                  {isOwner ? (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-3 text-[15px] font-bold transition-colors ${isDarkMode ? 'hover:bg-white/5 text-gray-200' : 'hover:bg-black/5 text-gray-800'}`}>
                        Edit post
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deletePostMutation.mutate(); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-3 text-[15px] font-bold text-[#f4212e] transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
                        Delete
                      </button>
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
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className={`w-full bg-transparent border rounded-lg p-3 outline-none resize-none ${border} ${textPrimary} text-[15px] focus:border-[#1d9bf0] transition-colors`}
                rows={3}
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => { setIsEditing(false); setEditContent(post.content); }} className={`px-4 py-1.5 rounded-full text-[14px] font-bold ${textPrimary} border ${border} hover:bg-gray-500/10 transition-colors`}>
                  Cancel
                </button>
                <button onClick={() => editPostMutation.mutate()} disabled={editPostMutation.isPending || !editContent.trim()} className="px-4 py-1.5 bg-[#1d9bf0] text-white rounded-full text-[14px] font-bold hover:bg-[#1a8cd8] transition-colors disabled:opacity-50 flex items-center gap-2">
                  {editPostMutation.isPending && <Loader2 size={14} className="animate-spin" />} Save
                </button>
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

          <div className={`flex items-center justify-between mt-3 max-w-106.25 ${textSecondary}`}>
            <div className="flex items-center group text-[13px] hover:text-[#1d9bf0] transition-colors">
              <button onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }} className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#1d9bf0]/10 transition-colors">
                <MessageSquare size={18} />
              </button>
              <span className="px-1">{post.comments > 0 ? post.comments : ''}</span>
            </div>

            <div className="flex items-center group text-[13px] hover:text-[#00ba7c] transition-colors">
              <button onClick={(e) => { e.stopPropagation(); repostMutation.mutate(); }} className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#00ba7c]/10 transition-colors">
                <Repeat2 size={18} />
              </button>
              <span className="px-1">{post.shares > 0 ? post.shares : ''}</span>
            </div>

            <div className="flex items-center group text-[13px] hover:text-[#f91880] transition-colors">
              <button onClick={(e) => { e.stopPropagation(); toggleLikeMutation.mutate(); }} className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#f91880]/10 transition-colors">
                <Heart size={18} className={post.liked ? "fill-[#f91880] text-[#f91880]" : ""} />
              </button>
              <span className={`px-1 ${post.liked ? 'text-[#f91880]' : ''}`}>{post.likes > 0 ? post.likes : ''}</span>
            </div>

            <div className="items-center group text-[13px] hover:text-[#1d9bf0] transition-colors hidden sm:flex">
              <button className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#1d9bf0]/10 transition-colors">
                <BarChart2 size={18} />
              </button>
            </div>

            <div className="flex items-center group text-[13px] hover:text-[#1d9bf0] transition-colors">
              <button onClick={handleCopy} className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#1d9bf0]/10 transition-colors">
                {copied ? <Check size={18} className="text-[#00ba7c]" /> : <Share size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="pl-13 pr-2 pt-2 mt-1 relative z-10" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-3 items-center mb-4">
            {daplinkUser?.profile ? (
              <img src={daplinkUser.profile} className="w-8 h-8 rounded-full object-cover shrink-0" alt="Me" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse shrink-0" />
            )}
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Post your reply"
              className={`flex-1 bg-transparent text-[15px] outline-none ${textPrimary} placeholder:${textSecondary}`}
              onKeyDown={(e) => { if (e.key === 'Enter' && commentText.trim()) postCommentMutation.mutate(); }}
            />
            <button
              onClick={() => postCommentMutation.mutate()}
              disabled={!commentText.trim() || postCommentMutation.isPending}
              className="bg-[#1d9bf0] text-white font-bold px-4 py-1.5 rounded-full text-[14px] hover:bg-[#1a8cd8] disabled:opacity-50 disabled:bg-[#1d9bf0]/50 transition-colors"
            >
              Reply
            </button>
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
    </div>
  );
};

// MAIN FEED COMPONENT
export default function DaplinkCommunityFeed() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const queryClient = useQueryClient();

  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(52, textareaRef.current.scrollHeight)}px`;
    }
  }, [content]);

  const extractedId = typeof user?.daplinkID === 'object'
    ? (user.daplinkID._id || user.daplinkID.id)
    : user?.daplinkID;
  const safeId = String(extractedId);
  
  const userId = user?._id || user?.id;

  const { data: daplink } = useQuery({
    queryKey: ['daplink', safeId],
    queryFn: async () => {
      const res = await axios.get(`/api/getDaplink?daplinkID=${safeId}`);
      return res.data;
    },
    enabled: !!extractedId && safeId !== '[object Object]' && safeId !== 'undefined',
  });

  const { data: postsData, isLoading: isPostsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => (await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`, { withCredentials: true })).data.posts,
  });

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('tags', JSON.stringify(["Update"]));

      if (userId) {
        formData.append('authorId', userId);
      }

      if (mediaFile) {
        formData.append('media', mediaFile);
      }

      return axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    },
    onSuccess: () => {
      setContent('');
      removeMedia();
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const bgMain = isDarkMode ? 'bg-black' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-[#e7e9ea]' : 'text-[#0f1419]';
  const textSecondary = isDarkMode ? 'text-[#71767b]' : 'text-[#536471]';
  const border = isDarkMode ? 'border-[#2f3336]' : 'border-[#eff3f4]';

  return (
    <div className={`min-h-screen ${bgMain} ${textPrimary} font-sans flex justify-center`}>
      <div className={`w-full max-w-150 border-x ${border} min-h-screen relative`}>

        <div className={`sticky top-0 z-20 backdrop-blur-md bg-opacity-80 border-b ${border} ${isDarkMode ? 'bg-black/80' : 'bg-white/80'}`}>
          <div className="flex items-center justify-between px-4 h-13.25">
            <h1 className="font-bold text-[20px] tracking-tight cursor-pointer">DapPost</h1>
            <button onClick={toggleTheme} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        <div className={`px-4 pt-4 pb-2 border-b ${border} flex gap-3`}>
          <div className="shrink-0 pt-1">
            {daplink?.profile ? (
              <img src={daplink.profile} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
            ) : <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />}
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
                <button onClick={removeMedia} className="absolute top-2 right-2 z-10 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full backdrop-blur-sm transition-colors">
                  <X size={18} />
                </button>
                {mediaFile?.type.startsWith('video/') ? (
                  <video src={mediaPreview} controls className="w-full max-h-125 object-cover" />
                ) : (
                  <img src={mediaPreview} alt="Upload preview" className="w-full h-auto max-h-125 object-cover" />
                )}
              </div>
            )}

            {content.length > 0 && !mediaPreview && (
              <div className={`border-b ${border} mb-2 w-[90%] mx-auto opacity-50`}></div>
            )}

            <div className="flex items-center justify-between mt-2 pt-1 border-t border-transparent">
              <div className="flex gap-1 text-[#1d9bf0] -ml-2">
                <input type="file" ref={fileInputRef} onChange={handleMediaSelect} accept="image/*,video/*" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#1d9bf0]/10 transition-colors" title="Media">
                  <ImageIcon size={20} />
                </button>
                <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#1d9bf0]/10 transition-colors">
                  <Code2 size={20} />
                </button>
              </div>

              <button
                onClick={() => createPostMutation.mutate()}
                disabled={(!content.trim() && !mediaFile) || createPostMutation.isPending}
                className="bg-[#1d9bf0] text-white font-bold px-4 py-1.5 rounded-full text-[15px] hover:bg-[#1a8cd8] disabled:opacity-50 disabled:bg-[#1d9bf0]/50 transition-colors flex items-center gap-2"
              >
                {createPostMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                Post
              </button>
            </div>
          </div>
        </div>

        <div className="pb-20">
          {isPostsLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-[#1d9bf0]" /></div>
          ) : (
            postsData?.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                isDarkMode={isDarkMode}
                daplinkUser={daplink}
                currentUser={user}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}