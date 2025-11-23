"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Menu, X, ChevronDown, ChevronUp, Link as LinkIcon, Grid, BarChart2, FileText, 
  Tag, Smartphone, MapPin, Package, Zap, Users, BookOpen
} from 'lucide-react'; 

// --- 1. Navigation Data Structure ---

// Define the complex content for the "Products" mega-menu
const megaMenuData = {
  // Products Column
  products: [
    { icon: LinkIcon, title: "URL Shortener", description: "Customize, share and track links", href: "/Products" },
    { icon: Grid, title: "QR Code Generator", description: "Dynamic solutions to fit every business need", href: "/Products"},
    { icon: Package, title: "2D Barcodes", description: "Add a GS1 Digital Link to QR Codes designed for packaging", href: "/Products" },
    { icon: BarChart2, title: "Analytics", description: "A central place to track and analyze performance", href: "/produ" },
    { icon: FileText, title: "Pages", description: "Mobile-friendly, no-code landing pages", href: "/Products" },
  ],
  // Features Column
  features: [
    { icon: FileText, title: "Link-in-bio", description: "Curate and track links and content for social media profiles", href: "/Products" },
    { icon: Tag, title: "Branded Links", description: "Customize links with your brand's URL", href: "/Products" },
    { icon: Smartphone, title: "Mobile Links", description: "Short links for SMS messages", href: "/Products" },
    { icon: MapPin, title: "UTM Campaigns", description: "Track links and QR Codes with UTM parameters", href: "" },
  ],
  // Sidebar Column
  sidebar: [
    { title: "Integrations", items: [{ name: "Daplink Analyter" }, { name: "Daplink + Canva Integration" }] },
    { title: "Discover More", items: [ { name: "API & Documentation", href: "/docs" }, { name: "Trust Center", href: "/Products" }] }
  ]
};

// Define the main navigation items, indicating which ones are simple and which are mega-menus
const navItems = [
  { label: "Products", type: "mega", slug: "products" },
  { label: "Templates", type: "simple", href: "/Templates" },
  { label: "About", type: "simple", href: "/About" },
  { label: "Blog", type: "simple", href: "/Blog" }, 
  { label: "Pricing", type: "simple", href: "/Pricing" },
];


// --- 2. Mega Menu Dropdown Component (Desktop Only) ---

