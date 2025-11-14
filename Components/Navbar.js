
import React from 'react'
import Image from 'next/image'
 import Link from 'next/link'


const Navbar = () => {
  return (
  <nav className="bg-white/80 backdrop-blur-2sm  border-b border-gray-200 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-2">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-gray-900 hover:opacity-75 transition">
          {/* Uncomment for real logo: */}
          {/* <Image src="/daplink-logo.svg" alt="DapLink Logo" width={32} height={32} /> */}
          <span className="text-2xl"> <Image src="/innovate.png" alt="DapLink Logo" width={32} height={32} /></span>
          <span className="font-medium tracking-tight">DapLink</span>
        </Link>
        {/* Center Navigation Links */}
        <ul className="hidden md:flex flex-grow justify-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/Products"  className="cursor-pointer hover:text-indigo-600 transition">Products</Link>
          <Link href="/Templates"  className="cursor-pointer hover:text-indigo-600 transition">Templates</Link>
          <Link href="/"  className="cursor-pointer hover:text-indigo-600 transition">Marketplace</Link>
          <Link href="/"  className="cursor-pointer hover:text-indigo-600 transition">Blog  </Link>
          <Link href="/Pricing"  className="cursor-pointer hover:text-indigo-600 transition">Pricing</Link>
        </ul>
        {/* User Auth/CTA Section */}
        <div className="flex gap-2 iLinkms-center">
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
      </div>
      
    </nav>

  )
}

export default Navbar
