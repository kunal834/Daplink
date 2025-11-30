"use client"; 
import React, { useState } from 'react';
import axios from 'axios';

import Link from 'next/link';

const UserProfile = ({ params }) => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  // This function hits your 'Peoples' route
  const handleFetchAll = async () => {
    try {
      setLoading(true);
      // Note the capital 'P' because your folder is named 'Peoples'
      const response = await axios.get('/api/Peoples'); 
      
      console.log(response.data); // Check console to see the data
      setPeople(response.data.result); // Assuming your API returns { result: [...] }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching people:", error);
      setLoading(false);
    }
  };

  return (
    <>
     <div className="min-h-screen w-full bg-[#F3E8FF] p-10"> {/* Assuming a light purple bg like screenshot */}

      {/* Header Area */}
      <div className="flex justify-between items-center mb-8 mt-16">
        <h1 className='text-3xl font-bold text-gray-800'>
            Profile: <span className="text-blue-600">@{params.handle}</span>
        </h1>
        
        <button 
          onClick={handleFetchAll}
          disabled={loading}
          className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium transition-all"
        >
          {loading ? "Loading..." : "Explore People"}
        </button>
      </div>

      {/* THE CARDS GRID */}
      {/* 1. We use a Grid layout to arrange cards nicely */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {people.map((user) => (
          // 2. This represents ONE CARD matching your design
          <div 
            key={user._id} 
            className="bg-white p-6 rounded-3xl shadow-sm border border-white hover:shadow-md transition-all flex flex-col items-start gap-3"
          >
            {/* Icon/Header Section (Mimicking the 'Mindset' icon area) */}
            <div className="flex items-center gap-2 mb-1">
               <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                 {/* Simple Icon placeholder */}
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
               </div>
               <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Creator</span>
            </div>

            {/* User Handle (The Main Title) */}
            <h3 className="text-2xl font-bold text-gray-900">
                @{user.handle || "Unknown User"}
            </h3>

            {/* Description/Bio (Mimicking the italic text) */}
            <p className="text-gray-500 italic text-sm">
                {user.bio || "This user is part of the Daplink family."}
            </p>

            {/* Tags/Badges (Mimicking the green tags) */}
            <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Daplink User
                </span>
                {/* Add more dynamic tags if your DB has them */}
            </div>

            {/* 'Visit Profile' Button at bottom of card */}
            <Link 
                href={`/${user.handle}`} 
                className="mt-auto pt-4 w-full text-center text-blue-600 font-semibold text-sm hover:underline"
            >
                View Profile &rarr;
            </Link>

          </div>
        ))}
      </div>
      
      {/* Empty State Message */}
      {people.length === 0 && !loading && (
        <p className="text-gray-500 mt-4">Click the button to load other creators.</p>
      )}

    </div>


    </>
   
  );
};

export default UserProfile;