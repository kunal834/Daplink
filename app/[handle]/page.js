"use client"
import Navbar from "@/Components/Navbar";
// import clientPromise from "@/lib/mongodb";
import Modal from '/Components/Modal';
import { useEffect } from "react";
 import { useState } from "react";
 import Link from "next/link";

export default function  BlogPostPage({ params }) {
  //   const awaitedParams = await params;
  // const { handle } = awaitedParams;
  // // const { handle } = params;
  // const client = await clientPromise;
  // const db = client.db("Daplink");
  // const collection = db.collection("links");
  // const data = await collection.findOne({ handle });

 const [data, setData] = useState(null);

  useEffect(() => {   // use to fetch data 
    fetch(`/api/links/${params.handle}`)
      .then((res) => res.json())
      .then((json) => setData(json.result));
  }, [params.handle]);
  
const [modalOpen, setModalOpen] = useState(false);
  if (!data) {
    return (
      <>
        <Navbar />
        <p>User not found</p>
      </>
    );
  }
  

  return (
    <>
      <Navbar />



      <body className="bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 ">
      <div className="flex flex-col md:flex-row gap-5 items-center justify-center w-full md:h-screen h-[60vw] md:mt-16 mt-100  bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 p-6" >

  <div className="profile-card flex flex-col items-center bg-white max-w-[90%] w-[22rem]  rounded-2xl shadow-2xl p-8 transition-transform duration-300 hover:scale-105">
    
    {/* Profile Photo */}
    <div className="photo mb-6">
      <img
        className="rounded-full w-32 h-32 object-cover ring-4 ring-amber-200 shadow-md"
        src={data.profile}
        alt="Profile Photo"
      />
    </div>

    {/* Username */}
    <h1 className="text-gray-900 font-extrabold text-2xl mb-2 tracking-wide">
      @{data.handle}  
    </h1>

    {/* Description */}
    <p className="desc text-gray-600 text-center text-base leading-relaxed mb-6">
      {data.script}
    </p>

    {/* Links */}
    <div className="links flex flex-col w-full gap-3">
      {data.links.map((item, index) => (
        <a
          key={index}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-500 hover:to-blue-500 transition-all duration-300"
        >
          {item.linktext}
        </a>
      ))}
    </div>
    
  </div>

   <div className="explore">
   <div class="max-w-sm mx-auto bg-white rounded-lg shadow-md p-6 transition-transform duration-300 hover:scale-105">
 
  <p class="text-gray-700 text-base mb-6">
   Now you are become family of Daplink enjoy the opportunities 
   Benefits of Joining Daplink 
   
  </p>

 
  <div class="flex gap-4 ">
    <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white font-semibold py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-indigo-400">
      Explore Peoples
    </button>
   <button className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer text-white font-semibold py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-400" onClick={() => setModalOpen(true)}> Explore Jobs</button>
 
  </div>
</div>
 <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
       
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-lg text-center border border-gray-200">
        {/* Icon representing an error or lock (could be replaced by company/product SVG) */}
        <svg
          className="mx-auto mb-6 w-14 h-14 text-red-600 animate-pulse"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-8">
          To create and join opportunities, you need to join one of our plans.
        </p>

        <Link
          href="/pricing"
          className="inline-block rounded-md bg-blue-600 px-8 py-3 text-white font-semibold text-lg shadow-md hover:bg-blue-700 transition"
          aria-label="View our plans"
        >
          View Plans & Pricing
        </Link>
      </div>
    
      </Modal>
    





      <div className="max-w-md mx-auto my-4 p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl  transition-transform duration-300 hover:scale-105">
  <h2 className="text-2xl font-semibold text-gray-800 mb-2" >Skill Exchange Offer</h2>
  <p className="text-gray-600 mb-4">
    Discover personalized skill-sharing opportunities. Connect, exchange, and learn in our new dedicated section!
  </p>
  <button className="inline-block px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"  onClick={() => setModalOpen(true)} >Explore Offers</button>
    
</div>

 </div>
</div>

      </body>
    </>
  );
}

