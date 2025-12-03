// app/(protected)/dashboard/page.jsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BarChart, MapPin, Briefcase, TrendingUp, Users, ArrowRight,
  CheckCircle, Share2, DollarSign, Menu, X,Sun, Moon , Wrench,  Link as LinkIcon
} from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';

// --- Recharts components (Client-side rendering is required) ---
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

/* -------------------------------------------------------------------------- */
/* DUMMY DATA & STYLING LOGIC (Copied from your ProfilePage)                  */
/* -------------------------------------------------------------------------- */
const mockUser = {
  name: "Analytics User",
  email: "analytics@daplink.in",
  avatar: "https://placehold.co/100x100/10B981/fff?text=DU",
  plan: "Ultimate Tier"
};

const mockAnalyticsData = [
  { name: 'Wk1', views: 820, clicks: 40 },
  { name: 'Wk2', views: 900, clicks: 55 },
  { name: 'Wk3', views: 1250, clicks: 70 },
  { name: 'Wk4', views: 1100, clicks: 65 },
  { name: 'Wk5', views: 1500, clicks: 90 },
  { name: 'Wk6', views: 1800, clicks: 120 },
];

// Reusing your color logic
const getColors = (theme) => ({
  bg: theme === 'dark' ? 'bg-[#050505]' : 'bg-[#F3F4F6]',
  text: theme === 'dark' ? 'text-white' : 'text-gray-900',
  subtext: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
  card: theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200',
  linkHover: theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50',
  badge: theme === 'dark' ? 'bg-[#1A1A1A] text-gray-300 border-[#333]' : 'bg-gray-100 text-gray-700 border-gray-200',
  accentGradient: 'bg-gradient-to-br from-teal-500 to-emerald-600',
  accent: 'text-teal-500',
  secondaryAccent: 'text-purple-500',
});

/* -------------------------------------------------------------------------- */
/* 1. Profile Sidebar Component (Reusing styles from your code)               */
/* -------------------------------------------------------------------------- */

const DashboardSidebar = ({ colors, user, toggleSidebar }) => (
  <aside className={`
    p-6 flex flex-col items-center h-full border-r ${colors.card} shadow-xl
    md:border-none mt-40
  `}>
    
    {/* Close Button for Mobile */}
    <button onClick={toggleSidebar} className={`md:hidden absolute top-4 right-4 p-2 rounded-full ${colors.card}`}>
      <X size={20} className={colors.text} />
    </button>
    
    <h2 className={`text-xl font-bold tracking-tight mb-8 ${colors.text}`}>DapLink Dashboard</h2>

    {/* Profile Header */}
    <img 
      className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-teal-500/50" 
      src={user.avatar} 
      alt={user.name} 
    />
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.name}</h3>
    <p className={`text-sm mb-4 ${colors.subtext}`}>{user.email}</p>
    
    <span className={`px-3 py-1 text-xs font-semibold rounded-full mb-6 ${colors.badge}`}>
      {user.plan}
    </span>
    
    <hr className={`w-full border-t ${colors.subtext} opacity-20 mb-6`} />

    {/* Primary Navigation / Function Buttons */}
    <div className="w-full space-y-3">
      <Link href="/links/create" className={`w-full flex items-center p-3 font-semibold ${colors.accentGradient} text-white rounded-xl shadow-lg hover:opacity-90 transition duration-150`}>
        <LinkIcon size={20} className="mr-3" />
        Create New Link
      </Link>
      
      <Link href="/analytics" className={`w-full flex items-center p-3 rounded-xl border ${colors.card} ${colors.text} ${colors.linkHover}`}>
        <BarChart size={20} className={`mr-3 ${colors.accent}`} />
        My Analytics
      </Link>
      
      <Link href="/settings" className={`w-full flex items-center p-3 rounded-xl border ${colors.card} ${colors.text} ${colors.linkHover}`}>
        <Wrench size={20} className={`mr-3 ${colors.secondaryAccent}`} />
        Account Settings
      </Link>

    </div>
  </aside>
);

/* -------------------------------------------------------------------------- */
/* 2. Analytics Panel Component                                               */
/* -------------------------------------------------------------------------- */

