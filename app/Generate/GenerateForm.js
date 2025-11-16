// "use client"
// import Image from 'next/image'
// import Link from 'next/link';
// import { ToastContainer, toast } from 'react-toastify';  
// import { useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/navigation';

// // import { set } from 'mongoose';

// // export const metadata = {
// //   title: "Daplink-Signup to connect ",
// //   description: "Signup to connect",
// // };



// const Generate = () => {
//    // const [link, setlink] = useState("")
//    // const [linktext, setlinktext] = useState("")
//    const SearchParams = useSearchParams()
//    const [links, setlinks] = useState([{ link: "", linktext: "" }])
//    const [handle, sethandle] = useState(SearchParams.get('handle'))
//    const [profile, setprofile] = useState("")
//    const [script, setscript] = useState("")
//    const router = useRouter()
//    const addlink = () => {
//       setlinks(links.concat([{ link: "", linktext: "" }]))
//    }

//    const handlechange = (index, link, linktext) => {
//       setlinks((initiallink) => {
//          return initiallink.map((item, i) => {
//             if (i == index) {
//                return { link, linktext }
//             } else {
//                return item
//             }
//          })
//       })
//    }
   

//    const submitlink = async () => {
//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");

//       const raw = JSON.stringify({
//          "links": links,
//          "handle": handle,
//          "profile": profile,
//          "script": script
//       });
//       console.log(raw)

//       const requestOptions = {
//          method: "POST",
//          headers: myHeaders,
//          body: raw,
//          redirect: "follow"
//       };

//       const r = await fetch("./api/add", requestOptions)
   

//       const result = await r.json();
//       if (result.success) {
//          toast.success(result.message)
       
//          sethandle("")
//          setprofile("")
//          router.push(`/${handle}`);

//       } else {
//          toast.error(result.message)
//       }





//    }



//    return (
//       <>

//          <div className='flex '>

//             <div className='w-full  bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500   md:w-1/2'  >

//                <h1 className='font-bold flex gap-2 md:text-4xl items-center text-4xl mt-6 ml-6 justify-center  '> <Image className="md:w-14 md:h-14" src="/innovate.png" alt="" width={44} height={44} />
//                   DapLink </h1>
//                <div className='flex justify-center mt-8'>
//                   <h1 className='text-4xl font-extrabold text-[#575555]'> Create your daplink</h1>


//                </div>
//                <div className='flex justify-center mt-8'>
//                   <img className="w-45" src="/fun.png" alt="" />

//                </div>

//                <div className='mt-8'>
//                   <h2 className='text-center font-bold text-2xl text-black'>Step1: Claim your Handle</h2>
//                   <div className="flex justify-center  mt-4">
                 
//                      <input value={handle || ""} onChange={e => { sethandle(e.target.value) }} type="text" className=' md:ml-0 md:mr-0  ml-6 mr-4  w-full max-w-md 
//     bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
//     text-gray-900 dark:text-gray-100 
//     border border-gray-300 dark:border-gray-700 
//     rounded-xl px-5 py-3 
//     shadow-lg shadow-gray-300/20 dark:shadow-black/40 
//     placeholder-gray-400 font-semibold tracking-wide 
//     focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-600 
//     transition duration-300 ease-in-out 
//     caret-indigo-700
//     focus:scale-105 focus:shadow-indigo-500/50
//   "' placeholder='Choose a Handle ' />

//                   </div>
//                </div>
//                <div className='mt-8 md:h-[10vw] h-[45vw] overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>


//                   <h2 className='text-center font-bold text-2xl text-black '>Step2: Add Links Build Bio</h2>

