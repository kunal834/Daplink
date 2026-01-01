import React from 'react';

const HeroSection = ({ isDarkmode }) => {
  return (
    <div 
      className={`py-20 text-white shadow-lg transition-colors duration-300 ${
        isDarkmode 
          ? 'bg-gray-900' // Dark mode: Deep gray/black for a sleek SaaS look
          : 'bg-indigo-600' // Light mode: Your brand indigo
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4">
          About Daplink
        </h1>
        <p className={`max-w-3xl mx-auto text-xl font-light ${isDarkmode ? 'text-gray-300' : 'text-indigo-100'}`}>
          We&apos;re on a mission to help everyone build their digital presence and connect with opportunities that matter
        </p>
      </div>
    </div>
  );
};

export default HeroSection;