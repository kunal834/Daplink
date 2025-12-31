"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { io } from "socket.io-client";
import { 
  Send, 
  User, 
  Briefcase, 
  Sparkles, 
  Search, 
  Loader2 
} from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

// 1. Import the Theme Context
import { useTheme } from '@/context/ThemeContext';

const UserProfile = ({ params }) => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. Access the theme
  const { theme } = useTheme();

  // 3. Define Dynamic Colors based on theme
  const colors = {
    bg: theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-slate-50',
    text: theme === 'dark' ? 'text-slate-100' : 'text-slate-900',
    subtext: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
    headingAccent: theme === 'dark' ? 'from-purple-400 to-blue-400' : 'from-purple-600 to-blue-500',
    
    // Card Styles
    card: theme === 'dark' ? 'bg-[#161616] border-slate-800' : 'bg-white border-slate-200',
    cardHover: theme === 'dark' ? 'hover:border-purple-500/40' : 'hover:border-purple-200',
    cardInnerAvatar: theme === 'dark' ? 'from-slate-800 to-slate-900 text-slate-300' : 'from-slate-100 to-slate-200 text-slate-400',
    
    // Badges/Pills
    pill: theme === 'dark' ? 'bg-purple-500/10 text-purple-300' : 'bg-purple-100 text-purple-700',
    tag: theme === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-100',
    proBadge: theme === 'dark' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-700 border-green-100',

    // Buttons
    btnPrimary: theme === 'dark' ? 'bg-slate-100 text-slate-900 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800',
    btnSecondary: theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200',
    btnMessage: theme === 'dark' ? 'bg-purple-700 hover:bg-purple-600' : 'bg-slate-900 hover:bg-purple-600',
    
    // Empty State
    emptyState: theme === 'dark' ? 'bg-[#161616] border-slate-800' : 'bg-white border-slate-300',
    emptyIcon: theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-50 text-slate-300',
  };

  const handleFetchAll = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/Peoples'); 
      console.log(response.data); 
      setPeople(response.data.result); 
      setLoading(false);
    } catch (error) {
      console.error("Error fetching people:", error);
      setLoading(false);
    }
  };

  const handleSendMessage = (targetUserId, targetUserHandle) => {
    console.log(`Preparing to send message to User ID: ${targetUserId} (@${targetUserHandle})`);
    
    io.emit('start_private_chat', {
        senderId: params.handle,
        recipientId: targetUserId,
    });
    
    alert(`Messaging feature placeholder: Opening chat with @${targetUserHandle}`);
  };

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : "??";

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${colors.bg}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* 1. Header Section */}
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${colors.pill}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Hello @{params.handle}
            </div>
            
            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight ${colors.text}`}>
              Discover <span className={`text-transparent bg-clip-text bg-gradient-to-r ${colors.headingAccent}`}>Creators</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-lg ${colors.subtext}`}>
              {`Connect with developers, designers, and innovators within the Daplink ecosystem.`}
            </p>

            {/* Load Button */}
            <div className="mt-6">
              <button 
                onClick={handleFetchAll}
                disabled={loading}
                className={`
                  relative overflow-hidden group px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl
                  ${colors.btnPrimary}
                  ${loading ? "cursor-not-allowed opacity-80" : ""}
                `}
              >
                <span className="flex items-center gap-2">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  {loading ? "Discovering..." : "Explore Community"}
                </span>
              </button>
            </div>
          </div>

          {/* 2. The Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {people.map((user, index) => (
              <div 
                key={user._id || index} 
                className={`group relative rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${colors.card} ${colors.cardHover}`}
              >
                {/* Decorative Banner */}
                <div className="h-24 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="px-6 pb-6 relative">
                  {/* Floating Avatar */}
                  <div className="-mt-12 mb-4">
                    <div className={`h-20 w-20 rounded-2xl p-1 shadow-md inline-block transform rotate-3 group-hover:rotate-0 transition-transform duration-300 ${theme === 'dark' ? 'bg-[#161616]' : 'bg-white'}`}>
                      <div className={`h-full w-full rounded-xl bg-gradient-to-br flex items-center justify-center font-bold text-xl ${colors.cardInnerAvatar}`}>
                        {getInitials(user.handle)}
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`text-xl font-bold transition-colors group-hover:text-purple-500 ${colors.text}`}>
                        @{user.handle || "Incognito"}
                      </h3>
                      <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide mt-1 ${colors.subtext}`}>
                        <Briefcase className="w-3.5 h-3.5" />
                        {user.profession || "Creator"}
                      </div>
                    </div>
                    {/* Badge */}
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${colors.proBadge}`}>
                      Pro
                    </span>
                  </div>

                  {/* Bio */}
                  <p className={`text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
                    {user.bio || "Building something amazing on Daplink. Ask me about my projects!"}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                     <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${colors.tag}`}>
                        <Sparkles className="w-3 h-3 text-yellow-500" />
                        Daplink User
                     </span>
                  </div>

                  {/* Action Bar */}
                  <div className={`grid grid-cols-2 gap-3 pt-4 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                    <Link 
                      href={`/${user.handle}`} 
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${colors.btnSecondary}`}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    
                    <button
                      onClick={() => handleSendMessage(user._id, user.handle)}
                      disabled={user.handle === params.handle}
                      className={`
                        flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all
                        ${user.handle === params.handle 
                          ? (theme === 'dark' ? "bg-slate-800 text-slate-600 cursor-not-allowed" : "bg-slate-300 cursor-not-allowed") 
                          : `${colors.btnMessage} shadow-md hover:shadow-lg`}
                      `}
                    >
                      <Send className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {people.length === 0 && !loading && (
            <div className={`text-center py-20 rounded-3xl border border-dashed ${colors.emptyState}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${colors.emptyIcon}`}>
                <Search className="w-8 h-8" />
              </div>
              <h3 className={`text-lg font-semibold ${colors.text}`}>No creators found yet</h3>
              <p className={`max-w-sm mx-auto mt-2 text-sm ${colors.subtext}`}>
               {`Click the "Explore Community" button above to fetch the latest users from the database.`}
              </p>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;