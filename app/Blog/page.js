"use client"
import React from 'react';
import NewsletterCTA from './Newsletter';

// Sample data for the blog articles
const articles = [
  {
    id: 1,
    title: "The Ultimate Guide to Building Your Digital Presence on Daplink",
    summary: "Learn the secrets to creating a profile that converts connections into opportunities. We cover photo selection, portfolio integration, and more.",
    category: "Guides",
    date: "Oct 25, 2025",
    readTime: "7 min read",
    imageUrl: "/innovate.png"
  },
  {
    id: 2,
    title: "Feature Spotlight: The New AI-Powered Connection Engine",
    summary: "Discover how our latest update uses machine learning to match you with relevant professionals and creators with 99% accuracy.",
    category: "Product Updates",
    date: "Oct 18, 2025",
    readTime: "4 min read",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4GQuewxLfMh2olMxwVIVsJmu1qFf5Q4dwZw&s"
  },
  {
    id: 3,
    title: "Daplink's Core Values: Why Authenticity Drives Opportunity",
    summary: "We dive deep into the values that guide our platform, focusing on simplicity, community, and genuine connection.",
    category: "Company Culture",
    date: "Oct 10, 2025",
    readTime: "5 min read",
    imageUrl: "https://media.istockphoto.com/id/1405663504/vector/woman-look-in-mirror-seeing-different-faces.jpg?s=612x612&w=0&k=20&c=0Hxme_WZwzKSZ69nbH9oEZ4qbdBbXRGN-P5vvSp4PxM="
  },
  {
    id: 4,
    title: "Bootstraped challenges and consequences ",
    summary: "A compelling case study on how one university student used their Daplink profile to secure funding for their first venture.",
    category: "Case Studies",
    date: "Sep 28, 2025",
    readTime: "8 min read",
    imageUrl: "https://news.crunchbase.com/wp-content/uploads/Bootstrap.jpg"
  },
  {
    id: 5,
    title: "Tips & Tricks: Optimizing Your Profile for Mobile Viewing",
    summary: "Since most connections happen on mobile, here are five essential steps to ensure your Daplink profile looks perfect on any screen.",
    category: "Tips & Tricks",
    date: "Sep 15, 2025",
    readTime: "3 min read",
    imageUrl: "https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/77502c730c0a965d1e48f85b03516fda9026c8ec/235f05003fb991549d1c03e57b50ee57221d695b"
  },
];

// Helper component for individual article card
const ArticleCard = ({ article }) => {
  const categoryColors = {
    "Guides": "bg-indigo-500",
    "Product Updates": "bg-blue-500",
    "Company Culture": "bg-green-500",
    "Case Studies": "bg-yellow-500",
    "Tips & Tricks": "bg-red-500",
  };

  return (
    <div className="flex flex-col rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Image */}
      <div className="flex-shrink-0">
        <img className="h-48 w-full object-cover" src={article.imageUrl} alt={article.title} />
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          {/* Category Badge */}
          <p className="text-sm font-medium">
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold uppercase text-white ${categoryColors[article.category] || 'bg-gray-500'}`}>
              {article.category}
            </span>
          </p>
          {/* Title and Summary */}
          <a href={`/blog/${article.id}`} className="block mt-2">
            <p className="text-xl font-bold text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors duration-200">
              {article.title}
            </p>
            <p className="mt-3 text-base text-gray-500 line-clamp-3">
              {article.summary}
            </p>
          </a>
        </div>
        {/* Footer Metadata */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <p>
            Published on <time dateTime={article.date}>{article.date}</time>
          </p>
          <p>{article.readTime}</p>
        </div>
      </div>
    </div>
  );
};


// Main Blog Page Component
const BlogPage = () => {
  // Get unique categories for filters
  const categories = [...new Set(articles.map(a => a.category))];

  return (

    <>

    
     <div className="bg-white">
      {/* Blog Hero Section */}
      <div className="relative py-16 bg-gray-50 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold mt-8 tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            The Daplink Digital Journal 📰
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Insights, guides, and updates on building your digital presence and unlocking new opportunities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Categories/Filters */}
        <div className="mb-12 border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Explore Topics</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 text-sm font-medium rounded-full bg-gray-900 text-white shadow-md transition-colors duration-200">
              All Articles (5)
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 text-sm font-medium rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Newsletter CTA */}
        <NewsletterCTA/>
      </div>
    </div>


    
    </>
   
  );
};

export default BlogPage;