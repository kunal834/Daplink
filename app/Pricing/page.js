"use client"

import FAQ from '@/Components/FAQs';
import Navbar from '@/Components/Navbar';
import React, { useState, useMemo } from 'react';
import Footer from '@/Components/Footer';

// --- Data Definitions ---

// Hardcoded exchange rates based on 1 USD for demonstration
const EXCHANGE_RATES = {
    'USD': { rate: 1.00, symbol: '$', name: 'USD' },
    'EUR': { rate: 0.93, symbol: '€', name: 'EUR' },
    'GBP': { rate: 0.80, symbol: '£', name: 'GBP' },
    'AUD': { rate: 1.48, symbol: 'A$', name: 'AUD' },
    "rup": { rate: 89, symbol: '₹', name: 'AUD' }
    
};

const PLANS = [
    {
        id: 'free',
        title: "Free",
        usdPrice: 0,
        description: "Perfect for getting started",
        icon: "⚙️",
        isPopular: false,
        colorClass: 'text-gray-500 bg-gray-200 hover:bg-gray-300',
        cardBorder: 'border-gray-200',
        features: [
            { text: "Unlimited links", included: true },
            { text: "Basic analytics", included: true },
            { text: "Mobile responsive", included: true },
            { text: "DapLink branding", included: true, subtext: "(required on free plan)" },
            { text: "Custom domain", included: false },
            { text: "Advanced analytics", included: false },
            { text: "Priority support", included: false },
            { text: "AI profile optimizer", included: false },
            { text: " 2 Bar code", included: true },
              { text: "Daplink url shortener", included: false },
              { text: "Manual Analytics", included: true },
        ]
    },
    {
        id: 'pro',
        title: "Pro",
        usdPrice: 9,
        description: "For professionals who mean business",
        icon: "✨",
        isPopular: true,
        colorClass: 'text-white bg-indigo-600 hover:bg-indigo-700',
        cardBorder: 'border-indigo-600 border-2 shadow-xl',
        features: [
            { text: "Everything in Free", included: true },
            { text: "Custom domain", included: true },
            { text: "Advanced analytics", included: true },
            { text: "Remove DapLink branding", included: true },
            { text: "Priority templates", included: true },
            { text: "Email support", included: true },
            { text: "Priority support", included: true },
            { text: "AI profile optimizer", included: true },
             { text: "limited access to Daplink URL shortener", included: true },
            { text: " 20 Bar code", included: true },
        ]
    },
    {
        id: 'premium',
        title: "Premium",
        usdPrice: 29,
        description: "Maximum power for serious creators",
        icon: "👑",
        isPopular: false,
        colorClass: 'text-white bg-indigo-600 hover:bg-indigo-700',
        cardBorder: 'border-gray-200',
        features: [
            { text: "Everything in Pro", included: true },
            { text: "Priority support", included: true },
            { text: "AI profile optimizer", included: true },
            { text: "Custom CSS", included: true },
            { text: "A/B testing", included: true },
            { text: "Advanced integrations", included: true },
            { text: "Dedicated account manager", included: true },
            { text: "Early access to features", included: true },
            { text: "Unlimtited access to Daplink URL shortener", included: true },
            { text: "215 QR code", included: true },

        ]
    },
];

// --- Helper Functions and Components ---

/**
 * Calculates the price based on the current currency rate.
 * Rounds to the nearest integer as per the design.
 */
const getConvertedPrice = (usdPrice, currencyCode) => {
    const { rate } = EXCHANGE_RATES[currencyCode];
    if (usdPrice === 0) return '0';
    return Math.round(usdPrice * rate);
};