//                   {links && links.map((item, index) => {
//                      return <div key={index} className="flex justify-center mt-4 gap-2 md:flex-row md:gap-4 ">
//                         <input value={item.link || ""} onChange={e => handlechange(index, e.target.value, item.linktext)} type="text" className=' p-2 px-4 rounded-full  w-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
//     text-gray-900 dark:text-gray-100 
//     border border-gray-300 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500 focus:border-indigo-600 
//     transition duration-300 ease-in-out 
//     caret-indigo-700
//     focus:scale-105 focus:shadow-indigo-500/50' placeholder='Enter Link' />
//                         <input value={item.linktext || ""} onChange={e => handlechange(index, item.link, e.target.value)} type="text" className='  p-1 px-2 md:px-4 md:p-2 rounded-full  w-40 ml-6   bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
//     text-gray-900 dark:text-gray-100 
//     border border-gray-300 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500 focus:border-indigo-600 
//     transition duration-300 ease-in-out 
//     caret-indigo-700
//     focus:scale-105 focus:shadow-indigo-500/50' placeholder='Enter link text' />

//                         <button onClick={() => addlink()} className='bg-[#37067D] p-2 px-4 rounded-full text-white font-bold cursor-pointer hidden md:block'> + Add Link</button>
//                      </div>
//                   })}
//                   <div className='flex justify-center md:hidden'>
//                      <button onClick={() => addlink()} className='bg-[#37067D] p-2 px-4  mt-4 rounded-full text-white font-bold cursor-pointer  md:hidden'> +Add Link</button>


//                   </div>
//                </div>
//                <div className='mt-8'>
//                   <h2 className='text-center font-bold text-2xl text-black'>Step3: Add Picture , Description and Finalize</h2>
//                   <div className="flex justify-center  mt-4">
                     
//                      <input
//                         value={profile || ""}
//                         onChange={e => setprofile(e.target.value)}
//                         type="text"
//                         placeholder="Enter Link to your Picture"
//                         className="
//     w-full max-w-md 
//     md:ml-0 md:mr-0  ml-6 mr-4 
//     bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
//     text-gray-900 dark:text-gray-100 
//     border border-gray-300 dark:border-gray-700 
//     rounded-xl px-5 py-3 
//     shadow-lg shadow-gray-300/20 dark:shadow-black/40 
//     placeholder-gray-400 font-semibold tracking-wide 
//     focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-600 
//     transition duration-300 ease-in-out 
//     caret-indigo-700
//     focus:scale-105 focus:shadow-indigo-500/50
//   "
//                      />

//                   </div>
//                   <div className=' flex mt-8 justify-center '>

//                      <textarea value={script || ""} onChange={e => { setscript(e.target.value) }} type="text" className='w-full max-w-md
//         md:ml-0 md:mr-0  ml-6 mr-4  
//     bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
//     text-gray-900 dark:text-gray-100 
//     border border-gray-300 dark:border-gray-700 
//     rounded-xl px-5 py-3 
//     shadow-lg shadow-gray-300/20 dark:shadow-black/40 
//     placeholder-gray-400 font-semibold tracking-wide 
//     focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-600 
//     transition duration-300 ease-in-out 
//     caret-indigo-700
//     focus:scale-105 focus:shadow-indigo-500/50
//   "' placeholder='write about yourself ' />
//                   </div>

//                   <div className='flex justify-center mt-8 '>



//                      <button disabled={ handle == "" || links.linktext == ""} onClick={() => { submitlink() }} className='bg-black p-2 px-4 rounded-full text-white font-bold cursor-pointer'> Create Daplink</button>


//                   </div>
//                </div>

         

//             </div>
//             <div className=' md:w-1/2 h-full  '>

//                <img className='w-full h-full none hidden md:block' src="/half.jpg" alt="" />
//                <ToastContainer />
//             </div>


//          </div>



//       </>
//    )
// }

// export default Generate





"use client"
import Image from 'next/image'
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

// --- Placeholder Icon Components (for the design) ---
const IconUser = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const IconLinks = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.743L19 5.571 13.828.4l-.857.857-4.113 4.113.857.857 4.113-4.113.857.857-4.113 4.113zM10.172 13.257L5 18.429l5.172 5.171.857-.857 4.113-4.113-.857-.857-4.113 4.113-.857-.857 4.113-4.113z" /></svg>;
const IconTrash = () => <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconDrag = () => <svg className="w-5 h-5 text-gray-400 cursor-move" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>;
 const IconPortfolio = () => <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h5m-5 0v-2a1 1 0 011-1h2a1 1 0 011 1v2m-3 0h3" /></svg>;


