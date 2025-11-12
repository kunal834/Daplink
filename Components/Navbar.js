
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
          <Link href="/"  className="cursor-pointer hover:text-indigo-600 transition">Templates</Link>
          <Link href="/"  className="cursor-pointer hover:text-indigo-600 transition">Marketplace</Link>
          <Link href="/"  className="cursor-pointer hover:text-indigo-600 transition">Learn</Link>
          <Link href="/"  className="cursor-pointer hover:text-indigo-600 transition">Pricing</Link>
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


//  <nav className="md:fixed sticky top-10 right-[10vw] bg-[#ECF8F8] rounded-xl p-4 w-screen md:w-[80vw] shadow-xl z-50">
//       <div className="flex justify-between items-center md:gap-10 gap-4 max-w-full mx-auto">
//         {/* Logo */} 
//         <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:opacity-90 transition">
          
//             <Image src="/innovate.png" alt="DapLink Logo" width={32} height={32} />
//             DapLink
        
//         </Link>

//         {/* Navigation Links */}
//         <ul className="hidden md:flex gap-8 text-sm font-semibold text-gray-700">
//           <li className="hover:bg-slate-200 p-2 rounded-xl cursor-pointer transition">Products</li>
//           <li className="hover:bg-slate-200 p-2 rounded-xl cursor-pointer transition">Templates</li>
//           <li className="hover:bg-slate-200 p-2 rounded-xl cursor-pointer transition">Marketplace</li>
//           <li className="hover:bg-slate-200 p-2 rounded-xl cursor-pointer transition">Learn</li>
//           <li className="hover:bg-slate-200 p-2 rounded-xl cursor-pointer transition">Pricing</li>
//         </ul>

//         {/* Auth Buttons */}
//         <div className="flex gap-4 items-center">
//           {/* <button
//             type="button"
//             className="bg-[#8B2635] text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-gray-900 shadow-md transition"
//           >
//             Login
//           </button> */}
//           <Link href="/Generate"  className="bg-[#8B2635] text-white font-semibold rounded-full px-6 py-2 text-sm shadow-md hover:bg-gray-900 transition">
            
//               Create
            
//           </Link>
//         </div>
//       </div>
//     </nav>
  )
}

export default Navbar
