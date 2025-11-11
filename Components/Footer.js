// import React from 'react'

// const Footer = () => {
//       const currentyear = new Date().getFullYear();
//   return (
//    <>
//    <footer className="bg-gray-900 text-gray-300 py-10 w-[106vw] md:w-full">
//   <div className="max-w-7xl mx-auto px-6 md:flex md:justify-between">
 
//     <div className="mb-6 md:mb-0">
//       <h2 className="text-2xl font-bold text-white mb-2">Daplink</h2>
//       <p className="max-w-xl text-gray-400">
//         designed to empower creators, entrepreneurs, and professionals with a sleek, customizable, and user-friendly platform to showcase their digital presence. Unlike traditional link aggregators, DapLink offers enhanced personalization options, seamless integration capabilities, and superior performance to help users build a compelling online bio that truly represents their unique brand and story. With DapLink, connecting all your important links and social profiles becomes effortless, stylish, and impactful—making it the essential tool for anyone looking to stand out in the digital world.
//       </p>
//     </div>

//     <div className="flex flex-wrap gap-12">
//       <div>
//         <h3 className="text-lg font-semibold mb-3">Product</h3>
//         <ul>
//           <li><a href="#" className="hover:text-white">Features</a></li>
//           <li><a href="#" className="hover:text-white">Pricing</a></li>
//           <li><a href="#" className="hover:text-white">Integrations</a></li>
//         </ul>
//       </div>
//       <div>
//         <h3 className="text-lg font-semibold mb-3">Company</h3>
//         <ul>
//           <li><a href="#" className="hover:text-white">About Us</a></li>
//           <li><a href="#" className="hover:text-white">Careers</a></li>
//           <li><a href="#" className="hover:text-white">Contact</a></li>
//         </ul>
//       </div>
//       <div>
//         <h3 className="text-lg font-semibold mb-3">Support</h3>
//         <ul>
//           <li><a href="#" className="hover:text-white">Help Center</a></li>
//           <li><a href="#" className="hover:text-white">Terms of Service</a></li>
//           <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
//         </ul>
//       </div>
//     </div>
//   </div>

  
//   <div className="max-w-7xl mx-auto px-6 mt-10 flex justify-center gap-8 text-gray-400">
//     <a href="https://github.com/kunal834" aria-label="Twitter" className="hover:text-white">
//    <svg
//   xmlns="http://www.w3.org/2000/svg"
//   role="img"
//   viewBox="0 0 24 24"
//   fill="currentColor"
//   className="w-6 h-6"
// >
//   <title>GitHub</title>
//   <path d="M12 0C5.37 0 0 5.372 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.613-4.042-1.613-.547-1.388-1.335-1.756-1.335-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.495.997.108-.775.418-1.304.762-1.604-2.665-.305-5.467-1.335-5.467-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.302 1.23a11.48 11.48 0 013.003-.404c1.02.005 2.045.137 3.003.404 2.288-1.553 3.292-1.23 3.292-1.23.654 1.65.242 2.874.12 3.176.77.84 1.234 1.91 1.234 3.22 0 4.61-2.807 5.62-5.48 5.92.43.37.823 1.1.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.697.825.577A12.003 12.003 0 0024 12c0-6.628-5.372-12-12-12z" />
// </svg>

//     </a>
//     <a href="https://www.linkedin.com/in/kunal-kumar-547a48313/" aria-label="LinkedIn" className="hover:text-white">
//       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/></svg>
//     </a>
//   </div>

//   <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
//     © {currentyear} Daplink. All rights reserved.
//   </div>
// </footer>

//    </>
//   )
// }

// export default Footer


import React from 'react';
import { LinkIcon } from '@heroicons/react/24/outline'; // Using LinkIcon for the logo
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
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                            </ul>
                        </div>

                        {/* Column 2: Resources */}
                        <div className="w-1/2 md:w-auto">
                            <h3 className="text-base font-semibold text-white mb-4">Resources</h3>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Learn</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Marketplace</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                            </ul>
                        </div>
                        
                        {/* Column 3: Legal */}
                        <div className="w-1/2 md:w-auto mt-6 md:mt-0">
                            <h3 className="text-base font-semibold text-white mb-4">Legal</h3>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
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