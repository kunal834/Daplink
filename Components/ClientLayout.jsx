// Components/ClientLayout.jsx
'use client'; // 👈 This marks it as a Client Component
import React from 'react';
import { useTheme } from '@/context/ThemeContext'; 
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientLayout({ children }) {
  const { theme } = useTheme();

  return (
    <>
      {/* Global Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute w-[500px] h-[500px] rounded-full blur-[80px] animate-aurora top-[-10%] left-[-10%] 
          ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-blue-300/40'}`}>
        </div>
        <div className={`absolute w-[600px] h-[600px] rounded-full blur-[80px] animate-aurora bottom-[-10%] right-[-10%] 
          ${theme === 'dark' ? 'bg-teal-900/20' : 'bg-pink-300/30'}`} style={{ animationDelay: '-5s' }}>
        </div>
      </div>

      <Navbar />

      <main className="min-h-screen relative z-10">
        {children}
      </main>

      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme={theme === 'dark' ? 'dark' : 'light'} 
      />
    </>
  );
}