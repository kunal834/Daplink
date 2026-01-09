'use client';
import React from 'react';
import { 
  Layers, 
  PieChart, 
  Users, 
  Quote, 
  Youtube, 
  Twitter, 
  Pin, 
  Rocket,      // For Product Marketing
  DollarSign,  // For Monetization
  Megaphone,
  TrendingUp,
  Wallet
} from 'lucide-react';
import Reveal from './ui/Reveal';
import FeatureCard from './ui/FeatureCard';

// You can create a simple animated item for the Ad Network card
const TransactionItem = ({ theme, amount, source, delay }) => (
  <div className={`flex items-center justify-between p-2 rounded-lg border mb-2 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-forwards ${delay} ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-green-50 border-green-100'}`}>
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px] font-bold">$</div>
      <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{source}</span>
    </div>
    <span className="text-xs font-bold text-green-500">+{amount}</span>
  </div>
);

export default function FeaturesSection({ theme }) {
  return (
    <section id="features" className={`py-32 relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#020202]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <Reveal>
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Everything you need. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-800">Nothing you don't.</span>
            </h2>
          </Reveal>
          <Reveal delayClass="stagger-1">
            <p className={`max-w-2xl mx-auto text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              A powerful suite of tools designed to help you monetize your audience and build your digital empire.
            </p>
          </Reveal>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 1. Central Hub */}
          <Reveal delayClass="stagger-1">
            <FeatureCard 
              theme={theme}
              icon={Layers} iconColor="text-teal-400" iconBg="bg-teal-500/10" 
              title="Central Hub"
              desc="Manage your videos, music, store, and socials from one unified command center."
            >
              <div className={`mt-auto relative h-28 overflow-hidden rounded-xl border p-4 transition-colors ${theme === 'dark' ? 'border-white/5 bg-white/5 group-hover:bg-white/10' : 'border-gray-100 bg-gray-50 group-hover:bg-gray-100'}`}>
                <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400"><Youtube size={16} /></div>
                  <div className={`h-2 w-24 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                </div>
                <div className="flex items-center gap-3 mt-3 opacity-40 group-hover:opacity-100 transition-opacity delay-75">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><Twitter size={16} /></div>
                  <div className={`h-2 w-16 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                </div>
              </div>
            </FeatureCard>
          </Reveal>

          {/* 2. Analytics */}
          <Reveal delayClass="stagger-2">
            <FeatureCard 
              theme={theme}
              icon={PieChart} iconColor="text-emerald-400" iconBg="bg-emerald-500/10"
              title="Analytics"
              desc="Real-time insights on clicks, views, and audience demographics."
              badge="+24%" badgeColor="text-emerald-400 bg-emerald-900/30 border-emerald-500/20"
            >
              <div className="h-32 flex items-end gap-2 mt-6 px-2">
                  {[40, 70, 50, 85, 60].map((h, i) => (
                    <div key={i} className={`w-full bg-emerald-500/20 rounded-t-sm group-hover:bg-emerald-500/40 transition-all duration-500`} style={{ height: `${h}%` }}></div>
                  ))}
              </div>
            </FeatureCard>
          </Reveal>

          {/* 3. Product Marketing (Replaced Skill Swap) */}
          <Reveal delayClass="stagger-3">
            <FeatureCard 
              theme={theme}
              icon={Rocket} iconColor="text-purple-400" iconBg="bg-purple-500/10"
              title="Product Marketing"
              desc="Auto-generate launch posts, track leads, and scale your product directly from your bio."
            >
               <div className="mt-6 flex flex-col items-center justify-center py-4">
                  {/* Mock Rocket Launch UI */}
                  <div className={`w-full p-3 rounded-lg border flex items-center gap-3 relative overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="w-8 h-8 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <Megaphone size={16} />
                    </div>
                    <div className="flex-1">
                      <div className={`h-2 w-20 rounded mb-1.5 ${theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'}`}></div>
                      <div className={`h-1.5 w-12 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                    </div>
                    <div className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded">Launched</div>
                  </div>
                  
                  {/* Growth Graph Line */}
                  <div className="w-full mt-3 px-2 flex items-end justify-between gap-1 h-8">
                     <div className="w-1/5 h-2 bg-purple-500/20 rounded-t"></div>
                     <div className="w-1/5 h-4 bg-purple-500/40 rounded-t"></div>
                     <div className="w-1/5 h-6 bg-purple-500/60 rounded-t"></div>
                     <div className="w-1/5 h-8 bg-purple-500 rounded-t shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                  </div>
              </div>
            </FeatureCard>
          </Reveal>

          {/* 4. Community */}
          <Reveal delayClass="stagger-1">
            <FeatureCard 
              theme={theme}
              icon={Users} iconColor="text-blue-400" iconBg="bg-blue-500/10"
              title="Community"
              desc="Find your tribe instantly. Join groups based on your interests and niche."
            >
              <div className="mt-6 space-y-2">
                <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>1,204 Creators Online</span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-xl border opacity-60 hover:opacity-100 transition-opacity cursor-pointer ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>New Group: Web3 Design</span>
                </div>
              </div>
            </FeatureCard>
          </Reveal>

          {/* 5. Monetization / Ad Network (Replaced Job Finder) */}
          <Reveal delayClass="stagger-2">
            <FeatureCard 
              theme={theme}
              icon={DollarSign} iconColor="text-green-400" iconBg="bg-green-500/10"
              title="Ad Network"
              desc="Turn your profile into an income stream. Rent digital real estate to sponsored brands."
            >
              <div className="mt-6">
                 {/* Balance Header */}
                 <div className="flex justify-between items-end mb-3 px-1">
                    <span className={`text-[10px] uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Total Earnings</span>
                    <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>$124.50</span>
                 </div>
                 {/* Transactions */}
                 <div className="relative overflow-hidden h-24 mask-linear-fade">
                    <TransactionItem theme={theme} amount="0.10" source="Click from US" delay="delay-[0ms]" />
                    <TransactionItem theme={theme} amount="0.08" source="Click from IN" delay="delay-[1000ms]" />
                    <TransactionItem theme={theme} amount="0.12" source="Click from UK" delay="delay-[2000ms]" />
                 </div>
              </div>
            </FeatureCard>
          </Reveal>

          {/* 6. Mindset Wall */}
          <Reveal delayClass="stagger-3">
            <FeatureCard 
              theme={theme}
              icon={Quote} iconColor="text-pink-400" iconBg="bg-pink-500/10"
              title="Mindset Wall"
              desc="Share your daily vision and values. A sticky-note wall for your digital soul."
            >
              <div className="relative mt-4 mx-2">
                  <div className={`relative w-full h-28 border rounded-xl p-4 transform rotate-2 group-hover:rotate-0 transition-transform duration-300 flex flex-col justify-center shadow-2xl ${theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`text-sm font-medium italic ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>"Build in silence, let success make the noise."</p>
                  <div className="mt-3 flex items-center gap-2">
                      <div className="w-5 h-5 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full"></div>
                      <span className="text-[10px] text-gray-500 font-bold">@alex_creator</span>
                  </div>
                  <div className={`absolute -top-3 right-4 rounded-full p-1 border ${theme === 'dark' ? 'bg-[#151515] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                      <Pin className="text-red-500 w-4 h-4 transform rotate-45" />
                  </div>
                  </div>
              </div>
            </FeatureCard>
          </Reveal>

        </div>
      </div>
    </section>
  );
}