"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { io } from "socket.io-client";
import { Import } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';




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

  // 💬 NEW: Function to handle sending a message
  const handleSendMessage = (targetUserId, targetUserHandle) => {
    // 1. Log the action for debugging
    console.log(`Preparing to send message to User ID: ${targetUserId} (@${targetUserHandle})`);

    // 2. You would implement the actual messaging logic here:
    
    // --- Option A: Using Socket.IO ---
    
    io.emit('start_private_chat', {
        senderId: targetUserHandle  ,// Your current user's ID/Handle
        recipientId: targetUserId,
        // Often, the server handles creating the chat room
    });
    
  
    
    alert(`Messaging feature placeholder: Would open chat with ${targetUserHandle}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full bg-[#F3E8FF] p-10">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people.map((user) => (
            <div 
              key={user._id} 
              className="bg-white p-6 rounded-3xl shadow-sm border border-white hover:shadow-lg transition-all flex flex-col items-start gap-3"
            >
              
              {/* Icon/Header Section */}
              <div className="flex items-center gap-2 mb-1">
                 <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                   {/* Icon placeholder */}
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                 </div>
                 <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{user.profession}</span>
              </div>

              {/* User Handle (The Main Title) */}
              <h3 className="text-2xl font-bold text-gray-900">
                @{user.handle || "Unknown User"}
              </h3>

              {/* Description/Bio */}
              <p className="text-gray-500 italic text-sm">
                {user.bio || "This user is part of the Daplink family."}
              </p>

              {/* Tags/Badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                 <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                     Daplink User
                 </span>
              </div>

              {/* Action Buttons Section */}
              <div className='flex justify-between w-full gap-3 mt-4 pt-2 border-t border-gray-100'>
                {/* 1. View Profile Button (Original) */}
                <Link 
                    href={`/${user.handle}`} 
                    className="flex-1 text-center py-2 text-blue-600 font-semibold text-sm hover:underline"
                >
                    View Profile
                </Link>

                {/* 2. SEND MESSAGE BUTTON (NEW) */}
                <button
                    onClick={() => handleSendMessage(user._id, user.handle)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-purple-600 text-white text-sm font-semibold rounded-full hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                    // Add logic to disable button if the user is the current user
                    disabled={user.handle === params.handle} 
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
                    Message
                </button>
              </div>

            </div>
          ))}
        </div>
        
        {/* Empty State Message */}
        {people.length === 0 && !loading && (
          <p className="text-gray-500 mt-4">Click the button to load other creators.</p>
        )}

      </div>
      <Footer />
    </>
  );
};

export default UserProfile;