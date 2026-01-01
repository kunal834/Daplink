// components/FeaturePageComplete.jsx
"use client";

import React from 'react';
import Image from 'next/image';
import { FiUsers, FiRepeat, FiBriefcase, FiMessageCircle, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { PiLinkSimpleHorizontalLight } from "react-icons/pi";
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { useTheme } from '@/context/ThemeContext'; // Import the theme hook

// --- Reusable Feature Block Component (Now accepts isDarkMode) ---
const FeatureBlock = ({ title, icon: Icon, badge, description, features, imageSrc, imageAlt, reverse, isDarkMode }) => {

  const contentOrder = reverse ? 'lg:order-2' : 'lg:order-1';
  const imageOrder = reverse ? 'lg:order-1' : 'lg:order-2';

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Text Content */}
        <div className={`${contentOrder} relative z-10`}>
          
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold mb-6 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-blue-900/30 border-blue-800 text-blue-300' 
              : 'bg-blue-50 border-blue-100 text-blue-600'
          }`}>
            <Icon className="w-4 h-4" />
            {badge}
          </div>

          <h2 className={`text-3xl md:text-4xl font-extrabold mb-6 leading-tight transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h2>

          <p className={`text-lg md:text-xl mb-8 leading-relaxed transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {description}
          </p>

          <ul className="space-y-4 mb-10">
            {features.map((feature, index) => (
              <li key={index} className={`flex items-center font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 transition-colors duration-300 ${
                    isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
                }`}>
                    <FiCheckCircle className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                {feature}
              </li>
            ))}
          </ul>

          <button className={`group flex items-center gap-2 font-bold transition-colors ${
             isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
          }`}>
            Learn more about {badge}
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Image Content */}
        <div className={`${imageOrder} relative`}>
          {/* Decorative Glow - Adjusted for Dark Mode */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-3xl rounded-full -z-10 transition-colors duration-300 ${
             isDarkMode 
             ? 'bg-gradient-to-tr from-blue-900/20 to-purple-900/20' 
             : 'bg-gradient-to-tr from-blue-200/40 to-purple-200/40'
          }`} />
          
          <div className={`relative rounded-2xl overflow-hidden shadow-2xl border transform transition duration-500 hover:scale-[1.01] ${
             isDarkMode 
             ? 'bg-gray-800 border-gray-700' 
             : 'bg-white border-gray-100'
          }`}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={800}
              height={600}
              className="object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Main Page Component ---
const FeaturePage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <>
      <Navbar />
      
      {/* Main Container with Theme Transition */}
      <div className={`relative min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-950' : 'bg-white'
      }`}>
        
        {/* Modern Tech Background (Dot Grid) - Dynamic Color */}
        <div 
          className="absolute inset-0 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none transition-colors duration-300" 
          style={{
            backgroundImage: `radial-gradient(${isDarkMode ? '#374151' : '#e5e7eb'} 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        <div className="relative z-10">

          {/* 1. Header Section */}
          <header className="pt-28 pb-16 px-4 text-center max-w-5xl mx-auto">
            <span className="text-indigo-500 font-semibold tracking-wider uppercase text-sm mb-4 block">
              Daplink Ecosystem
            </span>
            <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight mb-6 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              One Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-fuchsia-500">{`Endless Possibilities.`}</span>
            </h1>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
            {`  From building your brand to managing your links, Daplink provides the infrastructure you need to grow your digital presence.`}
            </p>
          </header>

          {/* 2. Main Content Wrapper */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

            {/* Block 1: Connect */}
            <FeatureBlock
              isDarkMode={isDarkMode}
              title="Expand Your Network"
              badge="Networking"
              icon={FiUsers}
              description="Stop collecting contacts and start building relationships. Discover students, professionals, and mentors who align with your goals."
              features={[
                'Smart Profile Discovery',
                'Direct Messaging System',
                'Interest-Based Matching',
                'Campus Event Integration',
              ]}
              imageSrc="/connect.png"
              imageAlt="Networking interface mockup"
              reverse={false}
            />

            {/* Block 2: Skill Exchange */}
            <FeatureBlock
              isDarkMode={isDarkMode}
              title="Trade Skills, Not Money"
              badge="Skill Swap"
              icon={FiRepeat}
              description="A unique marketplace where knowledge is the currency. Teach what you excel at and learn what you need from peers."
              features={[
                'Peer-to-Peer Marketplace',
                'Automated Session Scheduling',
                'Trust & Rating System',
                'Skill Progression Tracking',
              ]}
              imageSrc="/skill.png"
              imageAlt="Skill exchange dashboard"
              reverse={true}
            />

            {/* Block 3: Job Explorer */}
            <FeatureBlock
              isDarkMode={isDarkMode}
              title="Career Opportunities"
              badge="Jobs & Internships"
              icon={FiBriefcase}
              description="Don't just apply—stand out. Find opportunities curated for your skill set and apply directly with your Daplink profile."
              features={[
                'AI-Powered Job Matching',
                'Real-time Application Status',
                'Salary & Stipend Insights',
                'One-Click Apply',
              ]}
              imageSrc="/desk.png"
              imageAlt="Job search platform"
              reverse={false}
            />

            {/* Block 4: Mindset Wall */}
            <FeatureBlock
              isDarkMode={isDarkMode}
              title="Showcase Your Vision"
              badge="Personal Brand"
              icon={FiMessageCircle}
              description="Your resume tells them what you did. Your Mindset Wall tells them who you are. Share your values, quotes, and daily highlights."
              features={[
                'Visual Vision Boards',
                'Daily Affirmations',
                'Featured Quotes',
                'Personality Insights',
              ]}
              imageSrc="/mind.png"
              imageAlt="Mindset wall interface"
              reverse={true}
            />

            {/* Block 5: URL Shortener */}
            <FeatureBlock
              isDarkMode={isDarkMode}
              title="Smart Link Management"
              badge="Daplink URL"
              icon={PiLinkSimpleHorizontalLight}
              description="Take control of your links. Create short, branded URLs that look professional and track analytics to understand your audience."
              features={[
                'Custom Branded Aliases',
                'QR Code Generation',
                'Detailed Click Analytics',
                'Link Organization Groups',
              ]}
              imageSrc="/url.png" 
              imageAlt="URL shortening analytics dashboard"
              reverse={false}
            />

          </main>

          {/* 3. CTA Section */}
          <section className={`py-20 px-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-black/50 border-t border-gray-800' : 'bg-gray-900'
          }`}>
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {`Ready to launch your digital identity?`}
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                {`Join thousands of students and professionals using Daplink to connect, learn, and grow.`}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Start Free Trial
                </button>
                <button className="px-8 py-4 bg-transparent border border-gray-600 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition">
                  View Pricing
                </button>
              </div>
            </div>
          </section>

          {/* 4. Footer */}
          <Footer />

        </div>
      </div>
    </>
  );
};

export default FeaturePage;