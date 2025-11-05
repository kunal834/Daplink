
import React from 'react'
import Image from 'next/image'
 import Link from 'next/link'


const Navbar = () => {
  return (
//     <nav className=' md:fixed sticky  bg-[#ECF8F8] top-10 right-[10vw] rounded-xl p-4 px-1 w-screen md:w-[80vw] shadow-xl z-50'>
//       <div className="logo flex  justify-between md:gap-10 gap-4 ">
//       <Link href={"/"}> 
//        <h1 className='font-bold flex gap-2  items-center justify-center text-2xl'> <Image src="/innovate.png" alt="" width={32} height={32}/> 
//         DapLink </h1>
       
//        </Link>
        
//       <ul className='flex  gap-10 p-2 text-sm'>
//        <li className='hover:bg-slate-200 p-2  font-semibold rounded-xl hidden cursor-pointer md:block'>Products </li>
//        <li className='hover:bg-slate-200 p-2 font-semibold rounded-xl hidden cursor-pointer md:block'> Templates</li>
//        <li className='hover:bg-slate-200 p-2 font-semibold rounded-xl hidden cursor-pointer md:block'>Marketplace </li>
//        <li className='hover:bg-slate-200 p-2 font-semibold rounded-xl hidden cursor-pointer md:block'> Learn </li>
//        <li className='hover:bg-slate-200 p-2 font-semibold rounded-xl hidden cursor-pointer md:block'> Pricing </li>

//        {/* <img src="dapnav.png" className='mx-auto h-1/2 w-1/2 hidden  md:block' alt="" />
//          */}
//       </ul>


//       <div className='flex gap-5'>
//  <button className='bg-gray-200 md:px-4 md:py-3 px-2 py-4 font-bold text-xs hover:bg-gray-300 rounded-xl cursor-pointer shadow-xl z-4'> Login</button>
//       {/* <button className='bg-black font-semibold rounded-full text-white p-3 cursor-pointer'>  Sign up free  </button>  */}
       
//       {/* <Link href="/Generate"><button className='bg-black font-semibold  rounded-full text-white p-3 cursor-pointer'>  sign up free </button> </Link>  */}
//        <Link className='bg-black font-semibold rounded-full text-white md:p-3 p-1 py-2  cursor-pointer shadow-xl z-10' href='/Generate'> Sign up free</Link> 
      
//       </div>  
     
      
      



//       </div>

//     </nav>


 <nav className="md:fixed sticky top-10 right-[10vw] bg-[#ECF8F8] rounded-xl p-4 w-screen md:w-[80vw] shadow-xl z-50">
      <div className="flex justify-between items-center md:gap-10 gap-4 max-w-full mx-auto">
        {/* Logo */} 
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:opacity-90 transition">
          
            <Image src="/innovate.png" alt="DapLink Logo" width={32} height={32} />
            DapLink
        
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-8 text-sm font-semibold text-gray-700">
          <li className="hover:bg-slate-200 p-2 rounded-xl cursor-pointer transition">Products</li>
          <li className="hover:bg-slate-200 p-2 rounded-xl cursor-pointer transition">Templates</li>
          <li className="hover:bg-slate-200 p-2 rounded-xl cursor-pointer transition">Marketplace</li>
          <li className="hover:bg-slate-200 p-2 rounded-xl cursor-pointer transition">Learn</li>
          <li className="hover:bg-slate-200 p-2 rounded-xl cursor-pointer transition">Pricing</li>
        </ul>

        {/* Auth Buttons */}
        <div className="flex gap-4 items-center">
          {/* <button
            type="button"
            className="bg-[#8B2635] text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-gray-900 shadow-md transition"
          >
            Login
          </button> */}
          <Link href="/Generate"  className="bg-[#8B2635] text-white font-semibold rounded-full px-6 py-2 text-sm shadow-md hover:bg-gray-900 transition">
            
              Create
            
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
