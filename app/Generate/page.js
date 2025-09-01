"use client"
import Image from 'next/image'
import Link from 'next/link';
  import { ToastContainer, toast } from 'react-toastify';
  import { useState } from 'react';
  import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';  

// import { set } from 'mongoose';

// export const metadata = {
//   title: "Daplink-Signup to connect ",
//   description: "Signup to connect",
// };



const  Generate = () => {
   // const [link, setlink] = useState("")
   // const [linktext, setlinktext] = useState("")
  const SearchParams = useSearchParams()
   const [links, setlinks] = useState([{link: "" , linktext:""}])
   const [handle, sethandle] = useState(SearchParams.get('handle'))
   const [profile, setprofile] = useState("")
   const [script, setscript] = useState("")
   const router = useRouter()
   const addlink = () =>{
      setlinks(links.concat([{link:"",linktext:""}]))
   }

const handlechange= (index, link , linktext) =>{
      setlinks((initiallink)=>{
        return  initiallink.map((item,i)=>{
            if(i==index){
               return {link , linktext}
            }else{
               return item 
            }
         })
      })
   }
//  const notify = () => toast("Daplink Created! share your bio");

 const submitlink = async() => {
   const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "links": links,
  "handle": handle ,
   "profile": profile,
   "script": script
});
console.log(raw)

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

 const r = await fetch("http://localhost:3000/api/add", requestOptions)
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));

 const result = await r.json();
 if(result.success){
    toast.success(result.message)
   //  setlinks(links[] == "")
    sethandle("")
    setprofile("")
    router.push(`/${handle}`);

 }else{
   toast.error(result.message)
 }
  



   
 }

 
 
 return (
    <>

    <div className='flex '>
      
      <div className='w-full  bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500   md:w-1/2'  >

       <h1 className='font-bold flex gap-2 md:text-4xl items-center text-4xl mt-6 ml-6 justify-center  '> <Image className="md:w-14 md:h-14"src="/innovate.png" alt="" width={44} height={44}/> 
        DapLink </h1>
     <div className='flex justify-center mt-8'>
        <h1 className='text-4xl font-extrabold text-[#575555]'> Create your daplink</h1>
      

     </div>
 <div className='flex justify-center mt-8'>
     <img className="w-45"src="/fun.png" alt="" />

     </div>

     <div className='mt-8'>
        <h2 className='text-center font-bold text-2xl text-black'>Step1: Claim your Handle</h2>
        <div className="flex justify-center  mt-4">
        {/* <input value={handle || ""}onChange={e=>{sethandle(e.target.value)}}type="text" className='bg-gray-800 text-white p-2 px-4' placeholder='Choose a Handle '/> */}
        <input value={handle || ""}onChange={e=>{sethandle(e.target.value)}}type="text" className=' md:ml-0 md:mr-0  ml-6 mr-4  w-full max-w-md 
    bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
    text-gray-900 dark:text-gray-100 
    border border-gray-300 dark:border-gray-700 
    rounded-xl px-5 py-3 
    shadow-lg shadow-gray-300/20 dark:shadow-black/40 
    placeholder-gray-400 font-semibold tracking-wide 
    focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-600 
    transition duration-300 ease-in-out 
    caret-indigo-700
    focus:scale-105 focus:shadow-indigo-500/50
  "' placeholder='Choose a Handle '/>

        </div>
     </div>
     <div className='mt-8 md:h-[10vw] h-[45vw] overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
   

        <h2 className='text-center font-bold text-2xl text-black '>Step2: Add Links Build Bio</h2>
      
       {links && links.map((item, index) => {
          return <div key={index} className="flex justify-center mt-4 gap-2 md:flex-row md:gap-4 ">
          <input  value={item.link || ""}  onChange={e => handlechange(index, e.target.value, item.linktext)} type="text" className=' p-2 px-4 rounded-full  w-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
    text-gray-900 dark:text-gray-100 
    border border-gray-300 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500 focus:border-indigo-600 
    transition duration-300 ease-in-out 
    caret-indigo-700
    focus:scale-105 focus:shadow-indigo-500/50' placeholder='Enter Link'/>
          <input value={item.linktext || ""} onChange={e => handlechange(index, item.link, e.target.value)}type="text" className='  p-1 px-2 md:px-4 md:p-2 rounded-full  w-40 ml-6   bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
    text-gray-900 dark:text-gray-100 
    border border-gray-300 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500 focus:border-indigo-600 
    transition duration-300 ease-in-out 
    caret-indigo-700
    focus:scale-105 focus:shadow-indigo-500/50' placeholder='Enter link text'/>

        <button onClick={() => addlink()} className='bg-[#37067D] p-2 px-4 rounded-full text-white font-bold cursor-pointer hidden md:block'> + Add Link</button>
          </div>})} 
        <div className='flex justify-center md:hidden'>
        <button  onClick={() => addlink()}className='bg-[#37067D] p-2 px-4  mt-4 rounded-full text-white font-bold cursor-pointer  md:hidden'> +Add Link</button>


        </div>
     </div>
     <div className='mt-8'>
        <h2 className='text-center font-bold text-2xl text-black'>Step3: Add Picture , Description and Finalize</h2>
        <div className="flex justify-center  mt-4">
        {/* <input value={profile || ""} onChange={e=>{setprofile(e.target.value)}} type="text" className='bg-gray-800 text-white p-2 px-4 focus:outline-gray-400' placeholder='Enter Link to your Picture '/> */}
<input
  value={profile || ""}
  onChange={e => setprofile(e.target.value)}
  type="text"
  placeholder="Enter Link to your Picture"
  className="
    w-full max-w-md 
    md:ml-0 md:mr-0  ml-6 mr-4 
    bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
    text-gray-900 dark:text-gray-100 
    border border-gray-300 dark:border-gray-700 
    rounded-xl px-5 py-3 
    shadow-lg shadow-gray-300/20 dark:shadow-black/40 
    placeholder-gray-400 font-semibold tracking-wide 
    focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-600 
    transition duration-300 ease-in-out 
    caret-indigo-700
    focus:scale-105 focus:shadow-indigo-500/50
  "
/>
      
        </div> 
        <div className=' flex mt-8 justify-center '>

        <textarea value={script || ""} onChange={e=>{setscript(e.target.value)}} type="text" className='w-full max-w-md
        md:ml-0 md:mr-0  ml-6 mr-4  
    bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
    text-gray-900 dark:text-gray-100 
    border border-gray-300 dark:border-gray-700 
    rounded-xl px-5 py-3 
    shadow-lg shadow-gray-300/20 dark:shadow-black/40 
    placeholder-gray-400 font-semibold tracking-wide 
    focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-600 
    transition duration-300 ease-in-out 
    caret-indigo-700
    focus:scale-105 focus:shadow-indigo-500/50
  "' placeholder='write about yourself '/>
        </div>

        <div className='flex justify-center mt-8 '>

         
      
 <button disabled={profile == "" || handle =="" || links.linktext == ""}onClick={()=>{submitlink()}}className='bg-black p-2 px-4 rounded-full text-white font-bold cursor-pointer'> Create Daplink</button> 
 
  
        </div>
     </div>

     {/* <div className='flex justify-center mt-8'>
      <img src="/fun.png" alt="" /> 

     </div> */}

      </div>
      <div className=' md:w-1/2 h-full  '>   
      {/* <img className='w-full h-full none hidden md:block'src="/Sign.png" alt="" /> */}
      <img className='w-full h-full none hidden md:block'src="/half.jpg" alt="" />
             <ToastContainer />
      </div>


    </div>
 

    
    </>
  )
}

export default  Generate
