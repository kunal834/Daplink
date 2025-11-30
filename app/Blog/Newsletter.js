'use client';
import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export default function Newsletter({ theme }) {
  const [email,setEmail]=useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle newsletter subscription (e.g., calling an API)
    console.log("Subscribing email:", email);
    alert(`Thank you for subscribing, ${email}!`);
    setEmail('');
  };

  return (
    <div className={`relative rounded-[2.5rem] overflow-hidden p-8 md:p-12 border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-900 border-slate-800'}`}>
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="text-center md:text-left max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold uppercase mb-4">
            <Mail size={12} /> Weekly Digest
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Join the inner circle
          </h2>
          <p className="text-gray-400 text-lg">
            Get the latest trends, profile tips, and product updates delivered straight to your inbox.
          </p>
        </div>

        <div className="w-full max-w-md">
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-teal-500/50 focus:bg-white/15 transition-all"
            />
            <button className="px-8 py-3.5 rounded-xl bg-teal-500 text-black font-bold hover:bg-teal-400 transition-all flex items-center justify-center gap-2">
              Subscribe <ArrowRight size={18} />
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3 text-center sm:text-left">
            No spam, unsubscribe anytime.
          </p>
        </div>

      </div>
    </div>
  );
}
