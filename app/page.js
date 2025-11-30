'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import HeroSection from '@/Components/heroSection';
import FeaturesSection from '@/Components/FeatureShowcase';
import TestimonialsSection from '@/Components/Testimonial';
import Footer from '@/Components/Footer';

// 👇 1. Import your custom hook (adjust path if needed)
import { useTheme } from '@/context/ThemeContext'; 

export default function DapLinkApp() {
  const [scrolled, setScrolled] = useState(false);
  
  // 👇 2. Use the hook to get global state
  const { theme, toggleTheme } = useTheme(); 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. REMOVED: The manual useEffect for 'data-theme'. 
  // Your ThemeProvider handles document.documentElement.setAttribute now.

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Blob */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-purple-900/30 top-[-10%] left-[-10%] rounded-full blur-[80px] animate-aurora"></div>
        <div className="absolute w-[600px] h-[600px] bg-teal-900/20 bottom-[-10%] right-[-10%] rounded-full blur-[80px] animate-aurora" style={{ animationDelay: '-5s' }}></div>
      </div>

      {/* <Navbar scrolled={scrolled} theme={theme} toggleTheme={toggleTheme} /> */}
      
      <main>
        <HeroSection theme={theme} />
        <FeaturesSection theme={theme} />
        <TestimonialsSection theme={theme} />
      </main>

      {/* <Footer theme={theme} /> */}
    </div>
  ); 
}