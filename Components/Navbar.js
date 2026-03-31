'use client';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  Link as LinkIcon, Menu, X, Sun, Moon, ChevronDown,
  BarChart2, Zap, QrCode, Scan, FileText, Smartphone,
  MapPin, Tag, Layout, ArrowRight, Grid, Package
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/Authenticate';
import { toast } from "react-toastify";
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileProductExpand, setMobileProductExpand] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user, loading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logouthandler = async () => {
    try {
      const isConfirm = window.confirm("Are you sure you want to logout?");
      if (isConfirm) {
        const result = await axios.get('/api/auth/logout', {
          withCredentials: true,
        });

        if (result.data.success) {
          logout();
          setIsMenuOpen(false); // Close menu on logout
          toast.success("Logged out successfully");
          router.replace("/login");
        } else {
          toast.error(result.data.message || "Logout failed");
        }
      }
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const destination = isAuthenticated ? "/Dashboard" : "/login";

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
      { name: "Daplink Analyzer", icon: Zap },
    ],
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-all duration-300">
              <Image height={45} width={45} src="/innovate.png" alt="Logo" />
            </div>
            <span className={`font-bold text-xl tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>DapLink</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <button className={`flex items-center gap-1 text-sm font-medium h-20 transition-colors ${theme === 'dark' ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-black'}`}>
                Products
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {/* Mega Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/3 pt-2 w-[900px] invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className={`rounded-2xl border shadow-2xl backdrop-blur-xl p-8 grid grid-cols-3 gap-8 ${theme === 'dark' ? 'bg-[#0A0A0A]/95 border-gray-800' : 'bg-white/95 border-gray-100'}`}>
                  {/* Products Column */}
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Products</h4>
                    <div className="space-y-4">
                      {megaMenuData.products.map((p, i) => (
                        <Link key={i} href={destination} className="flex gap-3 group/item">
                          <div className={`mt-1 ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}><p.icon size={20} /></div>
                          <div>
                            <div className={`text-sm font-bold transition-colors ${theme === 'dark' ? 'text-gray-200 group-hover/item:text-teal-400' : 'text-gray-800 group-hover/item:text-teal-600'}`}>{p.name}</div>
                            <div className="text-xs text-gray-500">{p.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Features Column */}
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Features</h4>
                    <div className="space-y-4">
                      {megaMenuData.features.map((p, i) => (
                        <Link key={i} href={destination} className="flex gap-3 group/item">
                          <div className={`mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}><p.icon size={20} /></div>
                          <div>
                            <div className={`text-sm font-bold transition-colors ${theme === 'dark' ? 'text-gray-200 group-hover/item:text-blue-400' : 'text-gray-800 group-hover/item:text-blue-600'}`}>{p.name}</div>
                            <div className="text-xs text-gray-500">{p.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Integrations Column */}
                  <div className={`pl-8 border-l ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Integrations</h4>
                    <div className="flex gap-3 mb-6">
                      {megaMenuData.integrations.map((item, i) => (
                        <div key={i} className={`flex-1 p-3 rounded-xl border text-center flex flex-col items-center gap-2 transition-colors cursor-pointer ${theme === 'dark' ? 'border-gray-800 hover:border-gray-600 bg-white/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}>
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                            <item.icon size={16} />
                          </div>
                          <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.name}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="#" className="text-sm text-teal-500 hover:text-teal-400 font-medium flex items-center gap-1 mb-8">
                      See all integrations <ArrowRight size={14} />
                    </Link>
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Discover More</h4>
                    <ul className="space-y-2">
                      <li><Link href="/Docu" className={`text-sm flex items-center gap-1 hover:text-teal-500 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>API & Documentation <ArrowRight size={12} /></Link></li>
                      <li><Link href="/Trust" className={`text-sm flex items-center gap-1 hover:text-teal-500 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Trust Center <ArrowRight size={12} /></Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {['Blog', 'Templates'].map((item) => (
              <Link key={item} href={`/${item}`} className={`text-sm font-medium transition-colors hover:scale-105 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                {item}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link href="/Dashboard" className={`text-sm font-medium transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>Dashboard</Link>
                <button onClick={logouthandler} className={`text-sm font-medium transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>Logout</button>
              </>
            ) : (
              <Link href="/login" className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all transform hover:scale-105 shadow-lg ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'}`}>Log in</Link>
            )}

            <button onClick={toggleTheme} className={`p-2 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-yellow-300' : 'bg-black/5 hover:bg-black/10 text-slate-700'}`}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
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
        <div className={`lg:hidden border-t absolute w-full z-40 shadow-xl h-[calc(100vh-80px)] overflow-y-auto ${theme === 'dark' ? 'bg-[#0A0A0A] border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="px-4 pt-4 pb-8 space-y-1">
            {/* Mobile Products */}
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
                  <div>
                    <h5 className="text-xs uppercase font-bold text-gray-500 mb-2">Solutions</h5>
                    {megaMenuData.products.map((p, i) => (
                      <Link key={i} href={destination} onClick={() => setIsMenuOpen(false)} className={`block py-2 text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>{p.name}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {['Templates', 'About', 'Blog'].map((item) => (
              <Link key={item} href={`/${item}`} onClick={() => setIsMenuOpen(false)} className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
                {item}
              </Link>
            ))}

            {/* FIXED MOBILE AUTH SECTION */}
            <div className="pt-6 flex flex-col gap-3 px-1">
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/Dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`w-full py-4 rounded-xl font-bold text-center transition-all ${
                      theme === 'dark' 
                        ? 'bg-white text-black hover:bg-gray-100' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    Go to Dashboard
                  </Link>
                  <button 
                    onClick={logouthandler}
                    className={`w-full py-3 rounded-xl font-medium text-center transition-all ${
                      theme === 'dark' 
                        ? 'text-red-400 hover:bg-red-500/10' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`w-full py-4 rounded-xl font-bold text-center transition-all ${
                    theme === 'dark' 
                      ? 'bg-white text-black hover:bg-gray-100' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}