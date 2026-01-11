"use client";

import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Link as LinkIcon, 
  Code2, 
  Zap, 
  MoreHorizontal, 
  CheckCircle2,
  Trophy,
  Rocket,
  Sun,
  Moon,
  Send
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/context/ThemeContext'; 
import { useAuth } from '@/context/Authenticate';
import Image from 'next/image';

export default function DaplinkCommunityFeed() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); 
  const isDarkMode = theme === 'dark';

   const { data: daplink } = useQuery({
      queryKey: ['daplink', user?.daplinkID],
      queryFn: async () => {
        const res = await axios.get(
          `/api/getDaplink?daplinkID=${user?.daplinkID}`
        );
        return res.data;
      },
      enabled: !!user?.daplinkID,
      staleTime: 10 * 60 * 1000,
    });
  

  // Removed activeTab state as we no longer have tabs
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const [posts, setPosts] = useState([
    {
      id: 1,
      name: "Prashant Kumar Rajak",
      handle: "@prashant_co",
      role: "Co-Founder",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prashant",
      content: "Just pushed the new caching layer to production! 🚀 The load balancing issues we had with the WebSocket connections should be resolved now. Daplink is running smoother than ever on Vercel.",
      time: "2h ago",
      likes: 42,
      comments: 8,
      shares: 5,
      tags: ["DevLog", "Scaling"],
      xpReward: "+50 XP",
      verified: true,
      liked: false
    },
    {
      id: 2,
      name: "Daplink System",
      handle: "@daplink_bot",
      role: "System",
      avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=Daplink",
      content: "🎉 Milestone Alert! We have officially secured the domain 'daplink.online'. DNS propagation is complete. Update your bios now!",
      time: "5h ago",
      likes: 128,
      comments: 14,
      shares: 30,
      tags: ["Announcement"],
      xpReward: null,
      verified: true,
      liked: true
    },
    {
      id: 3,
      name: "Alex Dev",
      handle: "@alex_builds",
      role: "Pro Member",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      content: "Just shipped my new portfolio using Daplink! Check out the custom CSS integration I added for the dark mode toggle. 👇",
      time: "4h ago",
      likes: 24,
      comments: 6,
      shares: 2,
      tags: ["Showcase", "Frontend"],
      xpReward: "+15 XP",
      verified: false,
      liked: false
    }
  ]);

  const handlePost = () => {
    if (!content.trim()) return;
    setIsPosting(true);

    setTimeout(() => {
      const newPost = {
        id: Date.now(),
        name: "You",
        handle: "@founder",
        role: "Founder",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        content: content,
        time: "Just now",
        likes: 0,
        comments: 0,
        shares: 0,
        tags: ["Update"],
        xpReward: "+10 XP",
        verified: true,
        liked: false
      };

      setPosts([newPost, ...posts]);
      setContent('');
      setIsPosting(false);
    }, 600);
  };

  const toggleLike = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post
    ));
  };

  // Dynamic Theme Classes
  const bgMain = isDarkMode ? 'bg-[#0a0a0a]' : 'bg-[#FDFDFD]';
  const bgCard = isDarkMode ? 'bg-[#121212]' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const border = isDarkMode ? 'border-gray-800' : 'border-gray-200';
  const accent = 'text-violet-600';
  const accentBg = 'bg-violet-600';

  return (
    <div className={`min-h-screen ${bgMain} ${textPrimary} font-sans flex justify-center transition-colors duration-300`}>
      
      {/* Feed Container */}
      <div className={`w-full max-w-[600px] border-x ${border} min-h-screen relative`}>
        
        {/* Navbar / Header */}
        <div className={`sticky top-0 z-20 backdrop-blur-xl bg-opacity-90 border-b ${border} ${bgMain} transition-colors duration-300`}>
          <div className="flex items-center justify-between px-4 py-3">
            
            {/* Logo */}
            <h1 className="font-black text-xl tracking-tight flex items-center gap-2">
              <span className={`w-8 h-8 rounded-lg $ flex items-center justify-center text-white`}>
               <img src="/innovate.png" alt="" />
              </span>
             {` DapLink`}<span className={textSecondary}>{`.feed`}</span>
            </h1>

            {/* Right Side: XP Badge + Theme Toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                <Trophy size={12} />
               
              </div>
              
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
          {/* Tabs removed here */}
        </div>

        {/* CREATE POST SECTION (The "Composer") */}
        <div className={`p-4 border-b ${border} ${bgCard} transition-colors duration-300`}>
          <div className="flex gap-3">
             <Image
                          src={daplink?.profile}
                          alt="User avatar"

                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full border border-gray-700/10"
                        />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's building? Share a project update or link..."
                className={`w-full bg-transparent outline-none text-lg resize-none placeholder:text-gray-500 min-h-[80px] ${textPrimary}`}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  <button className={`p-2 rounded-full hover:bg-violet-500/10 ${accent} transition-colors`} title="Attach Code Snippet">
                    <Code2 size={20} />
                  </button>
                  <button className={`p-2 rounded-full hover:bg-violet-500/10 transition-colors`} title="Add Link">
                    <LinkIcon size={20} />
                  </button>
                </div>
                <button 
                  onClick={handlePost}
                  disabled={!content.trim() || isPosting}
                  className={`
                    flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-bold text-white transition-all shadow-lg shadow-violet-500/20 
                    ${content.trim() 
                      ? `${accentBg} hover:bg-violet-700 transform hover:-translate-y-0.5` 
                      : 'bg-gray-700 cursor-not-allowed opacity-50'
                    }
                  `}
                >
                  {isPosting ? 'Posting...' : (
                    <>
                      Post <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed Stream */}
        <div>
          {posts.map((post) => (
            <div key={post.id} className={`p-5 border-b ${border} ${bgCard} hover:bg-opacity-80 transition-colors duration-300 cursor-pointer group`}>
              
              {/* Repost Context */}
              {post.tags.includes('Announcement') && (
                <div className={`flex items-center gap-2 mb-2 text-xs font-bold ${textSecondary} ml-12`}>
                  <Zap size={12} className="text-yellow-500 fill-current" />
                  <span>Pinned Update</span>
                </div>
              )}

              <div className="flex gap-4">
                <img src={post.avatar} className="w-12 h-12 rounded-full border border-gray-700/10" alt={post.name} />
                
                <div className="flex-1">
                  {/* Post Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                      <div className="flex items-center gap-1">
                        <span className={`font-bold text-[15px] hover:underline ${textPrimary}`}>{post.name}</span>
                        {post.verified && <CheckCircle2 size={14} className={`${accent} fill-white dark:fill-black`} />}
                      </div>
                      <div className="flex items-center gap-2">
                         <span className={`text-xs px-1.5 py-0.5 rounded border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'} ${textSecondary}`}>
                          {post.role}
                        </span>
                        <span className={`text-sm ${textSecondary}`}>· {post.time}</span>
                      </div>
                    </div>
                    <button className={`p-1.5 rounded-full hover:bg-gray-500/10 ${textSecondary}`}>
                      <MoreHorizontal size={16} />
                    </button>
                  </div>

                  {/* Post Body */}
                  <p className={`mt-1 leading-relaxed text-[15px] whitespace-pre-wrap ${textPrimary}`}>
                    {post.content}
                  </p>

                  {/* Tags & Badges */}
                  <div className="flex items-center gap-2 mt-3 mb-1">
                    {post.tags.map(tag => (
                      <span key={tag} className={`text-xs font-medium px-2 py-0.5 rounded-md ${isDarkMode ? 'bg-violet-900/30 text-violet-300' : 'bg-violet-50 text-violet-700'}`}>
                        {tag}
                      </span>
                    ))}
                    {post.xpReward && (
                      <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <Rocket size={12} /> {post.xpReward}
                      </span>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className={`flex items-center justify-between mt-3 max-w-[85%] ${textSecondary}`}>
                    <button className="flex items-center gap-2 group hover:text-blue-500 transition-colors">
                      <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                        <MessageSquare size={18} />
                      </div>
                      <span className="text-xs font-medium">{post.comments > 0 && post.comments}</span>
                    </button>

                    <button className="flex items-center gap-2 group hover:text-green-500 transition-colors">
                      <div className="p-2 rounded-full group-hover:bg-green-500/10">
                        <Share2 size={18} />
                      </div>
                      <span className="text-xs font-medium">{post.shares > 0 && post.shares}</span>
                    </button>

                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                      className={`flex items-center gap-2 group transition-colors ${post.liked ? 'text-pink-600' : 'hover:text-pink-600'}`}
                    >
                      <div className={`p-2 rounded-full group-hover:bg-pink-500/10`}>
                        <Heart size={18} className={post.liked ? "fill-current" : ""} />
                      </div>
                      <span className="text-xs font-medium">{post.likes > 0 && post.likes}</span>
                    </button>
                    
                    <button className="flex items-center gap-2 group hover:text-violet-500 transition-colors">
                      <div className="p-2 rounded-full group-hover:bg-violet-500/10">
                         <LinkIcon size={18} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}