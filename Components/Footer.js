'use client';
import React from 'react';
import { Link as LinkIcon, Twitter, Instagram, Youtube } from 'lucide-react';
import FooterColumn from './ui/FooterColumn';
import Image from 'next/image';
// 👇 Import the hook
import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
    // 👇 Access the global theme state directly
    const { theme } = useTheme();

    return (
        <footer className={`border-t pt-20 pb-10 transition-colors duration-500 relative z-20 ${
            theme === 'dark' ? 'border-gray-900 bg-black' : 'border-gray-100 bg-gray-50'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                                <Image height={40} width={40} src="/innovate.png" alt="DapLink Logo" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                DapLink
                            </span>
                        </div>
                        <p className={`text-sm mb-6 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            The ultimate link-in-bio tool for modern creators. Build, share, and grow.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className={`transition-colors p-2 rounded-lg ${
                                    theme === 'dark' 
                                    ? 'text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800' 
                                    : 'text-gray-500 hover:text-black bg-white hover:bg-gray-200'
                                }`}>
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {/* Note: We pass 'theme' down to FooterColumn so you don't have to change that file yet */}
                    <FooterColumn
                        theme={theme}
                        title="Product"
                        links={[
                            { name: 'Features', href: '/Products' },
                            { name: 'Templates', href: '/Templates' },
                            { name: 'Pricing', href: '/Pricing' }
                        ]}
                    />

                    <FooterColumn
                        theme={theme}
                        title="Resources"
                        links={[
                            { name: 'Blog', href: '/Blog' },
                            { name: 'Marketplace', href: '/Marketplace' },
                            { name: 'About', href: '/About' }
                        ]}
                    />

                    <FooterColumn
                        theme={theme}
                        title="Legal"
                        links={[
                            { name: 'Contact', href: '/Contact' },
                            { name: 'Privacy Policy', href: '#' }, // Added # to prevent error if clicked
                            { name: 'Terms of Service', href: '#' }
                        ]}
                    />
                </div>

                {/* Bottom Bar */}
                <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm ${
                    theme === 'dark' ? 'border-gray-900 text-gray-600' : 'border-gray-200 text-gray-500'
                }`}>
                    <div>&copy; {new Date().getFullYear()} DapLink. All rights reserved.</div>
                    <div className="flex gap-6">
                        <a href="/status" className="hover:text-gray-400">Status</a>
                        <a href="/sitemap" className="hover:text-gray-400">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}