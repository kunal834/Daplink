'use client';
import React, { useState } from 'react'; // Added useState
import { useTheme } from '@/context/ThemeContext';
import FAQ from '@/Components/FAQs';
import Pricing from '@/Components/Pricing';
import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';

export default function PricingPage() {
    const { theme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to handle the "broken" buttons
    const handleProClick = (e) => {
        // We prevent the default link behavior and show a popup instead
        e.preventDefault();
        setIsModalOpen(true);
    };

    return (
        <>
            <Navbar />
            <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#020202]' : 'bg-white'}`}>

                {/* 1. Beta Status Banner */}
                <div className="relative z-20 w-full bg-teal-500/10 border-b border-teal-500/20 py-2 text-center">
                    <p className={`text-xs font-medium ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>
                       {` 🚀 DapLink is currently in Public Beta. Paid plans are launching soon!`}
                    </p>
                </div>

                {/* Background Blobs */}
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute w-[500px] h-[500px] bg-purple-900/20 top-[-10%] left-[-10%] rounded-full blur-[80px] animate-aurora"></div>
                    <div className="absolute w-[600px] h-[600px] bg-teal-900/20 bottom-[-10%] right-[-10%] rounded-full blur-[80px] animate-aurora" style={{ animationDelay: '-5s' }}></div>
                    {theme === 'light' && <div className="absolute inset-0 bg-white/60 z-[-1]"></div>}
                </div>

                <main className="relative z-10 pt-10 pb-20">
                    {/* 2. Modified Pricing: You should pass handleProClick to your Pricing component */}
                    <Pricing theme={theme} onProClick={handleProClick} />
                    <FAQ theme={theme} />
                </main>
            </div>

            {/* 3. Simple "Join Waitlist" Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`max-w-md w-full p-8 rounded-2xl border ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-black/5'} shadow-2xl animate-in fade-in zoom-in duration-300`}>
                        <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {`You're Early! ⚡`}
                        </h3>
                        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                           {`We are currently fine-tuning our Premium features. Join 500+ creators on the waitlist to get **3 months of Pro for free** when we launch.`}
                        </p>
                        <div className="flex flex-col gap-3">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`}
                            />
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-black font-bold rounded-lg transition-all"
                            >
                                Notify Me
                            </button>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className={`text-sm mt-2 underline ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                            >
                                Back to pricing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer theme={theme} />
        </>
    );
}