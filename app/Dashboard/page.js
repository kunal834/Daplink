'use client';

import React, { useEffect, useState } from 'react';

// Import all tabs from our consolidated tabs file
import {
  BioPageTab,
  AnalyticsTab,
  CommunityTab,
  SkillSwapTab,
  JobFinderTab,
  MindsetTab,
  QrCodeTab,
  SettingsTab,
  ReviewTab,
  UrlShortenerTab
} from '@/Components/DashboardComponents/DashboardTabs';
import TopBar from '@/Components/DashboardComponents/DashboardTopbar';
import Sidebar from '@/Components/DashboardComponents/DashboardSidebar';
import { useAuth } from '@/context/Authenticate';
import DashboardSkeleton from '@/Components/SkeletonScreen/dashboardSkeleton';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('URL Shortener');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();


  const [profile, setProfile] = useState({
    username: user?.handle || 'alexross',
    title: user?.name || 'Alex Ross',
    bio: 'Designer & Developer. I create beautiful web experiences.',
    theme: 'modern',
    avatarUrl: user?.profile || `https://placehold.co/200x200/222/fff?text=${user?.handle?.[0]?.toUpperCase() || 'U'}`,
  });

  const daplinkID = user?.daplinkID;

  useEffect(() => {
    if (!daplinkID) return;

    let active = true;

    const fetchDaplink = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/getDaplink?daplinkID=${daplinkID}`);
        if (!active) return;

        setProfile({
          username: res.data.handle,
          bio: res.data.script,
          avatarUrl: res.data.profile,
        });
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDaplink();

    return () => {
      active = false;
    };
  }, [daplinkID]);


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

  const handleLogout = async () => {
    try {
      const isConfirm = window.confirm("Are you sure you want to logout?");

      if (isConfirm) {
        const result = await axios.get('/api/auth/logout', {
          withCredentials: true,
        });
        if (result.data.success) {
          logout();
          toast.success("Logged out successfully");
          router.replace("/login");
        } else {
          toast.error(result.data.message || "Logout failed");
        }
      }
    } catch (error) {
      toast.error("An error occurred during logout");
      console.error("Logout Error:", error);
    }
  };

  if (authLoading) {
    return <DashboardSkeleton />;
  }

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
            {activeTab === 'URL Shortener' && (
              <UrlShortenerTab isDarkMode={isDarkMode} links={links} setLinks={setLinks} />
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

            {activeTab === 'Review' && (
              <ReviewTab isDarkMode={isDarkMode} />
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