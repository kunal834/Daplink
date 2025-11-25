'use client';
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Reveal from './ui/Reveal';
import TestimonialCard from './ui/TestimonialCard';

// Default data - simpler to replace later with API data
const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "UX Designer",
    text: "DapLink completely transformed how I share my portfolio. I landed 3 freelance gigs in the first month just because clients found my work easier to access!"
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "DevRel",
    text: "The skill exchange feature helped me find a mentor and learn React. It's not just a bio link, it's a genuine community of builders."
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Content Creator",
    text: "My audience engagement doubled after switching to DapLink. The analytics are incredibly detailed compared to other tools I've used."
  }
];

export default function TestimonialsSection({ theme, testimonials = TESTIMONIALS }) {
  return (
    <section className={`py-24 border-t transition-colors duration-500 ${theme === 'dark' ? 'border-gray-900 bg-[#050505]' : 'border-gray-100 bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-center md:text-left w-full md:w-auto">
            <Reveal>
              <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Loved by creators
              </h2>
            </Reveal>
            <Reveal delayClass="stagger-1">
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Join the community transforming their online presence.
              </p>
            </Reveal>
          </div>
          
          {/* Navigation Buttons (Visual Only) */}
          <Reveal delayClass="stagger-2" className="hidden md:flex gap-3">
            <button className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${theme === 'dark' ? 'border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white hover:border-gray-600' : 'border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-black hover:border-gray-300'}`}>
              <ArrowLeft size={20} />
            </button>
            <button className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${theme === 'dark' ? 'border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white hover:border-gray-600' : 'border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-black hover:border-gray-300'}`}>
              <ArrowRight size={20} />
            </button>
          </Reveal>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.id || index} delayClass={`stagger-${(index % 3) + 1}`}>
              <TestimonialCard 
                theme={theme}
                name={testimonial.name} 
                role={testimonial.role} 
                text={testimonial.text} 
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}