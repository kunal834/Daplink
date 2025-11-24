"use client"
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import Profiletab from './Profiletab';
import LinksTab from './LinksTab';
import Mindsettab from './Mindsettab';
import Skillstab from './Skillstab';

// ... Icons ...
const IconUser = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const IconLinks = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.743L19 5.571 13.828.4l-.857.857-4.113 4.113.857.857 4.113-4.113.857.857-4.113 4.113zM10.172 13.257L5 18.429l5.172 5.171.857-.857 4.113-4.113-.857-.857-4.113 4.113-.857-.857 4.113-4.113z" /></svg>;

const Generate = () => {
    const SearchParams = useSearchParams()
    const router = useRouter()

    // --- State Management ---
    const [links, setlinks] = useState([{ link: "https://example.com/portfolio", linktext: "Portfolio" }, { link: "https://github.com/username", linktext: "GitHub" }, { link: "https://twitter.com/username", linktext: "Twitter" }])
    const [handle, sethandle] = useState(SearchParams.get('handle') || "")
    const [profile, setprofile] = useState("")
    const [script, setscript] = useState("")
    const [activeTab, setActiveTab] = useState("Profile");
    const [Mindset, setMindset] = useState("");
    const [skilloffered, setskillsoffered] = useState(["Web Design", "React Development", "UI/UX"]);
    const [skillsseek, setskillsseek] = useState(["Backend Development", "Mobile Apps", "DevOps"]);
    const [newSkillOffered, setNewSkillOffered] = useState('');
    const [newSkillSeek, setNewSkillSeek] = useState('');

    // --- Submission Logic ---
    const submitLink = async () => {
        try {
            // Avoid empty submissions
            const filteredLinks = links.filter(l => l.link && l.linktext);

            const payload = {
                links: filteredLinks,
                handle,
                profile,
                script,
                mindset: Mindset,
                skillsoff: skilloffered,
                skillsseek
            };

            console.log("Submitting:", payload);

            const response = await fetch("/api/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Network error: " + response.status);

            const result = await response.json();

            if (result.success) {
                toast.success(result.message);

                // Reset state BEFORE redirect
                sethandle("");
                setprofile("");

                router.push(`/${handle}`);
            } else {
                toast.error(result.message || "Something went wrong");
            }

        } catch (error) {
            console.error("Submit error:", error);
            toast.error(error.message || "Unexpected error");
        }
    };


    const isDisabled = handle === "" || links.every(l => l.link === "" && l.linktext === "");

    // ❌ I DELETED THE FLOATING BLOCKS HERE (Profiletab, LinksTab, Mindsettab, Skillstab)
    // They are now correctly placed inside the return statement below.

    // --- MAIN RENDER ---
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <ToastContainer />

                <header className="max-w-4xl mx-auto text-center mb-10">
                    <div className='flex items-center justify-center'>
                        <h1 className='text-3xl mt-16 font-extrabold text-gray-900'>Create Your DapLink</h1>
                    </div>
                    <p className='text-gray-600 mt-2'> {`Build and customize your personal link-in-bio page`} </p>
                </header>

                <div className="flex justify-center mb-8">
                    <div className="flex space-x-2 p-2 bg-white rounded-xl shadow-lg border border-gray-200">
                        <button onClick={() => setActiveTab("Profile")} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === "Profile" ? 'text-indigo-700 bg-indigo-50 shadow' : 'text-gray-600 hover:text-gray-900'}`}>
                            <IconUser /><span>Profile</span>
                        </button>
                        <button onClick={() => setActiveTab("Links")} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === "Links" ? 'text-indigo-700 bg-indigo-50 shadow' : 'text-gray-600 hover:text-gray-900'}`}>
                            <IconLinks /><span>Links</span>
                        </button>
                        <button onClick={() => setActiveTab("Mindset")} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === "Mindset" ? 'text-indigo-700 bg-indigo-50 shadow' : 'text-gray-600 hover:text-gray-900'}`}>
                            <span>Mindset</span>
                        </button>
                        <button onClick={() => setActiveTab("skilloffered")} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === "skilloffered" ? 'text-indigo-700 bg-indigo-50 shadow' : 'text-gray-600 hover:text-gray-900'}`}>
                            <span>Skills</span>
                        </button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column: Editor Sections */}
                    <div className="md:col-span-2 space-y-6">

                        {/* ✅ CORRECT: Components with Props inside Return */}
                        {activeTab === "Profile" && (
                            <Profiletab
                                handle={handle}
                                sethandle={sethandle}
                                profile={profile}
                                setprofile={setprofile}
                                script={script}
                                setscript={setscript}
                            />
                        )}

                        {activeTab === "Links" && (
                            <LinksTab
                                links={links}
                                setlinks={setlinks}
                                // Define simple add/remove logic here if not inside LinksTab
                                addlink={() => setlinks([...links, { link: "", linktext: "" }])}
                                removeLink={(index) => setlinks(links.filter((_, i) => i !== index))}
                            />
                        )}

                        {activeTab === "Mindset" && (
                            <Mindsettab
                                Mindset={Mindset}
                                setMindset={setMindset}
                            />
                        )}

                        {activeTab === "skilloffered" && (
                            <Skillstab
                                skilloffered={skilloffered}
                                setskillsoffered={setskillsoffered}
                                skillsseek={skillsseek}
                                setskillsseek={setskillsseek}
                                newSkillOffered={newSkillOffered}
                                setNewSkillOffered={setNewSkillOffered}
                                newSkillSeek={newSkillSeek}
                                setNewSkillSeek={setNewSkillSeek}
                            />
                        )}

                        <div className="flex justify-between items-center mt-6 p-2">
                            <button
                                disabled={isDisabled}
                                onClick={submitLink}
                                className={`flex-grow bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-lg transition ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-600 hover:to-purple-700'}`}
                            >
                                Save Changes
                            </button>
                            <button className="text-sm text-indigo-600 font-medium ml-4 py-3">
                                Preview
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Live Preview */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl shadow-2xl relative overflow-hidden h-[600px] border border-gray-200">
                            <div className="w-full h-20 bg-gradient-to-r from-[#FBFEF9] to-[#044B7F] rounded-t-xl"></div>
                            <div className="relative pt-12 p-4 text-center">
                                <img
                                    className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-white object-cover"
                                    src={profile || "https://placehold.co/80x80?text=AJ"}
                                    alt="Profile"
                                />
                                <h2 className="text-lg font-bold">{handle || "Name"}</h2>
                                <p className="text-sm text-gray-500 mb-6">{script || "Designer & Developer | Bio goes here"}</p>

                                <div className="space-y-3 mb-6">
                                    {links.filter(l => l.link && l.linktext).map((linkItem, index) => (
                                        <div key={index} className="flex items-center justify-center p-3 bg-gray-100 rounded-lg text-gray-700 text-sm font-medium">
                                            <span className="mr-2">🔗</span>
                                            <span>{linkItem.linktext}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="w-11/12 mx-auto mt-6 bg-gray-50 rounded-lg shadow-sm p-4 border border-l-4 border-[#639FAB]">
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
                                                <div className="flex flex-wrap gap-1 justify-center">
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
                                                <div className="flex flex-wrap gap-1 justify-center">
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
                            </div>
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-2">
                            {`Live Preview - Changes appear in real time`}
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Generate