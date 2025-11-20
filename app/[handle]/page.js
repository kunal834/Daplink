"use client"
import Navbar from "@/Components/Navbar";
// import clientPromise from "@/lib/mongodb"; // Commented out as per original
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import Modal from '/Components/Modal'; // Assuming Modal and Navbar/Footer are correctly available components

export default function BlogPostPage({ params }) {
  // State to hold fetched profile data
  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 1. Data Fetching
  useEffect(() => {   
    fetch(`/api/links/${params.handle}`)
      .then((res) => res.json())
      .then((json) => setData(json.result));
  }, [params.handle]);
  
  // Loading/Not Found State
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Navbar />
        <p className="text-gray-700 text-xl mt-20">Loading profile...</p>
      </div>
    );
  }

  const { 
    handle, 
    profile, 
    script, 
    links = [], 
    mindset, 
    skillsoff = [], 
    skillsseek = [] 
  } = data;


  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 p-6 pt-20">
        <div className="flex flex-col items-center justify-start w-full max-w-lg mx-auto gap-8">

          {/* 1. Main Profile Card (Link-in-Bio) */}
          <div className="profile-card flex flex-col items-center bg-white w-full rounded-2xl shadow-2xl p-8 transition-transform duration-300">
            
            {/* Profile Photo */}
            <div className="photo mb-6">
              <img
                className="rounded-full w-32 h-32 object-cover ring-4 ring-amber-200 shadow-xl"
                src={profile || "https://placehold.co/128x128/FFBD33/white?text=@"}
                alt="Profile Photo"
              />
            </div>

            {/* Username */}
            <h1 className="text-gray-900 font-extrabold text-2xl mb-2 tracking-wide">
              @{handle}  
            </h1>

            {/* Description */}
            <p className="desc text-gray-600 text-center text-base leading-relaxed mb-8">
              {script}
            </p>

            {/* Links */}
            <div className="links flex flex-col w-full gap-4">
              {links.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {item.linktext}
                </a>
              ))}
            </div>
          </div>

          {/* 2. Mindset Wall Section */}
          {mindset && mindset.trim() !== "" && (
            <div className="w-full p-6 bg-white rounded-2xl shadow-lg border-t-4 border-indigo-500">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                Mindset
              </h2>
              <p className="text-gray-700 italic leading-relaxed">
                {mindset}
              </p>
            </div>
          )}

          {/* 3. Skill Exchange Section */}
          {(skillsoff.length > 0 || skillsseek.length > 0) && (
            <div className="w-full p-6 bg-white rounded-2xl shadow-lg border-t-4 border-green-500">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 00-2 2v10a2 2 0 002 2m0-2a2 2 0 002-2V8a2 2 0 00-2-2zM5 9h14M5 13h14M5 17h14" /></svg>
                Skill Exchange
              </h2>
              
              {/* Skills Offered */}
              {skillsoff.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">{`Skills I'm Offering (✅)`}</p>
                  <div className="flex flex-wrap gap-2">
                    {skillsoff.map((skill, index) => (
                        <span key={`off-${index}`} className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-medium shadow-sm">
                          {skill}
                        </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Seeking */}
              {skillsseek.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">{`Skills I'm Seeking (🤝)`}</p>
                  <div className="flex flex-wrap gap-2">
                    {skillsseek.map((skill, index) => (
                        <span key={`seek-${index}`} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium shadow-sm">
                          {skill}
                        </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        
        {/* The "Explore People/Jobs" Section from original code */}
        <div className="w-full">
          <div className="explore max-w-sm mx-auto bg-white rounded-lg shadow-md p-6 transition-transform duration-300 hover:scale-105">
            <p className="text-gray-700 text-base mb-6">
              Now you are become family of Daplink enjoy the opportunities 
              Benefits of Joining Daplink 
            </p>
            <div className="flex gap-4">
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white font-semibold py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-indigo-400">
                Explore Peoples
              </button>
              <button className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer text-white font-semibold py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-400" onClick={() => setModalOpen(true)}> Explore Jobs</button>
            </div>
          </div>

          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <div className="bg-white shadow-xl rounded-xl p-10 max-w-lg text-center border border-gray-200">
              <svg
                className="mx-auto mb-6 w-14 h-14 text-red-600 animate-pulse"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Access Denied</h1>
              <p className="text-lg text-gray-600 mb-8">
                {`To create and join opportunities, you need to join one of our plans.`}
              </p>
              <Link
                href="/pricing"
                className="inline-block rounded-md bg-blue-600 px-8 py-3 text-white font-semibold text-lg shadow-md hover:bg-blue-700 transition"
                aria-label="View our plans"
              >
                View Plans & Pricing
              </Link>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  </>
  );
}