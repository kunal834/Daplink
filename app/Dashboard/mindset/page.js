"use client";

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Heart, MessageSquare, Repeat2, Share, 
  Code2, MoreHorizontal, CheckCircle2,
  Sun, Moon, Loader2, Check, BarChart2,
  Image as ImageIcon, X 
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext'; 
import { useAuth } from '@/context/Authenticate';
import Image from 'next/image';

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

// ==========================================
// INDIVIDUAL POST COMPONENT
// ==========================================
const PostItem = ({ post, isDarkMode, daplinkUser }) => {
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);

  const textPrimary = isDarkMode ? 'text-[#e7e9ea]' : 'text-[#0f1419]';
  const textSecondary = isDarkMode ? 'text-[#71767b]' : 'text-[#536471]';
  const border = isDarkMode ? 'border-[#2f3336]' : 'border-[#eff3f4]';
  const hoverBg = isDarkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.03]';

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

  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}/comments`, { withCredentials: true });
      return res.data.comments;
    },
    enabled: showComments, 
  });

  const postCommentMutation = useMutation({
    mutationFn: async () => axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${post.id}/comments`, { content: commentText }, { withCredentials: true }),
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
    return url.match(/\.(mp4|webm|ogg)$/i) || post.mediaType === 'video';
  };

  return (
    <div className={`px-4 pt-3 pb-2 border-b ${border} ${hoverBg} transition-colors duration-200 cursor-pointer`}>
      <div className="flex gap-3 relative">
        <div className="flex flex-col items-center shrink-0">
          <img src={post.avatar} className="w-10 h-10 rounded-full object-cover z-10" alt={post.name} />
          {showComments && (
            <div className={`w-0.5 h-full mt-2 rounded-full ${isDarkMode ? 'bg-[#333639]' : 'bg-[#cfd9de]'}`}></div>
          )}
        </div>

        <div className="flex-1 min-w-0 pb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5 truncate">
              <span className={`font-bold text-[15px] hover:underline truncate ${textPrimary}`}>{post.name}</span>
              {post.verified && <CheckCircle2 size={16} className="text-[#1d9bf0] fill-white dark:fill-black shrink-0 relative top-0.5" />}
              <span className={`text-[15px] ${textSecondary} truncate`}>{post.handle}</span>
              <span className={`text-[15px] ${textSecondary}`}>·</span>
              <span className={`text-[15px] ${textSecondary} hover:underline`}>{timeAgo(post.time)}</span>
            </div>
            <button className={`p-2 rounded-full hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors ${textSecondary}`}>
              <MoreHorizontal size={18} />
            </button>
          </div>

          <p className={`mt-0.5 text-[15px] leading-5 whitespace-pre-wrap wrap-break-word ${textPrimary}`}>
            {post.content}
          </p>

          {/* MEDIA RENDERER */}
          {post.mediaUrl && (
            <div className={`mt-3 rounded-2xl overflow-hidden border ${border} bg-black/5`}>
              {isVideo(post.mediaUrl) ? (
                <video 
                  src={post.mediaUrl} 
                  controls 
                  className="w-full max-h-125 object-cover bg-black"
                  onClick={(e) => e.stopPropagation()} 
                />
              ) : (
                <img 
                  src={post.mediaUrl} 
                  alt="Post content" 
                  className="w-full h-auto max-h-125 object-cover" 
                />
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
              <button className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#00ba7c]/10 transition-colors">
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

      {/* INLINE COMMENTS */}
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
                   <img src={comment.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.handle}`} className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" alt={comment.author.handle} />
                   <div className="flex-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`font-bold text-[15px] ${textPrimary}`}>{comment.author.handle}</span>
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
  
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(52, textareaRef.current.scrollHeight)}px`;
    }
  }, [content]);

  const { data: daplink } = useQuery({
  queryKey: ['daplink', user?.daplinkID?.toString()],
  queryFn: async () => {
    const id = typeof user.daplinkID === 'object' ? user.daplinkID._id : user.daplinkID;
    const res = await axios.get(`/api/getDaplink?daplinkID=${id}`);
    return res.data;
  },
  enabled: !!user?.daplinkID,
});

  const { data: postsData, isLoading: isPostsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => (await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`, { withCredentials: true })).data.posts,
  });

  const createPostMutation = useMutation({
    // Updated to use FormData to support file uploads to your backend
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('tags', JSON.stringify(["Update"]));
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
        
        {/* Navbar */}
        <div className={`sticky top-0 z-20 backdrop-blur-md bg-opacity-80 border-b ${border} ${isDarkMode ? 'bg-black/80' : 'bg-white/80'}`}>
          <div className="flex items-center justify-between px-4 h-13.25">
            <h1 className="font-bold text-[20px] tracking-tight cursor-pointer">DapFeed</h1>
            <button onClick={toggleTheme} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Composer */}
        <div className={`px-4 pt-4 pb-2 border-b ${border} flex gap-3`}>
          <div className="shrink-0 pt-1">
            {daplink?.profile ? (
              <Image src={daplink.profile} alt="Avatar" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
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

            {/* Media Preview Box */}
            {mediaPreview && (
              <div className="relative mt-2 mb-3 rounded-2xl overflow-hidden border border-[#2f3336]">
                <button 
                  onClick={removeMedia}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full backdrop-blur-sm transition-colors"
                >
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
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleMediaSelect} 
                  accept="image/*,video/*" 
                  className="hidden" 
                />
                
                {/* Image/Video Upload Button */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#1d9bf0]/10 transition-colors"
                  title="Media"
                >
                  <ImageIcon size={20} />
                </button>

                <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#1d9bf0]/10 transition-colors">
                  <Code2 size={20} />
                </button>
              </div>

              <button 
                onClick={() => createPostMutation.mutate()}
                disabled={(!content.trim() && !mediaFile) || createPostMutation.isPending}
                className="bg-[#1d9bf0] text-white font-bold px-4 py-1.5 rounded-full text-[15px] hover:bg-[#1a8cd8] disabled:opacity-50 disabled:bg-[#1d9bf0]/50 transition-colors"
              >
                {createPostMutation.isPending ? <Loader2 size={18} className="animate-spin mx-2" /> : "Post"}
              </button>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="pb-20">
          {isPostsLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-[#1d9bf0]" /></div>
          ) : (
            postsData?.map((post) => (
              <PostItem key={post.id} post={post} isDarkMode={isDarkMode} daplinkUser={daplink} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}