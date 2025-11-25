'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import HeroSection from '@/Components/HeroSection';
import FeaturesSection from '@/Components/FeatureShowcase';
import TestimonialsSection from '@/Components/Testimonial';
import Footer from '@/Components/Footer';

export default function DapLinkApp() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme to body for global css variable access
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Blob */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-purple-900/30 top-[-10%] left-[-10%] rounded-full blur-[80px] animate-aurora"></div>
        <div className="absolute w-[600px] h-[600px] bg-teal-900/20 bottom-[-10%] right-[-10%] rounded-full blur-[80px] animate-aurora" style={{ animationDelay: '-5s' }}></div>
      </div>

      <Navbar scrolled={scrolled} theme={theme} toggleTheme={toggleTheme} />
      
      <main>
        <HeroSection theme={theme} />
        <FeaturesSection theme={theme} />
        <TestimonialsSection theme={theme} />
      </main>

      <Footer theme={theme} />
    </div>
  );
}
