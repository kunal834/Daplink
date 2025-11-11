 "use client"
import Navbar from "@/Components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
  import { ToastContainer, toast } from 'react-toastify';
  import { useRouter } from "next/navigation";
  import Footer from "@/Components/Footer";
import FeatureShowcase from "@/Components/Fearureshowcase";
import Testimonial from "@/Components/Testimonial";





export default function Home() {
   
  const router = useRouter()
   const createdaplink  = () => {
    router.push(`/Generate?handle=${text}`)
   }
   
    // const notify = () => toast("Daplink created");
const [text, settext] = useState("")
  return (
    <>
  
    {/* <main className=" md:w-full  w-[106vw]  bg-white  ">
       <Navbar/>

      <section className=" bg-white min-h-[100vh] flex md:mt-0 mt-16 flex-col md:flex-row  ">
        <div className="flex flex-col ml-[10vw] justify-center  gap-4 ">
         <p className="text-black font-extrabold text-6xl"> One  Link </p>
         <p className="text-red-800 font-extrabold text-6xl">  To Rule </p> 
        <p className="text-lime-600 font-extrabold text-6xl">Them all.</p> 
         <p className="text-xl  mt-4 text-black font-bold w-3/4 my-4 "> Daplink is the next generation link-in-bio platform. Beyond connecting your social media and products, your Daplink page serves as your personal gateway to professional growth. Seamlessly link your audience to your portfolio, services, and future networking opportunities.</p>  
          <div className="button flex mt-4 gap-4 ">
     <input value={text}  onChange={(e) => settext(e.target.value)}className='bg-white p-2 rounded-xl focus:outline-green-800  shadow-2xl z-10'type="text" placeholder="Enter your handle"/> 
          

          <button onClick={() => createdaplink()} className="bg-lime-400 rounded-full p-2 px-4 text-xs font-bold cursor-pointer shadow-xl z-10"> claim your Daplink</button>

          </div>
        </div>
      
        <div className="flex items-center md:w-215  mb-4 md:mb-0 w-65  md:mt-16 mt-14 justify-center mr-[10vw] md:ml-0   ml-20"> 
         <img className="rounded-xl" src="/dog.jpg" alt="" />
        </div>
      </section>
      
       <div>
      

    
    </div>
    </main> */}



    <main className="bg-gradient-to-tr from-[#e5eaff] via-[#f1e3f3] to-[#fae6fe] w-full">
     <Navbar/>
  <div className="flex justify-start items-center pt-6 pl-[5vw]">

  </div>
  <section className="flex flex-col md:flex-row min-h-[100vh] bg-gradient-to-tr from-[#e5eaff] via-[#f1e3f3] to-[#fae6fe]">
    {/* Left Section */}
    <div className="flex flex-col justify-center ml-[10vw] gap-4 pt-8 md:pt-0">
      <h1 className="text-6xl font-extrabold">
        <span className="text-black">One Link To </span>
        <span className="text-blue-700">Rule </span>
        <span className="text-pink-600">Them </span>
        <span className="text-pink-600">All</span>
      </h1>
      <p className="text-lg mt-4 text-gray-800 font-semibold w-3/4 my-2">
       DapLink is more than just a link-in-bio tool. **It&apos;s** your digital identity hub where you can connect, grow, and showcase everything that matters in one powerful link.
      </p>
      <div className="flex mt-4 gap-4">
        <input
          value={text}
          onChange={(e) => settext(e.target.value)}
          className="bg-white p-3 rounded-xl focus:outline-none border border-gray-200 shadow-2xl"
          type="text"
          placeholder="Enter your handle"
        />
        <button onClick={() => createdaplink()} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 py-3 text-base font-semibold shadow-xl transition">
          Claim your DapLink
        </button>
      </div>
      <div className="flex gap-6 mt-4 text-gray-600 text-sm items-center">
        <span className="flex items-center gap-1"><span className="material-icons text-base">lock</span>Free forever</span>
        <span className="flex items-center gap-1"><span className="material-icons text-base">groups</span>Join 50k+ users</span>
      </div>
    </div>
    {/* Right Section */}
    <div className="flex items-center justify-center md:w-[40vw] w-full md:mt-0 mt-10 mr-[10vw]">
      <img src="/dog.jpg" alt="Dog" className="rounded-xl w-full object-cover max-h-[560px]" />
    </div>
  </section>
</main>
    <FeatureShowcase/>
  <Testimonial/>
<Footer/>
    </>
  );
}
