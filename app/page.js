"use client"
import Navbar from "@/Components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
  import { ToastContainer, toast } from 'react-toastify';
  import { useRouter } from "next/navigation";
  import Footer from "@/Components/Footer";


export default function Home() {
  const router = useRouter()
   const createdaplink  = () => {
    router.push(`/Generate?handle=${text}`)
   }
   
    // const notify = () => toast("Daplink created");
const [text, settext] = useState("")
  return (
    <>
  
    <main className=" md:w-full  w-[106vw] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
       <Navbar/>
  {/* grid grid-cols-2 */}
  {/* bg-[#254f1a] */}
      <section className=" bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500  min-h-[100vh] flex md:mt-0 mt-16 flex-col md:flex-row  ">
        <div className="flex flex-col ml-[10vw] justify-center  gap-4 ">
         <p className="text-black font-extrabold text-6xl"> One  Link </p>
         <p className="text-red-800 font-extrabold text-6xl">  Infinite, </p> 
        <p className="text-lime-600 font-extrabold text-6xl">Possibilities.</p> 
         <p className="text-xl  mt-4 text-black font-bold w-3/4 my-4 "> Join millions of  people using Daplink for their link in bio. One link to help you share everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube and other 
          social media profiles.</p>  
          <div className="button flex mt-4 gap-4 ">
     <input value={text}  onChange={(e) => settext(e.target.value)}className='bg-white p-2 rounded-xl focus:outline-green-800  shadow-2xl z-10'type="text" placeholder="Enter your handle"/> 
          

          <button onClick={() => createdaplink()} className="bg-lime-400 rounded-full p-2 px-4 text-xs font-bold cursor-pointer shadow-xl z-10"> claim your Daplink</button>

          </div>
        </div>
        {/* flex-col */}
        {/* <div className="flex items-center justify-center mr-[10vw] md:ml-0  ml-15"> 
         <img src="/home.png" alt="" />
        </div> */}
        <div className="flex items-center md:w-215  mb-4 md:mb-0 w-65  md:mt-16 mt-14 justify-center mr-[10vw] md:ml-0   ml-20"> 
         <img className="rounded-xl" src="/dog.jpg" alt="" />
        </div>
      </section>
      {/* <section className="bg-pink-200 min-h-[100vh]">
  
      </section> */}
    </main>
<Footer/>
    </>
  );
}
