"use client";
import Navbar from "@/Components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "/Components/Modal";

export default function BlogPostPage({ params }) {
  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Data Fetching
  useEffect(() => {
    fetch(`/api/links/${params.handle}`)
      .then((res) => res.json())
      .then((json) => setData(json.result));
  }, [params.handle]);

  // Loading State
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Navbar />
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
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
    skillsseek = [],
  } = data;

  return (
    <>
      <Navbar />

      {/* Main Wrapper with subtle gradient background */}
      <div className="min-h-screen bg-gradient-to-tr from-[#e5eaff] via-[#f1e3f3] md:p-4 p-5 to-[#fae6fe] pt-24 pb-12 px-4 sm:px-6">
        
        {/* Content Container - Centered & Constrained Width */}
        <div className="max-w-2xl mx-auto flex flex-col gap-8 mt-18">
          
          {/* 1. PROFILE HEADER */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center text-center max-w-md mx-auto w-5xl">
      <div className="relative mb-6 group">
        <img
          className="rounded-full w-28 h-28 object-cover border-4 border-white shadow-md"
          src={profile || "https://placehold.co/112x112/FFBD33/white?text=@"}
          alt={`@${handle} Profile`}
        />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">@{handle}</h2>
      {script && (
        <p className="text-gray-600 text-base mb-5 max-w-xs mx-auto leading-relaxed">{script}</p>
      )}

      {/* Links */}
      <div className="flex flex-col gap-3 w-full mt-4">
        {links.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-full py-3 px-5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-400/50 transition-all duration-200"
          >
            <span className="font-semibold text-indigo-700 group-hover:text-indigo-900 text-md truncate">
              {item.linktext}
            </span>
            <svg className="ml-3 w-4 h-4 text-indigo-400 group-hover:text-indigo-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        ))} 
      </div>
    </div>

          {/* 3. DETAILS GRID (Mindset & Skills) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Mindset Card */}
            {mindset && mindset.trim() !== "" && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 ">
                <div className="flex items-center gap-2 mb-3 text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  <h2 className="font-bold text-gray-900">Mindset</h2>
                </div>
                <p className="text-gray-600 italic text-sm leading-relaxed">
                  {mindset}
                </p>
              </div>
            )}

            {/* Skills Card */}
            {(skillsoff.length > 0 || skillsseek.length > 0) && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col gap-4 shadow-xl">
                
                {skillsoff.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-emerald-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Offering</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillsoff.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {skillsseek.length > 0 && (
                  <div>
                     <div className="flex items-center gap-2 mb-2 text-blue-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Seeking</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillsseek.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. DAPLINK PROMO (Call to Action) */}
          <div className="mt-4 relative overflow-hidden rounded-2xl bg-gray-900 text-white p-6 sm:p-8 shadow-2xl">
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-600 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-50"></div>
            
            <div className="relative z-10 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Join the Daplink Family</h3>
                <p className="text-gray-400 text-sm mb-6 sm:mb-0 max-w-sm">
                  Create your own professional profile, connect with others, and find opportunities.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button className="px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg">
                  Explore People
                </button>
                <button 
                  onClick={() => setModalOpen(true)}
                  className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Explore Jobs</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* 5. MODAL */}
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlock Opportunities</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                To access premium job listings and connect with recruiters, you need to upgrade your Daplink plan.
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  href="/Pricing"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02]"
                >
                  View Plans & Pricing
                </Link>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 text-sm font-medium hover:text-gray-600"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </Modal>

        </div>
      </div>
    </>
  );
}