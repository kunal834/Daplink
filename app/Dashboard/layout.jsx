'use client';

import { useState } from 'react';
import TopBar from '@/Components/DashboardComponents/DashboardTopbar';
import Sidebar from '@/Components/DashboardComponents/DashboardSidebar';
import { useTheme } from '@/context/ThemeContext';

export default function DashboardLayout({ children }) {
  const {theme,toggleTheme}= useTheme();
  console.log("Theme in layout:", theme);

  return (
    <div
      className={`min-h-screen h-screen flex flex-col overflow-hidden ${
        theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-[#F8F9FA] text-zinc-900'
      }`}
    >
      <TopBar
        isDarkMode={theme === 'dark'}
        setIsDarkMode={toggleTheme}
      />

      <main className="flex flex-1 overflow-hidden">
        <Sidebar isDarkMode={theme === 'dark'} />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
