'use client';
import React, { useState } from 'react';
import {
  Link as LinkIcon, Menu, X, Sun, Moon, ChevronDown,
  BarChart2, Wallet, QrCode, Scan, FileText, Smartphone,
  MapPin, Tag, Layout, Zap, ArrowRight, Grid, Package
} from 'lucide-react';
import Link from 'next/link';

export default function Navbar({ scrolled, theme, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileProductExpand, setMobileProductExpand] = useState(false);

  // Mega Menu Data Configuration based on your request
  const megaMenuData = {
    products: [
      { name: "URL Shortener", desc: "Customize, share and track links", icon: LinkIcon },
      { name: "QR Code Generator", desc: "Dynamic solutions for business", icon: Grid },
      { name: "2D Barcodes", desc: "GS1 Digital Link for packaging", icon: Package },
      { name: "Analytics", desc: "Track and analyze performance", icon: BarChart2 },
      { name: "Pages", desc: "Mobile-friendly landing pages", icon: Layout },
    ],
    features: [
      { name: "Link-in-bio", desc: "Curate links for social profiles", icon: FileText },
      { name: "Branded Links", desc: "Customize links with your brand", icon: Tag },
      { name: "Mobile Links", desc: "Short links for SMS messages", icon: Smartphone },
      { name: "UTM Campaigns", desc: "Track links with UTM parameters", icon: MapPin },
    ],
    integrations: [
      { name: "Daplink Analyter", icon: Zap },
      { name: "Daplink + Canva", icon: Zap },
    ],
    discover: [
      { name: "API & Documentation", href: "/docs" },
      { name: "Trust Center", href: "/trust" }
    ]
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10  rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                <img src="/innovate.png" alt="" />
              </div>
              <span className={`font-bold text-xl tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                DapLink
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">

            {/* Products Mega Dropdown */}
            <div className="relative group">
              <button className={`flex items-center gap-1 text-sm font-medium h-20 transition-colors ${theme === 'dark' ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-black'}`}>
                Products
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {/* Mega Dropdown Content */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[900px] invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className={`rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden ${theme === 'dark' ? 'bg-[#0A0A0A]/95 border-gray-800' : 'bg-white/95 border-gray-100'}`}>
                  <div className="grid grid-cols-12">

                    {/* Left Side: Products & Features (8 cols) */}
                    <div className="col-span-8 p-8 grid grid-cols-2 gap-8">
                      {/* Column 1: Products */}
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Products</h4>
                        <div className="space-y-3">
                          {megaMenuData.products.map((p, i) => (
                            <a key={i} href="#" className="flex items-start gap-3 group/item p-2 rounded-lg transition-colors hover:bg-white/5">
                              <div className={`mt-1 ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>
                                <p.icon size={20} />
                              </div>
                              <div>
                                <div className={`text-sm font-bold transition-colors ${theme === 'dark' ? 'text-gray-200 group-hover/item:text-teal-400' : 'text-gray-800 group-hover/item:text-teal-600'}`}>{p.name}</div>
                                <div className={`text-xs leading-snug mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{p.desc}</div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Column 2: Features */}
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Features</h4>
                        <div className="space-y-3">
                          {megaMenuData.features.map((p, i) => (
                            <a key={i} href="#" className="flex items-start gap-3 group/item p-2 rounded-lg transition-colors hover:bg-white/5">
                              <div className={`mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                <p.icon size={20} />
                              </div>
                              <div>
                                <div className={`text-sm font-bold transition-colors ${theme === 'dark' ? 'text-gray-200 group-hover/item:text-blue-400' : 'text-gray-800 group-hover/item:text-blue-600'}`}>{p.name}</div>
                                <div className={`text-xs leading-snug mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{p.desc}</div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Integrations & Discover (4 cols) */}
                    <div className={`col-span-4 p-8 border-l ${theme === 'dark' ? 'border-gray-800 bg-white/5' : 'border-gray-100 bg-gray-50/50'}`}>
                      {/* Integrations */}
                      <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Integrations</h4>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {megaMenuData.integrations.map((item, i) => (
                          <div key={i} className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-1 ${theme === 'dark' ? 'border-gray-800 hover:border-gray-600 bg-[#0A0A0A]' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                              <item.icon size={18} />
                            </div>
                            <span className={`text-[10px] font-bold leading-tight ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.name}</span>
                          </div>
                        ))}
                      </div>

                      <a href="#" className="text-sm text-teal-500 hover:text-teal-400 font-bold flex items-center gap-1 mb-8 hover:translate-x-1 transition-transform">
                        See all integrations <ArrowRight size={14} />
                      </a>

                      {/* Discover More */}
                      <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Discover More</h4>
                      <ul className="space-y-3">
                        {megaMenuData.discover.map((item, i) => (
                          <li key={i}>
                            <a href={item.href} className={`text-sm font-medium flex items-center gap-2 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                              {item.name} <ArrowRight size={12} className="opacity-50" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {['Templates', 'About', 'Blog', 'Pricing'].map((item) => (
              <a key={item} href={`${item}`} className={`text-sm font-medium transition-colors hover:scale-105 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                {item}
              </a>
            ))}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-yellow-300' : 'bg-black/5 hover:bg-black/10 text-slate-700'}`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <a href="/login" className={`text-sm font-medium transition-colors ${theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-black'}`}>Log in</a>
            <button className={`shimmer-btn px-6 py-2.5 text-sm font-bold rounded-full transition-all transform hover:scale-105 shadow-lg ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'}`}>
              Create Free
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'text-yellow-300' : 'text-slate-700'}`}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className={`lg:hidden border-t absolute w-full z-40 shadow-xl overflow-hidden animate-fade-in-up h-[calc(100vh-80px)] overflow-y-auto ${theme === 'dark' ? 'bg-[#0A0A0A] border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="px-4 pt-4 pb-8 space-y-1">

            {/* Mobile Products Expandable */}
            <div>
              <button
                onClick={() => setMobileProductExpand(!mobileProductExpand)}
                className={`flex w-full items-center justify-between px-4 py-3 text-base font-medium rounded-xl transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Products
                <ChevronDown size={16} className={`transition-transform ${mobileProductExpand ? 'rotate-180' : ''}`} />
              </button>

              {mobileProductExpand && (
                <div className={`ml-4 pl-4 border-l mb-4 space-y-6 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                  {/* Products */}
                  <div>
                    <h5 className="text-xs uppercase font-bold text-gray-500 mb-2">Products</h5>
                    {megaMenuData.products.map((p, i) => (
                      <a key={i} href="#" className={`block py-2 text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>
                        {p.name}
                      </a>
                    ))}
                  </div>
                  {/* Features */}
                  <div>
                    <h5 className="text-xs uppercase font-bold text-gray-500 mb-2">Features</h5>
                    {megaMenuData.features.map((p, i) => (
                      <a key={i} href="#" className={`block py-2 text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>
                        {p.name}
                      </a>
                    ))}
                  </div>
                  {/* Integrations */}
                  <div>
                    <h5 className="text-xs uppercase font-bold text-gray-500 mb-2">Integrations</h5>
                    {megaMenuData.integrations.map((p, i) => (
                      <a key={i} href="#" className={`block py-2 text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>
                        {p.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {['Templates', 'About', 'Blog', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
                {item}
              </a>
            ))}

            <div className="pt-4 flex flex-col gap-3 px-1">
              <button className={`w-full py-3 border rounded-xl font-medium ${theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'}`}>
                <Link href="/login">
                  Login
                </Link>
              </button>
              <button className={`w-full py-3 rounded-xl font-bold ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>Create Free</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}