const Generate = () => {
    const SearchParams = useSearchParams()
    const router = useRouter()
    
    // --- State Management ---
    const [links, setlinks] = useState([{ link: "https://example.com/portfolio", linktext: "Portfolio" }, { link: "https://github.com/username", linktext: "GitHub" }, { link: "https://twitter.com/username", linktext: "Twitter" }])
    const [handle, sethandle] = useState(SearchParams.get('handle') || "")
    const [profile, setprofile] = useState("")
    const [script, setscript] = useState("")
    const [activeTab, setActiveTab] = useState("Profile"); // New state for tabs

    // --- Link Handlers ---
    const addlink = () => {
        setlinks(links.concat([{ link: "", linktext: "" }]))
    }

    // New handler to remove a link item
    const removeLink = (indexToRemove) => {
        setlinks(links.filter((_, index) => index !== indexToRemove));
    };

    const handlechange = (index, link, linktext) => {
        setlinks((initiallink) => {
            return initiallink.map((item, i) => {
                if (i === index) {
                    return { link, linktext }
                } else {
                    return item
                }
            })
        })
    }
    // --- End Link Handlers ---
    
    // --- Submission Logic (Unchanged) ---
    const submitlink = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "links": links.filter(l => l.link && l.linktext), // Filter out empty links before submission
            "handle": handle,
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

        const r = await fetch("./api/add", requestOptions)
        const result = await r.json();

        if (result.success) {
            toast.success(result.message)
            sethandle("")
            setprofile("")
            router.push(`/${handle}`);
        } else {
            toast.error(result.message)
        }
    }
    // --- End Submission Logic ---

    // Simplified disabled logic for the "Save Changes" button
    const isDisabled = handle === "" || links.every(l => l.link === "" && l.linktext === "");
    
    // --- RENDERING FUNCTIONS FOR TABS ---

    const ProfileTab = () => (
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Profile Information</h2>
            <div className="space-y-6">

                {/* Picture Link */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Picture URL</label>
                    <input
                        value={profile || ""}
                        onChange={e => setprofile(e.target.value)}
                        type="url"
                        placeholder="Enter Link to your Picture"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Handle Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Handle</label>
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100">{`daplink.com/`}</span>
                        <input
                            value={handle || ""}
                            onChange={e => { sethandle(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')) }}
                            type="text"
                            className="flex-1 p-3 focus:outline-none"
                            placeholder='Choose a Handle'
                        />
                    </div>
                </div>

                {/* Description/Bio */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{`Bio / Description`}</label>
                    <textarea
                        value={script || ""}
                        onChange={e => { setscript(e.target.value) }}
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder='Write about yourself (e.g., Designer & Developer | Building cool stuff)'
                    />
                </div>
            </div>
        </section>
    );

    const LinksTab = () => (
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Manage Links</h2>
                <button
                    onClick={addlink}
                    className="flex items-center space-x-1 bg-black hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition duration-150"
                >
                    <span className="text-lg leading-none">+</span>
                    <span>Add Link</span>
                </button>
            </div>

            {/* Link Items Container */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {links.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                             {/* Link Text/Name Input */}
                             <div className="flex items-center space-x-3 w-full">
                                <IconPortfolio /> {/* Placeholder icon */}
                                <input
                                    value={item.linktext || ""}
                                    onChange={e => handlechange(index, item.link, e.target.value)}
                                    type="text"
                                    className='flex-1 p-1 text-base font-medium bg-transparent focus:outline-none placeholder:text-gray-900'
                                    placeholder='Portfolio'
                                />
                            </div>
                            
                            {/* Delete Button */}
                            <button onClick={() => removeLink(index)} className="p-1">
                                <IconTrash />
                            </button>
                        </div>
                        
                        {/* Link URL Input */}
                        <input
                            value={item.link || ""}
                            onChange={e => handlechange(index, e.target.value, item.linktext)}
                            type="url"
                            className='w-full p-1 text-sm text-gray-600 bg-transparent focus:outline-none'
                            placeholder='https://example.com/portfolio'
                        />
                    </div>
                ))}
            </div>
            {links.length === 0 && (
                <p className="text-center text-gray-500 pt-4"> {`Click "Add Link" to start building your page.`}</p>
            )}
        </section>
    );
    
    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <ToastContainer />
            
            {/* Header */}
            <header className="max-w-4xl mx-auto text-center mb-10">
                <div className='flex items-center justify-center'>
                    <h1 className='text-3xl font-extrabold text-gray-900'>Create Your DapLink</h1>
                </div>
                <p className='text-gray-600 mt-2'> {`Build and customize your personal link-in-bio page`} </p>
            </header>

            {/* --- Navigation Tabs --- */}
            <div className="flex justify-center mb-8">
                <div className="flex space-x-2 p-2 bg-white rounded-xl shadow-lg border border-gray-200">
                    {/* Profile Tab */}
                    <button
                        onClick={() => setActiveTab("Profile")}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === "Profile" ? 'text-indigo-700 bg-indigo-50 shadow' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <IconUser />
                        <span>Profile</span>
                    </button>

                    {/* Links Tab */}
                    <button
                        onClick={() => setActiveTab("Links")}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === "Links" ? 'text-indigo-700 bg-indigo-50 shadow' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <IconLinks />
                        <span>Links</span>
                    </button>
                    {/* Placeholder for Mindset and Skills tabs */}
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-400 cursor-default">
                        <span>Mindset</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-400 cursor-default">
                        <span>Skills</span>
                    </button>
                </div>
            </div>

            {/* --- Main Content Area: Editor (Left) and Live Preview (Right) --- */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left Column: Editor Sections (2/3 width) */}
                <div className="md:col-span-2 space-y-6">
                    {activeTab === "Profile" && <ProfileTab />}
                    {activeTab === "Links" && <LinksTab />}
                    
                    {/* Save Changes Button & Preview Button */}
                    <div className="flex justify-between items-center mt-6 p-2">
                        <button
                            disabled={isDisabled}
                            onClick={submitlink}
                            className={`flex-grow bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-lg transition ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-600 hover:to-purple-700'}`}
                        >
                            Save Changes
                        </button>
                        <button className="text-sm text-indigo-600 font-medium ml-4 py-3">
                            Preview
                        </button>
                    </div>
                </div>

                {/* Right Column: Live Preview (1/3 width) */}
                <div className="md:col-span-1">
                    {/* Placeholder for the Live Preview Card */}
                    <div className="bg-white rounded-xl shadow-2xl relative overflow-hidden h-[600px] border border-gray-200">
                        <div className="w-full h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-xl"></div>
                        <div className="relative pt-12 p-4 text-center">
                            <img
                                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-white object-cover"
                                src={profile || "https://placehold.co/80x80?text=AJ"} // Use profile URL or placeholder
                                alt="Profile"
                            />
                            <h2 className="text-lg font-bold">{handle || "Name"}</h2>
                            <p className="text-sm text-gray-500 mb-6">{script || "Designer & Developer | Bio goes here"}</p>
                            
                            {/* Preview Links */}
                            <div className="space-y-3 mb-6">
                                {links.filter(l => l.link && l.linktext).map((linkItem, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-center p-3 bg-gray-100 rounded-lg text-gray-700 text-sm font-medium"
                                    >
                                        <span className="mr-2">🔗</span>
                                        <span>{linkItem.linktext}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-10">Live Preview will show your data.</p>
                        </div>
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-2">
                        {`Live Preview - Changes appear in real time`}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Generate