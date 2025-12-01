'use client';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import FAQ from '@/Components/FAQs';
import Pricing from '@/Components/Pricing';



export default function PricingPage() {
    // Consumes global state. No local provider needed.
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#020202]' : 'bg-white'}`}>

            {/* Background Blob (Matches Home) */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[500px] h-[500px] bg-purple-900/20 top-[-10%] left-[-10%] rounded-full blur-[80px] animate-aurora"></div>
                <div className="absolute w-[600px] h-[600px] bg-teal-900/20 bottom-[-10%] right-[-10%] rounded-full blur-[80px] animate-aurora" style={{ animationDelay: '-5s' }}></div>
                {theme === 'light' && <div className="absolute inset-0 bg-white/60 z-[-1]"></div>}
            </div>

            <main className="relative z-10 pt-20 pb-20">
                {/* Pass theme if components need explicit prop, otherwise they can also use useTheme() */}
                <Pricing theme={theme} />
                <FAQ theme={theme} />
            </main>
        </div>
    );
}