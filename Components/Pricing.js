'use client';
import React, { useState } from 'react';
import { Check, X, ChevronDown, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Reveal from './ui/Reveal';

// --- Data Configuration ---
const EXCHANGE_RATES = {
  'USD': { rate: 1.00, symbol: '$', name: 'USD' },
  'EUR': { rate: 0.93, symbol: '€', name: 'EUR' },
  'GBP': { rate: 0.80, symbol: '£', name: 'GBP' },
  'AUD': { rate: 1.48, symbol: 'A$', name: 'AUD' },
  'INR': { rate: 83.5, symbol: '₹', name: 'INR' }
};

const PLANS = [
  {
    id: 'free',
    title: "Free",
    usdPrice: 0,
    description: "Perfect for getting started",
    isPopular: false,
    features: [
      { text: "Unlimited links", included: true },
      { text: "Basic analytics", included: true },
      { text: "Mobile responsive", included: true },
      { text: "DapLink branding", included: true },
      { text: "Custom domain", included: false },
      { text: "Advanced analytics", included: false },
      { text: "2 Barcodes", included: true },
    ]
  },
  {
    id: 'pro',
    title: "Pro",
    usdPrice: 9,
    description: "For professionals who mean business",
    isPopular: true,
    features: [
      { text: "Everything in Free", included: true },
      { text: "Custom domain", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Remove DapLink branding", included: true },
      { text: "Priority templates", included: true },
      { text: "Email support", included: true },
      { text: "20 Barcodes", included: true },
    ]
  },
  {
    id: 'premium',
    title: "Premium",
    usdPrice: 29,
    description: "Maximum power for serious creators",
    isPopular: false,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Priority support", included: true },
      { text: "AI profile optimizer", included: true },
      { text: "Custom CSS", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Unlimited Shortener", included: true },
      { text: "215 QR codes", included: true },
    ]
  },
];

const FEATURES_LIST = [
  { name: "Monthly Price", isPrice: true },
  { name: "Unlimited Links", free: true, pro: true, premium: true },
  { name: "Custom Domain", free: false, pro: true, premium: true },
  { name: "Advanced Analytics", free: false, pro: true, premium: true },
  { name: "Priority Support", free: false, pro: true, premium: true },
  { name: "AI Profile Optimizer", free: false, pro: true, premium: true },
  { name: "Remove Branding", free: false, pro: true, premium: true },
  { name: "Custom CSS", free: false, pro: false, premium: true },
];

// --- Helper Functions ---
const getConvertedPrice = (usdPrice, currencyCode) => {
  const { rate } = EXCHANGE_RATES[currencyCode];
  if (usdPrice === 0) return '0';
  return Math.round(usdPrice * rate);
};

export default function Pricing() {
  const { theme } = useTheme();
  const [currentCurrency, setCurrentCurrency] = useState('USD');

  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-16">
        <Reveal>
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
        </Reveal>
        <Reveal delayClass="stagger-1">
          <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose the plan that's right for you. All plans include a 14-day free trial.
          </p>
        </Reveal>

        {/* Currency Selector */}
        <Reveal delayClass="stagger-2" className="mt-8 flex justify-center">
          <div className="relative inline-block">
            <select
              value={currentCurrency}
              onChange={(e) => setCurrentCurrency(e.target.value)}
              className={`appearance-none pl-4 pr-10 py-2 rounded-full text-sm font-bold cursor-pointer outline-none border transition-all ${
                theme === 'dark' 
                  ? 'bg-white/10 border-white/10 text-white hover:bg-white/20' 
                  : 'bg-white border-gray-200 text-slate-900 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {Object.keys(EXCHANGE_RATES).map((code) => (
                <option key={code} value={code} className="text-black">
                  {code} ({EXCHANGE_RATES[code].symbol})
                </option>
              ))}
            </select>
            <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
          </div>
        </Reveal>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
        {PLANS.map((plan, idx) => (
          <Reveal key={plan.id} delayClass={`stagger-${idx + 1}`}>
            <div 
              className={`relative p-8 rounded-[2rem] border h-full flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                plan.isPopular 
                  ? theme === 'dark' 
                    ? 'bg-gradient-to-b from-teal-900/20 to-[#0A0A0A] border-teal-500/50 shadow-2xl shadow-teal-900/20' 
                    : 'bg-white border-teal-400 shadow-2xl shadow-teal-100'
                  : theme === 'dark' 
                    ? 'bg-[#0A0A0A]/80 border-white/10 hover:border-white/20' 
                    : 'bg-white/80 border-gray-200 hover:border-teal-200 shadow-lg'
              } backdrop-blur-xl`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles size={10} fill="currentColor" /> Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{plan.title}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {EXCHANGE_RATES[currentCurrency].symbol}{getConvertedPrice(plan.usdPrice, currentCurrency)}
                  </span>
                  <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>/month</span>
                </div>
              </div>

              <button 
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  plan.isPopular 
                    ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/25' 
                    : theme === 'dark' 
                      ? 'bg-white text-black hover:bg-gray-200' 
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {plan.usdPrice === 0 ? 'Get Started Free' : 'Start Free Trial'}
              </button>

              <div className="mt-8 space-y-4 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-0.5 rounded-full ${feature.included ? 'bg-teal-500/20 text-teal-500' : 'bg-gray-500/10 text-gray-400'}`}>
                      {feature.included ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                    </div>
                    <span className={`text-sm ${
                      feature.included 
                        ? theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Comparison Table */}
      <Reveal>
        <div className={`rounded-3xl border overflow-hidden ${theme === 'dark' ? 'bg-[#0A0A0A]/50 border-white/10' : 'bg-white border-gray-200 shadow-xl'}`}>
          <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
            <h3 className={`text-xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Compare Plans</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}>
                  <th className={`p-4 text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Feature</th>
                  <th className={`p-4 text-sm font-semibold text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Free</th>
                  <th className={`p-4 text-sm font-semibold text-center text-teal-500`}>Pro</th>
                  <th className={`p-4 text-sm font-semibold text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Premium</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES_LIST.map((feat, idx) => (
                  <tr key={idx} className={`border-b last:border-0 transition-colors ${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <td className={`p-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{feat.name}</td>
                    {['free', 'pro', 'premium'].map((tier) => (
                      <td key={tier} className="p-4 text-center">
                        {feat.isPrice ? (
                          <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {EXCHANGE_RATES[currentCurrency].symbol}
                            {getConvertedPrice(PLANS.find(p => p.id === tier).usdPrice, currentCurrency)}
                          </span>
                        ) : (
                          feat[tier] ? (
                            <Check size={18} className="mx-auto text-teal-500" />
                          ) : (
                            <span className={theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}>—</span>
                          )
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

    </section>
  );
}