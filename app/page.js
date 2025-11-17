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
import CallToActionSection from "@/Components/CalltoAction";





export default function Home() {
   
  const router = useRouter()
   const createdaplink  = () => {
    router.push(`/Generate?handle=${text}`)
   }
   
const [text, settext] = useState("")
  return (
    <>
  



    <main className="bg-gradient-to-tr from-[#e5eaff] via-[#f1e3f3] md:p-4 p-5 to-[#fae6fe] w-full">
     <Navbar/>
  <div className="flex justify-start items-center pt-6  md:pt-6 pl-[5vw]">

  </div>
  <section className="flex flex-col md:flex-row min-h-[100vh] bg-gradient-to-tr from-[#e5eaff] via-[#f1e3f3] to-[#fae6fe]">
    {/* Left Section */}
    <div className="flex flex-col justify-center ml-[2vw] md:ml-[10vw] gap-4 pt-8 md:pt-0">
      <h1 className="text-4xl md:text-6xl font-extrabold">
        <span className="text-black">One Link To </span>
        <span className="text-blue-700">Rule </span>
        <span className="text-pink-600">Them </span>
        <span className="text-pink-600">All</span>
      </h1>
      <p className="text-lg mt-4 text-gray-800 font-semibold w-3/4 my-2">
       DapLink is more than just a link-in-bio tool.It&apos;s your digital identity hub where you can connect, grow, and showcase everything that matters in one powerful link.
      </p>
      <div className="flex mt-4 gap-2 md:gap-4">
        <input
          value={text}
          onChange={(e) => settext(e.target.value)}
          className="bg-white p-2 md:p-3 rounded-xl focus:outline-none border border-gray-200 shadow-2xl "
          type="text"
          placeholder="Enter your handle"
        />
        <button onClick={() => createdaplink()} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-2 py-2 md:px-6  md:py-3  text-base font-semibold shadow-xl transition">
          Claim your DapLink
        </button>
      </div>
      <div className="flex gap-6 mt-4 text-gray-600 text-sm items-center">
        <span className="flex items-center gap-1"><span className="material-icons text-base">lock</span>Free forever</span>
        <span className="flex items-center gap-1"><span className="material-icons text-base">groups</span>Join 50k+ users</span>
      </div>
    </div>
    {/* Right Section */}
    <div className="flex items-center justify-center md:w-[40vw] w-full md:mt-0 mt-10 mr-[10vw] ] ">
      <img src="https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?fit=max&fm=jpg&ixid=MnwzNTY3MHwwfDF8YWxsfHx8fHx8fHx8MTY4MjE4NjE3OA&ixlib=rb-4.0.3&q=75&w=720&utm_medium=referral&utm_source=vocal.media" alt="Dog" className="rounded-xl w-full object-cover max-h-[560px]" />
    </div>
  </section>
</main>
    <FeatureShowcase/>
  <Testimonial/>
  <CallToActionSection/>
<Footer/>
    </>
  );
}
