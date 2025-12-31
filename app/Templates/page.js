'use client';
import React, { useState } from 'react';
import { Search, Sparkles, Layout, ArrowRight } from 'lucide-react';
import Reveal from '@/Components/ui/Reveal';
import { useTheme } from '@/context/ThemeContext';
import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';

// --- MOCK DATA ---
const templates = [
  /* ... keep your existing templates array ... */
];

const categories = ["All", "Students", "Designers", "Developers", "Creators", "Business"];

export default function TemplateGallery() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredTemplates = templates.filter(template =>
    (selectedCategory === "All" || template.category === selectedCategory) &&
    (template.title.toLowerCase().includes(search.toLowerCase()) || template.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Navbar />
      
      {/* Container to handle global background and consistency */}
      <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#020202]' : 'bg-gray-50'}`}>
        
        {/* 1. Consistent Beta Banner (The Trust Element) */}
        <div className="relative z-[40] w-full bg-teal-500/10 border-b border-teal-500/20 py-2 text-center pt-24 md:pt-2">
            <p className={`text-[10px] md:text-xs font-medium tracking-wide ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>
                {`Template feature under construction stay tuned for more updates!`}
            </p>
        </div>

        {/* Global Background Ambience */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] bg-purple-900/20 top-[-10%] left-[-10%] rounded-full blur-[80px] animate-pulse"></div>
          <div className="absolute w-[600px] h-[600px] bg-teal-900/20 bottom-[-10%] right-[-10%] rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '-2s' }}></div>
          {theme === 'light' && <div className="absolute inset-0 bg-white/60 z-[-1]"></div>}
        </div>

        {/* 2. Main Content - Adjusted Padding for Banner */}
        <main className="relative z-10 pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

          {/* Header Section */}
          <div className="text-center mb-16 space-y-4">
            <Reveal>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md ${theme === 'dark' ? 'bg-white/5 border-white/10 text-teal-300' : 'bg-white border-gray-200 text-teal-700'}`}>
                <Sparkles size={14} />
                <span>Premium Collection</span>
              </div>
            </Reveal>

            <Reveal delayClass="stagger-1">
              <h1 className={`text-4xl md:text-6xl font-bold tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Choose Your <span className="gradient-text">Perfect Template</span>
              </h1>
            </Reveal>

            <Reveal delayClass="stagger-2">
              <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
               {` Pre-built, customizable designs tailored for every profession. Start building your digital identity in seconds.`}
              </p>
            </Reveal>
          </div>

          {/* Controls Section (Search & Filter) */}
          <Reveal delayClass="stagger-3" className="mb-12 relative z-20">
            <div className={`p-4 rounded-2xl border backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 ${theme === 'dark' ? 'bg-[#0A0A0A]/80 border-white/10' : 'bg-white/80 border-gray-200 shadow-xl'}`}>

              {/* Search Bar */}
              <div className={`relative w-full md:w-80 group`}>
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${theme === 'dark' ? 'text-gray-500 group-focus-within:text-teal-400' : 'text-gray-400 group-focus-within:text-teal-600'}`} />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${theme === 'dark'
                      ? 'bg-black/40 border-white/10 text-white placeholder-gray-600 focus:border-teal-500/50 focus:bg-black/60'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/10'
                    }`}
                />
              </div>

              {/* Category Chips */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${selectedCategory === cat
                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25 scale-105'
                        : theme === 'dark'
                          ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, idx) => (
              <Reveal key={idx} delayClass={`stagger-${(idx % 3) + 1}`}>
                <div className={`group relative flex flex-col overflow-hidden rounded-[2rem] h-[440px] transition-all duration-500 border hover:-translate-y-2 ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5 hover:border-teal-500/30' : 'bg-white border-gray-100 hover:border-teal-500/50 hover:shadow-xl'}`}>

                  {/* Image Section */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                    <img
                      src={template.image}
                      alt={template.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {template.category}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {template.featured && (
                      <div className="absolute top-4 right-4 z-20">
                        <span className="flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-500 text-black shadow-lg">
                          <Sparkles size={10} fill="black" /> Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {template.title}
                      </h3>
                      <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-white/5 text-gray-400 group-hover:text-teal-400' : 'bg-gray-100 text-gray-500 group-hover:text-teal-600'} transition-colors`}>
                        <Layout size={18} />
                      </div>
                    </div>

                    <p className={`text-sm mb-6 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {template.description}
                    </p>

                    <div className="mt-auto">
                      <button className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${theme === 'dark'
                          ? 'bg-white text-black hover:bg-teal-400 hover:scale-[1.02]'
                          : 'bg-black text-white hover:bg-teal-600 hover:scale-[1.02]'
                        }`}>
                        Use Template <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                </div>
              </Reveal>
            ))}
          </div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <Reveal>
              <div className="text-center py-20">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <Search className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No templates found</h3>
                <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>Try adjusting your search or category filter.</p>
              </div>
            </Reveal>
          )}

        </main>
      </div>
      <Footer />
    </>
  );
}