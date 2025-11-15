import React from 'react';
import { LinkIcon } from '@heroicons/react/24/outline'; // Using LinkIcon for the logo
import Link from 'next/link';
import Image from 'next/image';
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#12141d] text-gray-300 py-16 w-full">
            <div className="max-w-7xl mx-auto px-6">
                <div className="md:flex md:justify-between md:space-x-12">
                    
                    {/* Logo and concise description (Left Column) */}
                    <div className="mb-12 md:mb-0 md:w-1/3">
                        <div className="flex items-center text-white mb-4">
                            {/* Simplified Daplink Logo Icon */}
                            {/* <LinkIcon className="w-6 h-6 mr-2 text-indigo-400" aria-hidden="true" /> */}
                            <Image src="/innovate.png" alt="DapLink Logo" width={32} height={32}></Image>
                            <h2 className="text-2xl font-bold">Daplink</h2>
                        </div>
                        <p className="max-w-xs text-gray-400 text-sm">
                            Your all-in-one platform for personal branding and connection.
                        </p>
                    </div>

                    {/* Navigation Links (Right Columns) */}
                    <div className="flex flex-wrap md:flex-nowrap gap-12 md:gap-24 md:w-2/3">
                        
                        {/* Column 1: Product */}
                        <div className="w-1/2 md:w-auto">
                            <h3 className="text-base font-semibold text-white mb-4">Product</h3>
                            <ul className="space-y-3 flex flex-col text-sm">
                                <Link href="/Products" className="hover:text-white transition-colors">Features</Link>
                                 <Link href="/Templates" className="hover:text-white transition-colors">Templates</Link>
                                 <Link href="/Pricing" className="hover:text-white transition-colors">Pricing</Link>
                            </ul>
                        </div>

                        {/* Column 2: Resources */}
                        <div className="w-1/2 md:w-auto">
                            <h3 className="text-base font-semibold text-white mb-4">Resources</h3>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Learn</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Marketplace</a></li>
                                <Link href="/About" className="hover:text-white transition-colors"> About </Link >
                            </ul>
                        </div>
                        
                        {/* Column 3: Legal */}
                        <div className="w-1/2 md:w-auto mt-6 md:mt-0">
                            <h3 className="text-base font-semibold text-white mb-4">Legal</h3>
                            <ul className="space-y-3 text-sm">
                                <Link href="/Contact"  className="hover:text-white transition-colors">Contact</Link>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-16 pt-8 border-t border-gray-700/50 text-center text-gray-500 text-sm">
                    © {currentYear} Daplink. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;