// Component for an individual pricing card
const PricingCard = ({ plan, currentCurrency }) => {
    const { title, usdPrice, description, icon, isPopular, features, colorClass, cardBorder } = plan;
    const { symbol } = EXCHANGE_RATES[currentCurrency];
    const price = getConvertedPrice(usdPrice, currentCurrency);
    const buttonStyle = plan.id === 'free' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700';

    return (
        <div className={`relative flex flex-col p-8 bg-white border rounded-xl shadow-lg transition duration-300 hover:shadow-2xl w-full max-w-sm ${cardBorder}`}>
            {isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold uppercase rounded-full shadow-lg">
                    Most Popular
                </div>
            )}

            <div className="flex flex-col items-center">
                <div className={`p-3 rounded-lg ${plan.id === 'free' ? 'bg-gray-500' : plan.id === 'pro' ? 'bg-indigo-600' : 'bg-orange-500'}`}>
                    <span className="text-xl">{icon}</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-gray-900">{title}</h2>
                <p className="mt-2 text-sm text-gray-500 h-10 flex items-center justify-center">{description}</p>
                <div className="flex items-end mt-4">
                    <span className="text-4xl font-extrabold text-gray-900 flex items-start">
                        <span className="text-lg mr-1 mt-1 font-normal text-gray-700">{symbol}</span>
                        {price}
                    </span>
                    <span className="text-sm text-gray-500 ml-2 mb-1">/month</span>
                </div>
            </div>

            <button
                className={`w-full py-3 mt-6 rounded-lg font-bold transition duration-150 ${buttonStyle}`}
            >
                {plan.id === 'free' ? 'Get Started' : 'Start Free Trial'}
            </button>

            <ul className="mt-6 space-y-3 text-left">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                        <span className={`mr-2 flex-shrink-0 ${feature.included ? 'text-green-500' : 'text-gray-300'}`}>
                            {feature.included ? '✓' : '✗'}
                        </span>
                        <p className={feature.included ? 'text-gray-700' : 'text-gray-500'}>
                            {feature.text}
                            {feature.subtext && <span className="block text-xs text-gray-400 ml-4">{feature.subtext}</span>}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Component for the comparison table
const ComparisonTable = ({ currentCurrency }) => {
    const featuresList = [
        { name: "Monthly Price", isPrice: true },
        { name: "Unlimited Links", free: true, pro: true, premium: true },
        { name: "Custom Domain", free: false, pro: true, premium: true },
        { name: "Advanced Analytics", free: false, pro: true, premium: true },
        { name: "Priority Support", free: false, pro: true, premium: true },
        { name: "AI Profile Optimizer", free: false, pro: true, premium: true },
    ];
    const { symbol } = EXCHANGE_RATES[currentCurrency];

    const getCheckMark = (included) => (
        <span className={`text-xl font-bold ${included ? 'text-green-500' : 'text-gray-300'}`}>
            {included ? '✓' : '✗'}
        </span>
    );

    return (
        <div className="mt-20 px-4">
            <h2 className="text-2xl text-center font-semibold text-gray-900">Compare Plans</h2>
            <p className="text-gray-500 text-center mt-2 mb-8">See all features side by side</p>

            <div className="max-w-4xl mx-auto overflow-x-auto shadow-lg rounded-xl">
                <table className="min-w-full bg-white border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="py-4 px-6 text-left text-sm font-bold text-gray-700 w-1/3 rounded-tl-xl">Feature</th>
                            <th className="py-4 px-6 text-center text-sm font-bold text-gray-700 w-1/6">Free</th>
                            <th className="py-4 px-6 text-center text-sm font-bold text-gray-700 w-1/6">Pro</th>
                            <th className="py-4 px-6 text-center text-sm font-bold text-gray-700 w-1/6 rounded-tr-xl">Premium</th>
                        </tr>
                    </thead>
                    <tbody>
                        {featuresList.map((feature, index) => (
                            <tr key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition duration-100">
                                <td className="py-4 px-6 text-sm font-medium text-gray-800">{feature.name}</td>
                                <td className="py-4 px-6 text-center text-sm">
                                    {feature.isPrice ? (
                                        <div className="font-bold text-gray-900">
                                            {symbol}{getConvertedPrice(PLANS.find(p => p.id === 'free').usdPrice, currentCurrency)}
                                        </div>
                                    ) : (
                                        getCheckMark(feature.free)
                                    )}
                                </td>
                                <td className="py-4 px-6 text-center text-sm">
                                    {feature.isPrice ? (
                                        <div className="font-bold text-gray-900">
                                            {symbol}{getConvertedPrice(PLANS.find(p => p.id === 'pro').usdPrice, currentCurrency)}
                                        </div>
                                    ) : (
                                        getCheckMark(feature.pro)
                                    )}
                                </td>
                                <td className="py-4 px-6 text-center text-sm">
                                    {feature.isPrice ? (
                                        <div className="font-bold text-gray-900">
                                            {symbol}{getConvertedPrice(PLANS.find(p => p.id === 'premium').usdPrice, currentCurrency)}
                                        </div>
                                    ) : (
                                        getCheckMark(feature.premium)
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- Main App Component ---

const App = () => {
    const [currentCurrency, setCurrentCurrency] = useState('USD');

    const handleCurrencyChange = (event) => {
        setCurrentCurrency(event.target.value);
    };

    return (
        <>
        
        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
            <Navbar/>
            <header className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    Simple, Transparent Pricing
                </h1>
                <p className="mt-3 text-xl text-gray-500">
                    Choose the plan that&apos;s  right for you. All plans include a 14-day free trial.
                </p>
            </header>

            {/* Currency Converter */}
            <div className="flex justify-center mb-12">
                <div className="w-full max-w-xs text-left">
                    <label htmlFor="currency-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Currency:
                    </label>
                    <div className="relative">
                        <select
                            id="currency-select"
                            value={currentCurrency}
                            onChange={handleCurrencyChange}
                            className="appearance-none block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            {Object.entries(EXCHANGE_RATES).map(([code, data]) => (
                                <option key={code} value={code}>
                                    {code} ({data.symbol})
                                </option>
                            ))}
                        </select>
                        {/* Custom down arrow icon */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                             <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                             </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
                    {PLANS.map(plan => (
                        <PricingCard 
                            key={plan.id} 
                            plan={plan} 
                            currentCurrency={currentCurrency} 
                        />
                    ))}
                </div>
            </div>
            
            {/* Comparison Table */}
            <ComparisonTable currentCurrency={currentCurrency} />

        </div>
            <FAQ/>
              <Footer/>
        </>

  

        
    );
};

export default App;