import React from 'react';

const StorySection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-indigo-700 mb-10 text-center">
          Our Story: From Simple Idea to Global Community
        </h2>
        <div className="md:flex md:space-x-12 items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <p className="mb-4 text-lg text-gray-600">
              Daplink was born from a simple idea: everyone deserves a powerful, easy way to share their story and connect with others online.
            </p>
            <p className="mb-4 text-lg text-gray-600">
              We noticed that building a digital profile was often a complicated process, filled with existing tools that were either too simple or too complex. They overlooked the crucial elements that were essential for a robust, professional, and personal digital presence.
            </p>
            <p className="text-lg text-gray-600 font-semibold">
            { ` Today, Daplink serves over 50,000+ creators, professionals, and students, empowering them to easily build their digital presence and unlock new opportunities.`}
            </p>
          </div>
          <div className="md:w-1/2">
            {/* The image tag refers to the construction machinery from the original screenshot */}
            <div className="rounded-lg shadow-xl overflow-hidden">
              <img
                src="/innovate.png" // Placeholder URL
                alt="A large piece of construction machinery, symbolizing the building of a digital future."
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;