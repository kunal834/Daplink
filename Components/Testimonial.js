'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Reveal from './ui/Reveal';
import TestimonialCard from './ui/TestimonialCard';

export default function TestimonialsSection({ theme }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/GetReview'); // Matches your backend
      const data = await response.json();
      
      console.log('API Response:', data); // Debug log
      
      if (data.success) {
        setTestimonials(data.data); // ← Your backend uses 'data', not 'reviews'
      }
    } catch (error) {
      console.error('Fetch error:', error);
      // Fallback data
      setTestimonials([
        {
          clientname: "Sarah Chen",
          profession: "UX Designer", 
          message: "Amazing service!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={`py-24 border-t ${theme === 'dark' ? 'border-gray-900 bg-[#050505]' : 'border-gray-100 bg-white'}`}>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading testimonials...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-24 border-t transition-colors duration-500 ${theme === 'dark' ? 'border-gray-900 bg-[#050505]' : 'border-gray-100 bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-center md:text-left w-full md:w-auto">
            <Reveal>
              <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Loved by creators
              </h2>
            </Reveal>
            <Reveal delayClass="stagger-1">
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Join {testimonials.length} creators transforming their online presence.
              </p>
            </Reveal>
          </div>
          
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
            <Reveal key={testimonial._id || index} delayClass={`stagger-${(index % 3) + 1}`}>
              <TestimonialCard 
                theme={theme}
                name={testimonial.clientname} 
                role={testimonial.profession} 
                text={testimonial.message}
              />
            </Reveal>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center mt-12 py-12 text-gray-500">
            No testimonials yet. Be the first to share your experience!
          </div>
        )}
      </div>
    </section>
  );
}
