'use client';
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Reveal from './ui/Reveal';

const FAQS = [
  { question: "Can I change my plan later?", answer: "Yes, you can upgrade or downgrade your plan at any time from your account settings." },
  { question: "Is there a free trial?", answer: "We offer a 14-day free trial for all paid plans. No credit card required to start." },
  { question: "What happens to my links if I downgrade?", answer: "Your links will remain active, but premium features like custom domains will be disabled." },
  { question: "Do you offer refunds?", answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service." },
];

export default function FAQ() {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className={`py-24 relative z-10 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Reveal>
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Frequently Asked Questions</h2>
          </Reveal>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <Reveal key={idx} delayClass={`stagger-${(idx % 3) + 1}`}>
              <div 
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  theme === 'dark' 
                    ? `bg-white/5 border-white/10 ${openIndex === idx ? 'bg-white/10' : 'hover:bg-white/10'}` 
                    : `bg-white border-gray-200 ${openIndex === idx ? 'shadow-md' : 'hover:shadow-md'}`
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {faq.question}
                  </span>
                  <div className={`p-1 rounded-full ${theme === 'dark' ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                    {openIndex === idx ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                <div 
                  className={`px-6 text-sm leading-relaxed transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === idx ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                  } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {faq.answer}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}