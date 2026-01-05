'use client';
import React, { useEffect, useRef } from 'react';
import { CheckCircle, Youtube, Briefcase, Zap, Instagram, Twitter, Linkedin, DollarSign, ArrowRight } from 'lucide-react';
import Reveal from './ui/Reveal';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/context/Authenticate';



// Helper Component for the Phone Elements
function PhoneLinkItem({ theme, icon: Icon, color, bg, title, sub }) {
  return (
    <div className={`group p-3 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border hover:scale-[1.02] ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-white hover:bg-gray-50 border-gray-100 shadow-sm'}`}>
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center ${color} group-hover:bg-opacity-100 group-hover:text-white transition-colors`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</p>
        <p className="text-[10px] text-gray-400">{sub}</p>
      </div>
      <ArrowRight className={`-rotate-45 transition-colors ${theme === 'dark' ? 'text-gray-600 group-hover:text-white' : 'text-gray-300 group-hover:text-black'}`} size={14} />
    </div>
  );
}

export default function HeroSection({ theme }) {
  const tiltRef = useRef(null);
  const contentRef = useRef(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const container = contentRef.current;
    const element = tiltRef.current;
    if (!container || !element) return;

    const handleMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = x / rect.width;
      const yPct = y / rect.height;
      // Subtle tilt effect
      element.style.transform = `perspective(1000px) rotateX(${(0.5 - yPct) * 8}deg) rotateY(${(xPct - 0.5) * 8}deg)`;
    };

    const handleLeave = () => {
      element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    };

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', handleLeave);
    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <section className="relative pt-20 md:pt-32 overflow-hidden min-h-screen flex">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content: Text & Input */}
          {/* CHANGED: Alignment classes (items-center -> items-start on large screens) */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-10 lg:order-1 order-1">
            
            {/* Badge */}
            <Reveal delayClass="stagger-1">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md transition-colors cursor-default ${theme === 'dark' ? 'bg-white/5 border-white/10 text-teal-300' : 'bg-teal-50 border-teal-100 text-teal-700'}`}>
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-teal-200">v2.0 is Live</span>
              </div>
            </Reveal>
            
            {/* Headline */}
            <div className="mb-6 max-w-2xl">
              <Reveal delayClass="stagger-2">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1]">
                  One Link To
                </h1>
              </Reveal>
              <Reveal delayClass="stagger-3">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] gradient-text pb-2">
                  Rule Them All.
                </h1>
              </Reveal>
            </div>
            
            {/* Subtext */}
            <Reveal delayClass="stagger-4">
              <p className="text-lg sm:text-xl text-secondary mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                DapLink is your digital identity hub. Connect your content, grow your audience, and showcase everything in one beautiful link.
              </p>
            </Reveal>

            {/* Input Group */}
            {/* CHANGED: Added lg:mx-0 to fix desktop centering issue */}
            <Reveal delayClass="stagger-4" className="w-full max-w-md mx-auto lg:mx-0 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>
              
              <div 
                className={`relative flex items-center border rounded-xl p-1.5 sm:p-2 shadow-2xl h-14 sm:h-16 transition-colors duration-500 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}
                style={{ backgroundColor: theme === 'dark' ? '#0A0A0A' : '#ffffff' }}
              >
                {/* CHANGED: Font sizes and spacing for mobile responsiveness */}
                <span className={`hidden sm:block pl-3 font-medium text-base sm:text-lg select-none transition-colors duration-500 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  daplink.app/
                </span>
                <span className={`sm:hidden pl-2 font-medium text-base select-none transition-colors duration-500 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  /
                </span>
                
                <input 
                  type="text" 
                  placeholder="username" 
                  className={`flex-1 min-w-0 bg-transparent border-none focus:ring-0 font-medium ml-1 outline-none text-base sm:text-lg h-full ${theme === 'dark' ? 'text-white placeholder-gray-600' : 'text-black placeholder-gray-400'}`}
                />
                
             {isAuthenticated ? <Link href="/Dashboard" className={`shimmer-btn h-full px-4 sm:px-6 rounded-lg font-bold text-xs sm:text-sm whitespace-nowrap active:scale-95 flex items-center justify-center ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                Claim Link
              </Link> : <Link href="/login" className={`shimmer-btn h-full px-4 sm:px-6 rounded-lg font-bold text-xs sm:text-sm whitespace-nowrap active:scale-95 flex items-center justify-center ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                Claim Link
              </Link>}
              </div>
              
              {/* Footer Text */}
              {/* CHANGED: Center on mobile, left on desktop */}
              <p className="text-xs text-secondary mt-4 flex items-center justify-center lg:justify-start gap-2 opacity-80">
                <CheckCircle className="text-teal-500 w-3 h-3" /> Free forever &middot; No card required
              </p>
            </Reveal>

            {/* Social Proof */}
            {/* CHANGED: Center on mobile, left on desktop */}
            <Reveal delayClass="stagger-4" className="mt-10 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                {[1, 5, 8].map(i => (
                  <img key={i} className={`w-10 h-10 rounded-full border-2 ${theme === 'dark' ? 'border-black' : 'border-white'}`} src={`https://i.pravatar.cc/100?img=${i}`} alt="User" />
                ))}
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold ${theme === 'dark' ? 'border-black bg-gray-800 text-white' : 'border-white bg-gray-100 text-black'}`}>+50k</div>
              </div>
              <div className="text-sm text-secondary">
                Trusted by <strong className={theme === 'dark' ? 'text-white' : 'text-black'}>50k+</strong> creators.
              </div>
            </Reveal>
          </div>

          {/* Right Content (3D Phone) */}
          {/* Keeps existing logic but ensures height doesn't break layout */}
          <Reveal delayClass="stagger-2" className="relative hidden lg:block h-[800px] w-full lg:order-2 order-2">
             <div ref={contentRef} className="w-full h-full">
                <div ref={tiltRef} className="relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-out will-change-transform">
                   {/* Phone visuals preserved from previous context... */}
                   {/* Main Phone Device */}
                   <div className={`relative w-[340px] h-[680px] rounded-[3.5rem] p-3 animate-float border-[6px] shadow-[0_20px_60px_-10px_rgba(20,184,166,0.2)] ring-1 ${theme === 'dark' ? 'bg-black border-[#0A0A0A] ring-zinc-800' : 'bg-white border-gray-100 ring-gray-200'}`}>
                      <div className={`w-full h-full rounded-[3rem] overflow-hidden relative ${theme === 'dark' ? 'bg-[#0F0F11]' : 'bg-gray-50'}`}>
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-xl z-20"></div>
                        <div className="h-full w-full overflow-y-auto pt-14 px-5 pb-8 no-scrollbar">
                          <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 rounded-full border-[3px] border-teal-500 p-1 mb-4 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                              <img src="https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?fit=crop&w=300&h=300" alt="Profile" className="w-full h-full rounded-full object-cover" />
                            </div>
                            <h3 className={`font-bold text-2xl mb-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Sarah Jenkins</h3>
                            <p className="text-sm text-gray-400">Digital Artist & UX Designer</p>
                            <div className="flex gap-4 mt-5">
                              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                                <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white hover:text-black' : 'bg-black/5 text-black hover:bg-black hover:text-white'}`}>
                                  <Icon size={18} />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <PhoneLinkItem theme={theme} icon={Youtube} color="text-red-400" bg="bg-red-500/20" title="Latest Video" sub="Design Trends 2025" />
                            <PhoneLinkItem theme={theme} icon={Briefcase} color="text-blue-400" bg="bg-blue-500/20" title="My Portfolio" sub="Check out my recent work" />
                            <PhoneLinkItem theme={theme} icon={Zap} color="text-green-400" bg="bg-green-500/20" title="Digital Shop" sub="Buy my icon packs" />
                          </div>
                        </div>
                      </div>
                   </div>
                   {/* Floating Widgets */}
                   <div className={`absolute top-[22%] right-[10%] rounded-2xl p-4 w-48 animate-float-delayed backdrop-blur-xl border shadow-2xl z-20 ${theme === 'dark' ? 'bg-[#111]/90 border-white/10' : 'bg-white/90 border-gray-100'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-secondary">Live Visitors</span>
                      </div>
                      <div className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1,204</div>
                      <div className="h-8 w-full flex items-end gap-1">
                        {[40, 70, 50, 90, 75].map((h, i) => (
                          <div key={i} className="w-1/5 bg-green-500/20 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: `rgba(34, 197, 94, ${0.3 + (i * 0.1)})` }}></div>
                        ))}
                      </div>
                   </div>
                   <div className={`absolute bottom-[28%] left-[5%] rounded-2xl p-4 w-44 animate-float backdrop-blur-xl border shadow-2xl z-20 ${theme === 'dark' ? 'bg-[#111]/90 border-white/10' : 'bg-white/90 border-gray-100'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                          <DollarSign size={16} />
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${theme === 'dark' ? 'bg-white/10 text-gray-300' : 'bg-black/5 text-gray-600'}`}>Today</span>
                      </div>
                      <div className="text-sm text-secondary mt-2">Earnings</div>
                      <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>$124.50</div>
                   </div>
                </div>
             </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}