const AnalyticsPanel = ({ colors, data }) => (
  <div className="space-y-6">
    
    {/* Key Metrics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard 
        colors={colors}
        title="Total Views" 
        value="15,489" 
        icon={<TrendingUp size={24} className="text-teal-500" />}
      />
      <MetricCard 
        colors={colors}
        title="Active Users" 
        value="4.5K" 
        icon={<Users size={24} className="text-purple-500" />}
      />
      <MetricCard 
        colors={colors}
        title="Conversion Rate" 
        value="7.2%" 
        icon={<DollarSign size={24} className="text-orange-500" />}
      />
    </div>

    {/* Connections Graph */}
    <div className={`p-6 rounded-2xl shadow-xl ${colors.card}`}>
      <h3 className={`text-xl font-bold mb-6 ${colors.text}`}>Link Performance (Last 6 Weeks)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.subtext} opacity={0.3} />
            <XAxis dataKey="name" stroke={colors.subtext} tickLine={false} />
            <YAxis stroke={colors.subtext} tickLine={false} />
            <Tooltip 
              contentStyle={{ background: colors.card, border: `1px solid ${colors.subtext}`, borderRadius: '8px' }}
              labelStyle={{ color: colors.text }}
            />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="#047857" // Emerald 700
              strokeWidth={3}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="#9333ea" // Violet 600
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    
  </div>
);

/* -------------------------------------------------------------------------- */
/* Metric Card Helper (Reused in Analytics Panel)                             */
/* -------------------------------------------------------------------------- */

const MetricCard = ({ colors, title, value, icon }) => (
  <div className={`p-5 rounded-xl border ${colors.card} flex items-center justify-between shadow-md`}>
    <div>
      <p className={`text-sm font-medium ${colors.subtext}`}>{title}</p>
      <p className={`text-3xl font-bold ${colors.text} mt-1`}>{value}</p>
    </div>
    <div className={`p-3 rounded-full ${colors.bg} border ${colors.subtext} opacity-20`}>
      {icon}
    </div>
  </div>
);


/* -------------------------------------------------------------------------- */
/* 3. Main Dashboard Component                                                */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const colors = getColors(theme); // Use your color logic

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${colors.bg} font-sans pb-10`}>
      
      {/* Aurora Background (Reusing your background styles) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-purple-900/20 top-[-10%] right-[-10%] rounded-full blur-[120px] animate-aurora"></div>
        <div className="absolute w-[500px] h-[500px] bg-teal-900/20 bottom-[-10%] left-[-10%] rounded-full blur-[120px] animate-aurora" style={{ animationDelay: '-5s' }}></div>
        {theme === 'light' && <div className="absolute inset-0 bg-white/60 z-[-1]"></div>}
      </div>

      <div className="relative z-10 flex min-h-screen">
        
        {/* --- 1. Desktop Sidebar --- */}
        <div className={`hidden md:block w-64 flex-shrink-0 border-r ${colors.card}`}>
          <DashboardSidebar colors={colors} user={mockUser} />
        </div>

        {/* --- 2. Mobile Sidebar (Overlay) --- */}
        <div className={`fixed inset-y-0 left-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden transition-transform duration-300 w-64 bg-white dark:bg-[#111] shadow-xl`}>
          <DashboardSidebar colors={colors} user={mockUser} toggleSidebar={() => setIsSidebarOpen(false)} />
        </div>
        {isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-20 bg-black/50 md:hidden"></div>
        )}
        
        {/* --- 3. Main Content --- */}
        <main className="flex-1 p-4 md:p-8">
          
          {/* Header/Toggle Bar */}
          <div className="flex justify-between items-center mb-6 mt-40">
            <h1 className={`text-3xl font-extrabold tracking-tight ${colors.text}`}>Welcome, {mockUser.name.split(' ')[0]}</h1>
            <div className="flex gap-4 items-center">
              
              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme} 
                className={`p-2.5 rounded-full border transition-all ${colors.card} ${colors.text} hover:opacity-80`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className={`md:hidden p-2.5 rounded-full border transition-all ${colors.card} ${colors.text} hover:opacity-80`}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
          
          <AnalyticsPanel colors={colors} data={mockAnalyticsData} />
          
        </main>
      </div>
    </div>
  );
}