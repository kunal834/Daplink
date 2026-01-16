"use client";

import { useState } from "react";
import { 
  Banknote, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Copy, 
  ChevronRight,
  Wallet,
  Globe,
  Users,
  ShieldAlert
} from "lucide-react";

export default function MonetizationDemo() {
  // STATE: Controls which view is shown (simulating backend status)
  const [status, setStatus] = useState("apply"); // Options: 'apply', 'pending', 'approved'

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- DEV TOOLS: REMOVE THIS IN PRODUCTION --- */}
      <div className="bg-black text-white p-3 text-sm flex items-center justify-center gap-4 sticky top-0 z-50">
        <span className="font-bold text-yellow-400">DEV MODE:</span>
        <span>Simulate State:</span>
        <button 
          onClick={() => setStatus("apply")}
          className={`px-3 py-1 rounded ${status === "apply" ? "bg-white text-black" : "bg-gray-800 hover:bg-gray-700"}`}
        >
          1. New User
        </button>
        <button 
          onClick={() => setStatus("pending")}
          className={`px-3 py-1 rounded ${status === "pending" ? "bg-white text-black" : "bg-gray-800 hover:bg-gray-700"}`}
        >
          2. Pending Review
        </button>
        <button 
          onClick={() => setStatus("approved")}
          className={`px-3 py-1 rounded ${status === "approved" ? "bg-white text-black" : "bg-gray-800 hover:bg-gray-700"}`}
        >
          3. Approved (Dashboard)
        </button>
      </div>
      {/* ------------------------------------------ */}

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto p-6 mt-8">
        
        {/* Header (Always Visible) */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Banknote className="text-green-600" size={32} />
            Monetization
          </h1>
          <p className="text-gray-500 mt-2">
            Partner with brands and earn revenue directly from your DapLink.
          </p>
        </div>

        {/* Dynamic Views */}
        <div className="transition-all duration-300">
          {status === "apply" && <ApplyView onApply={() => setStatus("pending")} />}
          {status === "pending" && <PendingView />}
          {status === "approved" && <DashboardView />}
        </div>

      </div>
    </div>
  );
}

