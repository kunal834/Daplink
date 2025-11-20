"use client"
import Image from 'next/image'
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Section, SectionIcon } from 'lucide-react';

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
    const [Mindset, setMindset] = useState("");
  // ... inside the Generate component ...
const [skilloffered, setskillsoffered] = useState(["Web Design", "React Development", "UI/UX"]);
const [skillsseek, setskillsseek] = useState(["Backend Development", "Mobile Apps", "DevOps"]);
const [newSkillOffered, setNewSkillOffered] = useState(''); // New input state
const [newSkillSeek, setNewSkillSeek] = useState(''); // New input state
// ...


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
            "script": script,
            "mindset" : Mindset,
            "skillsoff" : skilloffered,
            "skillsseek": skillsseek
            
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
    
 // ... inside the Generate component ...

const Mindsettab = () => (
    <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Mindset Wall</h2>
        <p className="text-sm text-gray-500 mb-4">Share your vision, values, and what drives you</p>
        
        {/* Input area for the Mindset text */}
        <textarea
            value={Mindset || ""}
            onChange={e => setMindset(e.target.value)}
            rows="4" // Use textarea for multi-line input
            placeholder="Always learning, always growing. Building products that make a difference."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-indigo-500 focus:border-indigo-500"
        />
    </section>
);

// ... inside the Generate component ...

// Helper function to add a skill
const addSkill = (skill, setState, newStateValue, setNewStateValue) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !newStateValue.includes(trimmedSkill)) {
        setState([...newStateValue, trimmedSkill]);
        setNewStateValue('');
    }
};

// Helper function to remove a skill
const removeSkill = (index, setState, currentStateValue) => {
    setState(currentStateValue.filter((_, i) => i !== index));
};

const Skillstab = () => (
    <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold mb-6 text-gray-800">Skill Exchange</h2>

        <div className="space-y-8">
            {/* --- Skills I'm Offering Section --- */}
            <div>
                <label className="text-base font-medium text-gray-700 block mb-3">
                    Skills I'm Offering
                </label>
                
                {/* Current Skills Chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {skilloffered.map((skill, index) => (
                        <span key={`off-${index}`} className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full cursor-pointer"
                              onClick={() => removeSkill(index, setskillsoffered, skilloffered)}>
                            <span>{skill}</span>
                            <span className="text-xs font-bold">×</span>
                        </span>
                    ))}
                </div>

                {/* Add Skill Input */}
                <div className="flex items-center space-x-2">
                    <input
                        value={newSkillOffered}
                        onChange={e => setNewSkillOffered(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addSkill(newSkillOffered, setskillsoffered, skilloffered, setNewSkillOffered);
                            }
                        }}
                        type="text"
                        className='flex-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='Add a skill...'
                    />
                    <button
                        onClick={() => addSkill(newSkillOffered, setskillsoffered, skilloffered, setNewSkillOffered)}
                        className='bg-black text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition'
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* --- Skills I'm Seeking Section --- */}
            <div>
                <label className="text-base font-medium text-gray-700 block mb-3">
                    Skills I'm Seeking
                </label>
                
                {/* Current Skills Chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {skillsseek.map((skill, index) => (
                        <span key={`seek-${index}`} className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full cursor-pointer"
                              onClick={() => removeSkill(index, setskillsseek, skillsseek)}>
                            <span>{skill}</span>
                            <span className="text-xs font-bold">×</span>
                        </span>
                    ))}
                </div>

                {/* Add Skill Input */}
                <div className="flex items-center space-x-2">
                    <input
                        value={newSkillSeek}
                        onChange={e => setNewSkillSeek(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addSkill(newSkillSeek, setskillsseek, skillsseek, setNewSkillSeek);
                            }
                        }}
                        type="text"
                        className='flex-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='Add a skill...'
                    />
                    <button
                        onClick={() => addSkill(newSkillSeek, setskillsseek, skillsseek, setNewSkillSeek)}
                        className='bg-black text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition'
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    </section>
);


    // --- MAIN RENDER ---
    return (
      <>
      <Navbar/>
         <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <ToastContainer />
            
            {/* Header */}
            <header className="max-w-4xl mx-auto text-center mb-10">
                <div className='flex items-center justify-center'>
                    <h1 className='text-3xl mt-16 font-extrabold text-gray-900'>Create Your DapLink</h1>
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
                    <button   onClick={() => setActiveTab("Mindset")}   className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === "Mindset" ? 'text-indigo-700 bg-indigo-50 shadow' : 'text-gray-600 hover:text-gray-900'}`}>
                        <span>Mindset</span>
                    </button>
                   <button   onClick={() => setActiveTab("skilloffered")}   className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === "skilloffered" ? 'text-indigo-700 bg-indigo-50 shadow' : 'text-gray-600 hover:text-gray-900'}`}>
                        <span>skills</span>
                    </button>
                </div>
            </div>

            {/* --- Main Content Area: Editor (Left) and Live Preview (Right) --- */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left Column: Editor Sections (2/3 width) */}
                <div className="md:col-span-2 space-y-6">
                    {activeTab === "Profile" && <ProfileTab />}
                    {activeTab === "Links" && <LinksTab />}
                    {activeTab === "Mindset" && <Mindsettab />}
                    {activeTab ===  "skilloffered" && <Skillstab/>}
                    
                    
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
                        <div className="w-full h-20 bg-gradient-to-r from-[#FBFEF9] to-[#044B7F] rounded-t-xl"></div>
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
                           <div className="w-11/12 mx-auto mt-6 bg-gray-50 rounded-lg shadow-sm p-4 border  border-l-4 border-[#639FAB]">
    <p className="text-gray-700 text-sm italic leading-relaxed">
        {Mindset || "Always learning, always growing. Building products that make a difference."}
    </p>
</div>  




{(skilloffered.length > 0 || skillsseek.length > 0) && (
    <div className="w-11/12 mx-auto mt-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Skills & Seeking</h3>
        
     
        {skilloffered.length > 0 && (
            <div className="mb-3">
                <p className="text-xs font-medium text-green-600 mb-1">Skills Offered:</p>
                <div className="flex flex-wrap gap-1">
                    {skilloffered.map((skill, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs bg-green-50 text-green-600 rounded-full border border-green-200">
                            {skill.trim()}
                        </span>
                    ))}
                </div>
            </div>
        )}

       
        {skillsseek.length > 0 && (
            <div>
                <p className="text-xs font-medium text-blue-600 mb-1">Seeking Collaboration:</p>
                <div className="flex flex-wrap gap-1">
                    {skillsseek.map((skill, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full border border-blue-200">
                            {skill.trim()}
                        </span>
                    ))}
                </div>
            </div>
        )}
    </div>
)}
// ...
      
                            <p className="text-xs text-gray-400 mt-10">Live Preview will show your data.</p>

                            
                        </div>

                        
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-2">
                        {`Live Preview - Changes appear in real time`}
                    </p>
                </div> 
            </div>
        </div>

        <Footer/>
      </>
     
    )
}

export default Generate