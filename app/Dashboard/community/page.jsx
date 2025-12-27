'use client';

import React from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';

export default function CommunityTab({ isDarkMode }) {
  const communities = [
    { id: 1, name: "Web3 Design", members: "1.2k", image: "bg-blue-100 text-blue-600", isNew: true },
    { id: 2, name: "Digital Artists", members: "8.5k", image: "bg-purple-100 text-purple-600" },
    { id: 3, name: "Indie Hackers", members: "24k", image: "bg-green-100 text-green-600" },
    { id: 4, name: "Content Creators", members: "45k", image: "bg-rose-100 text-rose-600" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Community Hub</h2>
          <p className="text-sm text-zinc-500">
            Find your tribe and collaborate.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          1,204 Creators Online
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
        <div className="relative z-10 max-w-md">
          <h3 className="text-2xl font-bold mb-2">
            Join the Creator Circle
          </h3>
          <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
            Exclusive access to brand deals, collaboration opportunities, and expert workshops.
          </p>
          <Link
            href="/Explorepeoples"
            className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Explore Peoples
          </Link>
        </div>

        <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 opacity-20">
          <Users className="w-64 h-64" />
        </div>
      </div>

      {/* Communities */}
      <div>
        <h3 className={`font-bold mb-4 px-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
          Trending Communities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communities.map((c) => (
            <div
              key={c.id}
              className={`p-5 rounded-2xl border transition-all group cursor-pointer relative overflow-hidden ${
                isDarkMode
                  ? 'bg-zinc-900 border-zinc-800 hover:border-indigo-500'
                  : 'bg-white border-zinc-200 hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              {c.isNew && (
                <span className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                  NEW
                </span>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.image}`}>
                  <Users className="w-6 h-6" />
                </div>

                <div>
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                    {c.name}
                  </h4>
                  <p className="text-xs text-zinc-500">
                    {c.members} members
                  </p>
                </div>
              </div>

              <button
                className={`w-full py-2.5 rounded-lg border text-xs font-bold transition-colors ${
                  isDarkMode
                    ? 'border-zinc-700 text-zinc-400 group-hover:bg-white group-hover:text-black'
                    : 'border-zinc-200 text-zinc-600 group-hover:bg-black group-hover:text-white group-hover:border-black'
                }`}
              >
                Join Group
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
