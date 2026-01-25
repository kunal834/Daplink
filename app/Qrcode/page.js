'use client'; // 1. Required because we use the useTheme hook

import React from 'react';
import QRGenerator from './Qrcode';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { useTheme } from '@/context/ThemeContext'; // Importing the hook

const Page = () => {
  // 2. Destructure the theme state directly from the hook
  // Check your ThemeContext to see if the value is named 'isDarkMode', 'theme', or 'mode'.
  // I am assuming it is 'isDarkMode' based on your previous code.
  const { isDarkmode } = useTheme();
const themeData = useTheme();
  
  // 2. SAFETY CHECK:
  // Sometimes contexts return { theme: 'dark' } instead of { isDarkMode: true }.
  // This line handles both cases automatically.
  const isDarkMode = themeData.isDarkMode || themeData.theme === 'dark' || themeData.mode === 'dark';
  console.log("Dark Mode State:", isDarkMode);
  return (
    <>
      <Navbar  />

      <main
        className={`min-h-screen py-12 px-4 transition-colors duration-300 ${
          isDarkmode ? 'bg-zinc-950' : 'bg-gray-50'
        }`}
      >
        <div className={`max-w-6xl mx-auto mb-8 text-center mt-20 ${
          isDarkmode ? 'bg-zinc-950' : 'bg-gray-50'
        }`}>
          {/* 3. Updated Text Colors for Dark Mode */}
          <h1
            className={`text-4xl font-extrabold mb-2 tracking-tight ${
              isDarkmode ? 'text-white' : 'text-gray-900'
            }`}
          >
           {` DapLink QR Creator`}
          </h1>
          
          <p
            className={`text-lg ${
              isDarkmode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
           {` Generate custom, brandable QR codes instantly.`}
          </p>
        </div>

        {/* Passing the theme prop to the generator if it needs internal styling changes */}
        <QRGenerator isDarkMode={isDarkMode} />
      </main>

      <Footer />
    </>
  );
};

export default Page;