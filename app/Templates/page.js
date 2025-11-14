"use client"
import React, { useState } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const templates = [
  {
    title: "Minimal Pro",
    description: "Clean and minimal design perfect for creative professionals.",
    category: "Designers",
    image: "/mind.png",
    featured: false,
  },
  {
    title: "Student Hub",
    description: "Ideal for students showcasing projects and achievements.",
    category: "Students",
    image: "skill.png",
    featured: false,
  },
  {
    title: "Developer Portfolio",
    description: "Showcase your code and projects with style.",
    category: "Developers",
    image: "/desk.png",
    featured: true,
  },
  {
    title: "Creator Studio",
    description: "Bold and vibrant design for content creators.",
    category: "Creators",
    image: "/fun.png",
    featured: false,
  },
  {
    title: "Business Card",
    description: "Sleek horizontal template for business networking.",
    category: "Business",
    image: "/innovate.png",
    featured: true,
  },
  {
    title: "Creative Flow",
    description: "Artistic layout with custom animations.",
    category: "Designers",
    image: "/sign.png",
    featured: false,
  },
  {
    title: "Tech Minimal",
    description: "Sleek minimal-inspired design for developers.",
    category: "Developers",
    image: "/home.png",
    featured: false,
  },
  {
    title: "Campus Life",
    description: "Fun and energetic design for education and student life.",
    category: "Students",
    image: "skill.png",
    featured: true,
  },
  {
    title: "Influencer Pro",
    description: "Social media focused template.",
    category: "Creators",
    image: "/dapnav.png",
    featured: false,
  }
];

const categories = ["All", "Students", "Designers", "Developers", "Creators", "Business"];

export default function TemplateGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredTemplates = templates.filter(template =>
    (selectedCategory === "All" || template.category === selectedCategory) &&
    (template.title.toLowerCase().includes(search.toLowerCase()) || template.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
    
    <div className="min-h-screen px-4 py-8 bg-gray-50">
        <Navbar/>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-medium text-center mb-2 mt-8">Choose Your Perfect Template</h1>
        <p className="text-gray-500 text-center mb-6">
          Pre built, customizable templates designed for different professions and styles.
        </p>
        <div className="flex justify-center mb-6">
          <input
            className="border rounded-lg px-4 py-2 w-full max-w-xs shadow-sm focus:ring-2 focus:ring-blue-200"
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-4 py-1 rounded-full border ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTemplates.map((template, idx) => (
            <div key={idx} className="bg-white border rounded-xl shadow-sm overflow-hidden relative group">
              <img
                src={template.image}
                alt={template.title}
                className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition duration-200"
              />
              {template.featured && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded">Featured</span>
              )}
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1">{template.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium bg-gray-200 text-gray-700 rounded px-2 py-1">{template.category}</span>
                  <button className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition">Use Template</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredTemplates.length === 0 && (
          <div className="text-center text-gray-500 py-20">No templates found.</div>
        )}
      </div>
    </div>

    <Footer/>
    </>
  );
}
