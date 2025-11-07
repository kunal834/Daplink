// FeatureShowcase.jsx
import React from 'react';
import { LinkIcon, PaintBrushIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const FeatureShowcase = () => {
  return (
    // Background: Uses the amber gradient
    <div className="bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 py-16 md:w-full w-[106vw] ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Section Header --- */}
        <div className="lg:text-center">
          <h2 className="text-lg font-semibold text-indigo-800">
            Daplink Advantage
          </h2>
          {/* Adjusted text-gray-900 for high contrast on the gradient */}
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            More than just a link—it's your digital headquarters.
          </p>
          {/* Adjusted text color for better readability on the bright background */}
          <p className="mt-4 max-w-2xl text-xl text-gray-700 lg:mx-auto">
            Discover the powerful features that make Daplink the essential tool for creators and professionals to manage and monetize their audience.
          </p>
        </div>

        {/* --- Key Features Grid --- */}
        <div className="mt-20">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            
            {/* Feature 1: Unified Linking */}
            <div className="relative p-4 rounded-lg bg-white/30 backdrop-blur-sm shadow-md transition hover:bg-white/50">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white">
                  <LinkIcon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Unified Link Aggregation
                </p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-700">
                Benefit: Collect all your social profiles, products, and content into one stunning, mobile-optimized page.Never change your bio link again.
              </dd>
            </div>

            {/* Feature 2: Deep Customization */}
            <div className="relative p-4 rounded-lg bg-white/30 backdrop-blur-sm shadow-md transition hover:bg-white/50">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white">
                  <PaintBrushIcon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Advanced Personalization
                </p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-700">
               Benefit: Fully control your brand aesthetic with custom themes, colors, and backgrounds.Stand out from the crowd with a unique visual identity.
              </dd>
            </div>

            {/* Feature 3: Performance Analytics */}
            <div className="relative p-4 rounded-lg bg-white/30 backdrop-blur-sm shadow-md transition hover:bg-white/50">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white">
                  <ChartBarIcon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  In-Depth Click Analytics
                </p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-700">
                Benefit: Track which links are performing best in real-time. Make data-driven decisions to optimize your content strategy and boost engagement.
              </dd>
            </div>
            
          </dl>
        </div>
        
        {/* --- Highlighted Core Benefit Section --- */}
        {/* Changed border-t to border-t-2 and border-gray-900 for contrast */}
        <div className="mt-24 pt-10 border-t-2 border-gray-900/10">
            {/* Added flex-col-reverse on mobile for a better stacking order */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 flex flex-col-reverse lg:flex-row">
                <div className="lg:col-span-6">
                    <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Turn Followers into Customers.
                    </h3>
                    <p className="mt-4 text-xl text-gray-700">
                        Stop sending traffic to dead ends. Daplink is the only tool that allows you to embed product checkouts and direct monetization links right on your page.
                    </p>
                    <ul className="mt-6 space-y-4">
                        <li className="flex items-start">
                            {/* Adjusted icon color for better contrast */}
                            <ArrowTrendingUpIcon className="flex-shrink-0 h-6 w-6 text-indigo-700 mr-2" />
                            <p className="text-base text-gray-800">
                                Direct Monetization :Integrate with e-commerce and payment platforms seamlessly.
                            </p>
                        </li>
                        <li className="flex items-start">
                            <ArrowTrendingUpIcon className="flex-shrink-0 h-6 w-6 text-indigo-700 mr-2" />
                            <p className="text-base text-gray-800">
                                Higher Conversions: Fewer clicks between your audience and your goal (purchase, subscription, download).
                            </p>
                        </li>
                        <li className="flex items-start">
                            <ArrowTrendingUpIcon className="flex-shrink-0 h-6 w-6 text-indigo-700 mr-2" />
                            <p className="text-base text-gray-800">
                                Future-Proof: Always ready for the next social platform or monetization channel.
                            </p>
                        </li>
                    </ul>
                </div>
                <div className="mt-10 lg:mt-0 lg:col-span-6">
                    {/* Placeholder for an image or animation of a product link/checkout */}
                    {/* Added relative positioning for better aspect ratio support */}
                    {/* <div className="relative pt-[56.25%] sm:pt-[65%] lg:pt-[70%] bg--100 rounded-lg overflow-hidden shadow-2xl flex items-center justify-center">
                        <span className="absolute inset-0 flex items-center justify-center text-gray-500 italic p-10">
                             
                        </span>
                    </div> */}
                   <img src="/feature.png" alt="" />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default FeatureShowcase;