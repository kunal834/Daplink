// FeatureShowcase.jsx
import React from 'react';
// Replaced Heroicons with custom classes for the unique colors/icons in the original image
// Using placeholders now, you would replace them with your actual SVG/Image components
import { LinkIcon, UsersIcon, SparklesIcon, BriefcaseIcon, CubeIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image'; // Assuming Next.js, as used in original

const features = [
  {
    name: 'Link Hub',
    description: 'Create and manage all your important links in one beautiful place.',
    icon: LinkIcon, // Placeholder for Link Hub icon
    glowClass: 'icon-glow-link', // Blue/Purple
  },
  {
    name: 'Connect',
    description: 'Network with students and professionals in your field effortlessly.',
    icon: UsersIcon, // Placeholder for Connect icon
    glowClass: 'icon-glow-connect', // Pink/Purple
  },
  {
    name: 'Skill Exchange',
    description: 'Teach what you know and learn what you need from the community.',
    icon: SparklesIcon, // Placeholder for Skill Exchange icon
    glowClass: 'icon-glow-exchange', // Red/Pink
  },
  {
    name: 'Job Explorer',
    description: 'Discover job opportunities and internships matched to your profile.',
    icon: BriefcaseIcon, // Placeholder for Job Explorer icon
    glowClass: 'icon-glow-jobs', // Green
  },
  {
    name: 'Mindset Wall',
    description: 'Express your personality, values, and vision with the world.',
    icon: CubeIcon, // Placeholder for Mindset Wall icon
    glowClass: 'icon-glow-mindset', // Orange
  },
  {
    name: 'Analytics',
    description: 'Track your link performance and visitor engagement insights.',
    icon: ChartBarIcon, // Placeholder for Analytics icon
    glowClass: 'icon-glow-analytics', // Blue/Gray
  },
];

const FeatureShowcase = () => {
  return (
    // Simple white background section
    <div className="bg-white py-20 md:w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Section Header (Simplified) --- */}
        <div className="lg:text-center mb-16">
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need in one place
          </p>
          <p className="mt-4 max-w-3xl text-xl text-gray-600 lg:mx-auto">
            DapLink combines powerful features to help you build your personal brand, connect with others, and unlock new opportunities.
          </p>
        </div>

        {/* --- Key Features Grid (Matching the 3x2 layout) --- */}
        <div className="mt-10">
          <dl className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-12 md:gap-y-12">
            
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col text-left">
                <dt>
                  {/* Icon Container with Custom Glow Class */}
                  <div className={`flex items-center justify-center h-16 w-16 rounded-xl ${feature.glowClass} mb-4 transition-transform duration-500 hover:rotate-360`}>
                    {/* The icon itself should be white or a light color */}
                    <feature.icon className="h-8 w-8 text-white" aria-hidden="true" />
                  </div>
                  <p className="text-xl leading-6 font-semibold text-gray-900">
                    {feature.name}
                  </p>
                </dt> 
                <dd className="mt-2 text-base text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
            
          </dl>
        </div>
     

      </div>
    </div>
  );
};

export default FeatureShowcase;