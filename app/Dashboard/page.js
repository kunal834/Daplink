'use client';

import React, { useState } from 'react';


import {
  LinksTab,
  BioPageTab,
  AnalyticsTab,
  CommunityTab,
  SkillSwapTab,
  JobFinderTab,
  MindsetTab,
  QrCodeTab,
  SettingsTab
} from '@/Components/DashboardComponents/DashboardTabs';
import TopBar from '@/Components/DashboardComponents/DashboardTopbar';
import Sidebar from '@/Components/DashboardComponents/DashboardSidebar';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('links');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // -- Global State --
  const [profile, setProfile] = useState({
    username: 'alex_creator',
    title: 'Alex Ross',
    bio: 'Digital Creator & Minimalist. Building the future.',
    theme: 'modern',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop'
  });

  const [links, setLinks] = useState([
    { id: 1, title: 'My Portfolio', url: 'https://alex.design', active: true, clicks: 1240 },
    { id: 2, title: 'Twitter / X', url: 'https://twitter.com/alex', active: true, clicks: 850 },
    { id: 3, title: 'Newsletter', url: 'https://alex.substack.com', active: true, clicks: 200 },
  ]);

  // -- Handlers --
  const updateProfile = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const copyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`daplink.app/${profile.username}`);
    }
  };

  const handleLogout = () => {
    alert("Logout logic here");
  };

  return (
    <div className={`min-h-screen flex flex-col h-screen overflow-hidden font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-[#F8F9FA] text-zinc-900'}`}>

      {/* 1. Top Navigation Bar */}
      <TopBar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        notificationsOpen={notificationsOpen}
        setNotificationsOpen={setNotificationsOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        profile={profile}
        copyLink={copyLink}
        handleLogout={handleLogout}
      />

      {/* 2. Main Workspace Area */}
      <main className="flex-1 flex overflow-hidden">

        {/* Left Sidebar - Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDarkMode={isDarkMode}
        />

        {/* Center Content - Scrollable */}
        <div className={`flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth ${isDarkMode ? 'bg-zinc-950' : 'bg-[#F8F9FA]'}`}>
          <div className="max-w-3xl mx-auto pb-12">
            {activeTab === 'links' && (
              <LinksTab isDarkMode={isDarkMode} links={links} setLinks={setLinks} />
            )}

            {activeTab === 'appearance' && (
              <BioPageTab isDarkMode={isDarkMode} profile={profile} updateProfile={updateProfile} />
            )}

            {activeTab === 'analytics' && <AnalyticsTab isDarkMode={isDarkMode} />}
            {activeTab === 'community' && <CommunityTab isDarkMode={isDarkMode} />}
            {activeTab === 'skillswap' && <SkillSwapTab isDarkMode={isDarkMode} />}
            {activeTab === 'jobs' && <JobFinderTab isDarkMode={isDarkMode} />}
            {activeTab === 'mindset' && <MindsetTab isDarkMode={isDarkMode} />}

            {activeTab === 'qrcode' && (
              <QrCodeTab isDarkMode={isDarkMode} profile={profile} />
            )}

            {activeTab === 'settings' && (
              <SettingsTab isDarkMode={isDarkMode} profile={profile} />
            )}
          </div>
        </div>

      </main>
    </div>
  );
}