// --- VIEW 1: THE SALES PITCH & APPLICATION ---
function ApplyView({ onApply }) {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-start">
      
      {/* Left: The Pitch */}
      <div className="space-y-8">
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-blue-900 mb-2">{`Why join DapLink Partners?`}</h2>
          <ul className="space-y-4">
            {[
              "Earn ₹50 - ₹500 per conversion",
              "Access to exclusive student brands (Lenskart, Udemy, etc.)",
              "Monthly payouts directly to UPI",
              "No minimum followers required"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-blue-800">
                <CheckCircle size={20} className="shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-6 bg-white rounded-2xl border shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">How it works</h3>
          <div className="space-y-6 relative pl-2">
            {/* Timeline Line */}
            <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-gray-100"></div>
            
            <Step number="1" title="Apply" desc="Fill the form to get approved." />
            <Step number="2" title="Pick Brands" desc="Choose brands that fit your audience." />
            <Step number="3" title="Earn" desc="Get paid whenever someone clicks or buys." />
          </div>
        </div>
      </div>

      {/* Right: The Form */}
      <div className="bg-white p-8 rounded-2xl border shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Application</h2>
        
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onApply(); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Main Platform</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 focus:ring-2 ring-blue-500 bg-blue-50 border-blue-200">
                Instagram
              </button>
              <button type="button" className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50">
                YouTube / Other
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile URL</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                https://
              </span>
              <input type="text" className="flex-1 block w-full rounded-none rounded-r-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="instagram.com/daplink_official" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">How many followers?</label>
            <select className="w-full p-2.5 border rounded-lg outline-none bg-white">
              <option>Just starting (0 - 500)</option>
              <option>Micro (500 - 5k)</option>
              <option>Influencer (5k+)</option>
            </select>
          </div>

          <button className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-lg font-bold shadow-lg shadow-gray-200 transition-all transform hover:scale-[1.02]">
            Submit Application
          </button>
          <p className="text-xs text-center text-gray-500">
           {` By applying, you agree to our Affiliate Terms.`}
          </p>
        </form>
      </div>
    </div>
  );
}

// --- VIEW 2: THE WAITING ROOM ---
function PendingView() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white border rounded-2xl shadow-sm text-center">
      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-6 animate-pulse">
        <Clock size={40} />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Application Under Review</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
    {`We are checking your profile to ensure it meets our quality standards. 
    Don't worry, 90% of students get approved within 24 hours.`}
      </p>
      
      <div className="bg-gray-50 p-4 rounded-lg border max-w-sm w-full text-left">
        <h4 className="text-sm font-bold text-gray-700 uppercase mb-3">Next Steps</h4>
        <div className="space-y-3">
          <div className="flex gap-3 opacity-50">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-gray-500 line-through">Submit Application</span>
          </div>
          <div className="flex gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
            </div>
            <span className="text-gray-900 font-medium">{`Review (In Progress)`}</span>
          </div>
          <div className="flex gap-3 opacity-40">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
            <span className="text-gray-500">Start Earning</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- VIEW 3: THE MONEY DASHBOARD (The "USP" Visualization) ---
function DashboardView() {
  return (
    <div className="space-y-8">
      
      {/* 1. Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
            <Wallet size={80} />
          </div>
          <p className="text-sm text-gray-500 font-medium">Available Balance</p>
          <h3 className="text-4xl font-bold text-gray-900 mt-2">{`₹1,450`}</h3>
          <button className="mt-4 text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
            Withdraw Funds <ChevronRight size={16} />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Clicks</p>
          <div className="flex items-end gap-3 mt-2">
            <h3 className="text-4xl font-bold text-gray-900">842</h3>
            <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded mb-1 flex items-center">
              <TrendingUp size={14} className="mr-1" /> {`+12%`}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-4">Last 30 days</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg">
          <p className="text-purple-100 font-medium text-sm">Pro Tip</p>
          <p className="mt-2 font-medium">
           {` Users who add 3+ sponsored links earn 2x more on average.`}
          </p>
        </div>
      </div>

      {/* 2. Active Campaigns (The Core Product) */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{`Available Campaigns`}</h3>
            <p className="text-sm text-gray-500">Add these to your DapLink to start earning.</p>
          </div>
          <span className="text-xs bg-black text-white px-3 py-1 rounded-full font-medium">Live Now</span>
        </div>
        
        <div className="divide-y">
          <CampaignRow 
            logo="🛒" 
            name="Amazon Student" 
            desc="6-month free trial for students" 
            payout="₹200 per signup" 
            tags={["High Converter", "Education"]}
          />
          <CampaignRow 
            logo="🎧" 
            name="Audible" 
            desc="Free Audiobook trial" 
            payout="₹150 per trial" 
            tags={["Entertainment"]}
          />
          <CampaignRow 
            logo="🚀" 
            name="DapLink Pro" 
            desc="Refer friends to DapLink" 
            payout="20% Lifetime" 
            tags={["Recurring", "SaaS"]}
          />
        </div>
      </div>

    </div>
  );
}

// Small Helper Component for List Items
function Step({ number, title, desc }) {
  return (
    <div className="flex gap-4 items-start relative z-10">
      <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center font-bold text-blue-600 shrink-0">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

// Small Helper for Campaign Rows
function CampaignRow({ logo, name, desc, payout, tags }) {
  return (
    <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4 hover:bg-gray-50 transition-colors">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl shrink-0">
        {logo}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-gray-900">{name}</h4>
          {tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
        <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">
          {payout}
        </span>
        <button className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black w-full md:w-auto">
          <Copy size={14} /> Copy Link
        </button>
      </div>
    </div>
  );
}