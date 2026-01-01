"use client";

import React from 'react';
import HeroSection from './HeroSection';
import StorySection from './StorySection';
import MetricsSection from './MetricSection';
import ValuesSection from './ValueSection';
import TeamSection from './TeamSection';
import CTASection from './CTASection';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { useTheme } from '@/context/ThemeContext';

const AboutUsPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <>
      <Navbar />
      
      {/* FIX: Removed hardcoded 'bg-white'. 
        Now toggles between gray-900 (dark) and white (light).
        Added 'min-h-screen' to ensure full height.
      */}
      <div 
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'
        }`}
      >
        {/* Pass isDarkMode prop to children */}
        <HeroSection isDarkmode={isDarkMode} />
        
        <main>
          <StorySection isDarkMode={isDarkMode} />
          {/* <MetricsSection isDarkMode={isDarkMode} /> */}
          {/* <ValuesSection isDarkMode={isDarkMode} /> */}
          {/* <TeamSection isDarkMode={isDarkMode} /> */}
        </main>
        
        <CTASection isDarkMode={isDarkMode} />
      </div>

      <Footer />
    </>
  );
};

export default AboutUsPage;