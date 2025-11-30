'use client';
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Search, Sparkles } from 'lucide-react';
import Reveal from '@/Components/ui/Reveal';
import NewsletterCTA from './Newsletter';
import ArticleCard from '@/Components/ui/ArticleCard';

// --- MOCK DATA ---
const articles = [
  {
    id: 1,
    title: "The Ultimate Guide to Building Your Digital Presence",
    summary: "Learn the secrets to creating a profile that converts connections into opportunities. We cover photo selection, portfolio integration, and more.",
    category: "Guides",
    date: "Oct 25, 2025",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Feature Spotlight: The New AI-Powered Connection Engine",
    summary: "Discover how our latest update uses machine learning to match you with relevant professionals and creators with 99% accuracy.",
    category: "Product Updates",
    date: "Oct 18, 2025",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Daplink's Core Values: Why Authenticity Drives Opportunity",
    summary: "We dive deep into the values that guide our platform, focusing on simplicity, community, and genuine connection.",
    category: "Company Culture",
    date: "Oct 10, 2025",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Bootstrapped challenges and consequences",
    summary: "A compelling case study on how one university student used their Daplink profile to secure funding for their first venture.",
    category: "Case Studies",
    date: "Sep 28, 2025",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Tips & Tricks: Optimizing Your Profile for Mobile Viewing",
    summary: "Since most connections happen on mobile, here are five essential steps to ensure your Daplink profile looks perfect on any screen.",
    category: "Tips & Tricks",
    date: "Sep 15, 2025",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80"
  },
];

const categories = ["All", "Guides", "Product Updates", "Company Culture", "Case Studies", "Tips & Tricks"];

export default function BlogPage() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Logic
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#020202]' : 'bg-gray-50'}`}>
      
      {/* Global Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-purple-900/20 top-[-10%] left-[-10%] rounded-full blur-[80px] animate-aurora"></div>
        <div className="absolute w-[600px] h-[600px] bg-teal-900/20 bottom-[-10%] right-[-10%] rounded-full blur-[80px] animate-aurora" style={{ animationDelay: '-5s' }}></div>
        {theme === 'light' && <div className="absolute inset-0 bg-white/60 z-[-1]"></div>}
      </div>


      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <Reveal>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md cursor-default ${theme === 'dark' ? 'bg-white/5 border-white/10 text-teal-300' : 'bg-white border-gray-200 text-teal-700'}`}>
              <Sparkles size={12} />
              <span>The Daplink Blog</span>
            </div>
          </Reveal>
          
          <Reveal delayClass="stagger-1">
            <h1 className={`text-4xl md:text-6xl font-bold tracking-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Digital <span className="gradient-text">Journal</span> 📰
            </h1>
          </Reveal>
          
          <Reveal delayClass="stagger-2">
            <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Insights, guides, and updates on building your digital presence and unlocking new opportunities.
            </p>
          </Reveal>
        </div>

        {/* Filter & Search Bar */}
        <Reveal delayClass="stagger-3" className="mb-16 sticky top-24 z-30">
          <div className={`p-2 rounded-2xl border shadow-xl backdrop-blur-xl flex flex-col md:flex-row gap-4 items-center justify-between ${theme === 'dark' ? 'bg-[#0A0A0A]/80 border-white/10' : 'bg-white/80 border-gray-200'}`}>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start px-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                      : theme === 'dark' 
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none border transition-all ${
                  theme === 'dark'
                    ? 'bg-black/40 border-white/10 text-white placeholder-gray-600 focus:border-teal-500/50'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                }`}
              />
            </div>
          </div>
        </Reveal>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {filteredArticles.map((article, idx) => (
            <Reveal key={article.id} delayClass={`stagger-${(idx % 3) + 1}`}>
              <ArticleCard article={article} theme={theme} />
            </Reveal>
          ))}
        </div>

        {/* Newsletter Section */}
        <Reveal>
          <NewsletterCTA theme={theme} />
        </Reveal>

      </main>
    </div>
  );
}