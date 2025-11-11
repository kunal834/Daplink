// CallToActionSection.jsx
import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline'; // For the arrow icon

const CallToActionSection = () => {
  return (
    // Background: Gradient matching the image
    <section className="bg-gradient-to-br from-[#4d47f9] via-[#8747f9] to-[#c747f9] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Optional: Add subtle background shapes/particles for extra visual flair (as seen in the image) */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="20" cy="30" r="15" fill="currentColor" className="text-white opacity-20 animate-pulse-slow"></circle>
          <circle cx="80" cy="70" r="10" fill="currentColor" className="text-white opacity-10 animate-pulse-fast"></circle>
          <circle cx="50" cy="10" r="8" fill="currentColor" className="text-white opacity-15 animate-pulse-medium"></circle>
          <circle cx="90" cy="20" r="12" fill="currentColor" className="text-white opacity-25 animate-pulse-slow"></circle>
          <circle cx="10" cy="80" r="7" fill="currentColor" className="text-white opacity-10 animate-pulse-fast"></circle>
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main Title */}
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Start your journey with DapLink
        </h2>

        {/* Subtitle */}
        <p className="mt-6 text-xl text-gray-200">
          Join thousands of professionals, students, and creators who are building their digital presence.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          {/* Get Started Button */}
          <a
            href="#" // Replace with your actual "Get Started" link
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Get Started Free
            <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
          </a>

          {/* Explore Features Button */}
          <a
            href="#" // Replace with your actual "Explore Features" link
            className="inline-flex items-center justify-center px-8 py-4 border border-white text-base font-medium rounded-full text-white hover:bg-white hover:text-indigo-600 transition-colors shadow-lg"
          >
            Explore Features
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;