const MegaMenuDropdown = ({ data, closeMenu }) => (
  
  <div 
    className="absolute left-0 top-full w-full bg-white border-t border-gray-200 shadow-xl 
               pt-8 pb-10 z-30 transition-all duration-200"
  >
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-10">
      
      {/* Column 1 & 2: Products & Features */}
      <div className="col-span-8 grid grid-cols-2 gap-x-10 gap-y-6 border-r border-gray-100 pr-10">
        
        {/* Products Section */}
        <div className="col-span-1">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">PRODUCTS</h3>
          <div className="space-y-4">
            {data.products.map((item) => (
              <Link key={item.title} href={item.href} onClick={closeMenu} className="flex items-start group p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                <item.icon size={20} className="text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="col-span-1">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">FEATURES</h3>
          <div className="space-y-4">
            {data.features.map((item) => (
              <Link key={item.title} href={item.href} onClick={closeMenu} className="flex items-start group p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                <item.icon size={20} className="text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Column 3: Integrations & Discover More */}
      <div className="col-span-4 space-y-8">
        
        {/* Integrations */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">INTEGRATIONS</h3>
          <div className="grid grid-cols-2 gap-4">
            {data.sidebar[0].items.map((item) => (
              <div key={item.name} className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-indigo-400 transition cursor-pointer">
                {/* Placeholder for integration logo/icon */}
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-1">
                  <Zap size={20} className="text-indigo-600" />
                </div>
                <p className="text-xs font-medium text-gray-700 text-center">{item.name}</p>
              </div>
            ))}
          </div>
          <Link href="/integrations" onClick={closeMenu} className="text-sm font-semibold text-indigo-600 mt-4 block hover:text-indigo-800 transition">
            See all integrations →
          </Link>
        </div>

        {/* Discover More */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">DISCOVER MORE</h3>
          <div className="space-y-2">
            {data.sidebar[1].items.map((item) => (
              <Link key={item.name} href={item.href} onClick={closeMenu} className="block text-sm font-semibold text-gray-700 hover:text-indigo-600 transition">
                {item.name} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);


// --- 3. Main Navbar Component ---

const Navbar = () => {
  // State for mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State for desktop mega-menu visibility (tracks the slug of the open menu)
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveMegaMenu(null);
  }

  // Helper function to handle mouse leave from the entire navigation area
  const handleMouseLeave = () => {
    setActiveMegaMenu(null);
  };

  return (
    // Use onMouseLeave on the entire nav to close the dropdown when leaving the header area
    <nav 
      className="bg-white/80 backdrop-blur-2sm border- border-gray-200 shadow-sm fixed top-0 left-0 w-full z-50"
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-2 relative">
        
        {/* Logo and Brand */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2 text-xl font-semibold text-gray-900 hover:opacity-75 transition z-50">
          <span className="text-2xl">
            <Image src="/innovate.png" alt="DapLink Logo" width={32} height={32} />
          </span>
          <span className="font-medium tracking-tight">DapLink</span>
        </Link>
        
        {/* Center Navigation Links (Desktop) */}
        <ul className="hidden md:flex flex-grow justify-center gap-8 text-sm font-medium text-gray-700">
          {navItems.map(item => (
            <li 
              key={item.label} 
              className="relative"
              // Open mega menu on hover for "mega" type items
              onMouseEnter={() => item.type === 'mega' && setActiveMegaMenu(item.slug)}
            >
              {item.type === 'simple' ? (
                // Simple Link
                <Link href={item.href} className="cursor-pointer hover:text-indigo-600 transition py-4 block">
                  {item.label}
                </Link>
              ) : (
                // Mega Menu Trigger
                <div className="flex items-center cursor-pointer hover:text-indigo-600 transition py-4">
                  {item.label}
                  {activeMegaMenu === item.slug ? 
                    <ChevronUp size={14} className="ml-1 text-indigo-600" /> : 
                    <ChevronDown size={14} className="ml-1" />
                  }
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Conditional Mega Menu Dropdown */}
        {activeMegaMenu === 'products' && (
          <MegaMenuDropdown data={megaMenuData} closeMenu={closeMenu} />
        )}
        
        {/* User Auth/CTA Section (Desktop) */}
        <div className="hidden md:flex gap-2 items-center">
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">
            Log in
          </Link>
          <Link
            href="/Generate"
            className="bg-black text-white font-semibold rounded-full px-5 py-2 text-sm shadow hover:bg-gray-700 transition-all focus:outline-none"
          >
            Create
          </Link>
        </div>

        {/* Mobile Menu Toggler */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition z-50"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown (Full Screen Overlay) */}
      <div
        className={`fixed inset-0 bg-white md:hidden transition-transform duration-300 ease-in-out z-40
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="px-6 pt-16 pb-8 h-full flex flex-col justify-between">
          
          {/* Menu Links */}
          <ul className="flex flex-col gap-6 text-xl font-medium text-gray-900 mt-4">
            {/* Note: In mobile view, we treat the main nav items as simple links */}
            {navItems.map(item => (
              <li key={item.label}>
                <Link 
                  href={item.href || (item.type === 'mega' ? item.href || '/' : item.href)} 
                  onClick={closeMenu}
                  className="block py-2 hover:text-indigo-600 transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Bottom Section (Log in & Create Buttons) */}
          <div className="flex flex-col gap-4">
            <Link
              href="/login"
              onClick={closeMenu}
              className="w-full text-center text-lg font-medium text-gray-700 hover:text-gray-900 transition py-2"
            >
              Log in
            </Link>
            <Link
              href="/Generate"
              onClick={closeMenu}
              className="w-full text-center bg-black text-white font-semibold rounded-lg px-5 py-3 text-lg shadow-lg hover:bg-gray-700 transition-all"
            >
              Create
            </Link>
            
            {/* Decorative Footer */}
            <div className="mt-8 text-center">
                <p className="text-xs text-indigo-600 font-semibold mb-2">
                    #️⃣ Next-gen link-in-bio platform
                </p>
                <h2 className="text-3xl font-extrabold leading-tight text-gray-900">
                    <span className="text-indigo-600">One Link To</span><br />
                    Rule Them All
                </h2>
            </div>
          </div>
        </div>
      </div>
      
    </nav>
  );
}

export default Navbar;