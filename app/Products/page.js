// components/FeaturePageComplete.jsx

import React from 'react';
import Image from 'next/image';
import { FiUsers, FiRepeat, FiBriefcase, FiMessageCircle, FiCheckCircle } from 'react-icons/fi';
import { PiLinkSimpleHorizontalLight } from "react-icons/pi";
import Navbar from '@/Components/Navbar';
import CallToActionSection from '@/Components/CalltoAction';
import Footer from '@/Components/Footer';

// --- Reusable Feature Block Component ---
const FeatureBlock = ({ title, icon: Icon, description, features, imageSrc, imageAlt, reverse }) => {
  
  // Determine column order based on the 'reverse' prop
  const contentOrder = reverse ? 'md:order-2' : 'md:order-1';
  const imageOrder = reverse ? 'md:order-1' : 'md:order-2';
  
  return (
    <section className="
      grid 
      grid-cols-1 
      md:grid-cols-2 
      gap-12 
      items-center 
      py-16 
      border-b border-gray-100 last:border-b-0
    ">
      
      {/* Left Column (Content) - Order changes based on reverse prop */}
      <div className={contentOrder}>
        <Icon className="text-indigo-600 w-10 h-10 mb-4" />
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h2>
        
        <p className="text-gray-600 text-lg mb-6">
          {description}
        </p>
        
        {/* Feature List (Checkmarks) */}
        <ul className="space-y-2 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-gray-700 font-medium text-sm">
              <FiCheckCircle className="text-fuchsia-600 w-4 h-4 mr-3 mt-1 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        
        {/* Learn More Button */}
        <button className="
          bg-indigo-600 
          hover:bg-indigo-700 
          text-white 
          font-semibold 
          py-2 
          px-6 
          rounded-lg 
          shadow-lg 
          transition 
          duration-300 
          ease-in-out
          bg-gradient-to-r from-blue-600 to-fuchsia-600
        ">
          Learn More
        </button>
      </div>

      {/* Right Column (Image) - Order changes based on reverse prop */}
      <div className={imageOrder}>
        {/* Using Next.js Image component for optimization */}
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={600}
          height={400}
          className="rounded-xl shadow-2xl object-cover h-[350px] w-full"
        />
      </div>
    </section>
  );
};


// --- Main Page Component ---
const FeaturePage = () => {
  return (
<>
<div className="relative min-h-screen bg-gray-50 flex items-center justify-center">

      {/* This is your background element. 
        'absolute' and 'inset-0' make it fill the parent container's bounds (which is now min-h-screen).
      */}
      <div className="
          absolute 
          inset-0 
          opacity-10 
          bg-[length:60px_60px] 
          bg-[position:96.8281%_96.8281%] 
          bg-[image:linear-gradient(45deg,rgb(59,130,246)_25%,transparent_25%,transparent_75%,rgb(59,130,246)_75%,rgb(59,130,246)),linear-gradient(45deg,rgb(59,130,246)_25%,transparent_25%,transparent_75%,rgb(59,130,246)_75%,rgb(59,130,246))]
      ">
      </div>

     

    <div className="min-h-screen bg-white">
  
      {/* 1. Full-Width Header Section (Hero/Banner) - From previous request */}
      <header className="
        w-full  
        bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 
        text-white 
        py-20 
        px-4 
        text-center
        shadow-lg
      ">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Powerful Tools for Your Digital Presence
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Daplink offers a comprehensive suite of tools to help you build your personal brand, 
            connect with others, and unlock new opportunities.
          </p>
        </div>
      </header>

      {/* 2. Main Content Wrapper for Feature Blocks */}
      <main className="max-w-7xl mx-auto py-16 px-4 md:px-8">
        
        {/* --- Block 1: Connect (Image Left) --- */}
        <FeatureBlock
          title="Connect"
          icon={FiUsers}
          description="Network with students and professionals in your field. Build meaningful connections that advance your career and expand your network."
          features={[
            'Profile Discovery',
            'Direct messaging',
            'Mutual matching',
            'Event integration',
          ]}
          imageSrc="/connect.png" // Placeholder image path
          imageAlt="Close up of bike pedals"
          reverse={false} // Text on Left, Image on Right
        />

        {/* --- Block 2: Skill Exchange (Image Right) --- */}
        <FeatureBlock
          title="Skill Exchange"
          icon={FiRepeat}
          description="Teach what you know and learn what you need. Connect with others for mutual skill development and knowledge sharing."
          features={[
            'Skill marketplace',
            'Session scheduling',
            'Rating system',
            'Progress tracking',
          ]}
          imageSrc="/skill.png" // Placeholder image path
          imageAlt="Students in a classroom"
          reverse={true} // Image on Left, Text on Right
        />

        {/* --- Block 3: Job Explorer (Image Left) --- */}
        <FeatureBlock
          title="Job Explorer"
          icon={FiBriefcase}
          description="Find job and internship opportunities that match your skills and experience. Streamline the application process for faster hiring."
          features={[
            'Smart job matching',
            'Application tracking',
            'Salary insights',
            'Interview guides',
          ]}
          imageSrc="/desk.png" // Placeholder image path
          imageAlt="Digital desk setup with monitors"
          reverse={false} // Text on Left, Image on Right
        />

        {/* --- Block 4: Mindset Wall (Image Right) --- */}
        <FeatureBlock
          title="Mindset Wall"
          icon={FiMessageCircle}
          description="Express your core values and vision. Share what drives you and connect with like-minded individuals."
          features={[
            'Custom quotes',
            'Vision boards',
            'Affirmation space',
            'Daily highlights',
          ]}
          imageSrc="/mind.png" // Placeholder image path
          imageAlt="Notebook and pens on a wooden table"
          reverse={true} // Image on Left, Text on Right
        />
        <FeatureBlock
          title="URL shorten"
          icon={PiLinkSimpleHorizontalLight}
          description="Express your core values and vision. Share what drives you and connect with like-minded individuals."
          features={[
            'Custom quotes',
            'Vision boards',
            'Affirmation space',
            'Daily highlights',
          ]}
          imageSrc="/url.png" // Placeholder image path
          imageAlt="Notebook and pens on a wooden table"
          reverse={false} // Image on Left, Text on Right
        />

      </main>
      
      {/* 3. Footer Placeholder (Based on the small bar visible at the bottom) */}
      <footer className="w-[99vw]  bg-gray-900 h-full flex items-center justify-center text-sm flex-col text-white">
         
           <h1 className='text-3xl mt-4 font-extrabold'>Ready to get started?</h1>
           <p className='text-xl mt-2'>Create your DapLink profile today and unlock access to all these powerful tools.</p>
           <button className='mt-2 bg-white rounded-2xl text-black p-4 font-stretch-50%'>Start free trial</button>

         
      </footer>

      

    </div>

    </div>

    <Footer/>
</>
      



  );
};

export default FeaturePage;