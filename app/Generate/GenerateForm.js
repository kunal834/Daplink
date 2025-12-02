"use client";
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    User, Link as LinkIcon, Brain, Wrench,
    Save, Eye, CheckCircle, Share2, Loader2, ExternalLink, MapPin, Briefcase
} from 'lucide-react';

import Profiletab from './Profiletab';
import LinksTab from './LinksTab';
import Mindsettab from './Mindsettab';
import Skillstab from './Skillstab';

// Import Context
import { useTheme } from '@/context/ThemeContext';

// --- Styles for Animations ---
const AnimationStyles = () => (
    <style>{`
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    .animate-float { animation: float 6s ease-in-out infinite; }
    
    @keyframes aurora { 
        0% { transform: rotate(0deg) scale(1); opacity: 0.3; } 
        50% { transform: rotate(180deg) scale(1.1); opacity: 0.5; } 
        100% { transform: rotate(360deg) scale(1); opacity: 0.3; } 
    }
    .animate-aurora { animation: aurora 25s infinite linear; }

    /* Hide Scrollbar for Preview */
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
  `}</style>
);

export default function GenerateForm() {
    const { theme } = useTheme();
    const searchParams = useSearchParams();
    const router = useRouter();

    // --- State ---
    const [activeTab, setActiveTab] = useState("Profile");
    const [loading, setLoading] = useState(false);

    // Form Data
    const [links, setLinks] = useState([{ link: "", linktext: "" }]);
    const [handle, setHandle] = useState(searchParams.get('handle') || "");
    const [profile, setProfile] = useState("");
    const [script, setScript] = useState("");

    // NEW STATES
    const [location, setLocation] = useState("");
    const [profession, setProfession] = useState("");

    const [mindset, setMindset] = useState("");
    const [skillOffered, setSkillOffered] = useState(["Web Design"]);
    const [skillsSeek, setSkillsSeek] = useState(["Marketing"]);
    const [newSkillOffered, setNewSkillOffered] = useState('');
    const [newSkillSeek, setNewSkillSeek] = useState('');

    // --- Logic ---
    const submitLink = async () => {
        setLoading(true);
        try {
            // Filter out empty links before sending
            const filteredLinks = links.filter(l => l.link.trim() !== "" && l.linktext.trim() !== "");

            const payload = {
                links: filteredLinks,
                handle,
                profile,
                script,
                location,
                profession,
                mindset,
                skillsoff: skillOffered,
                skillsseek: skillsSeek
            };

            const response = await fetch("/api/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Network error: " + response.status);
            const result = await response.json();

            if (result.success) {
                toast.success("Profile created successfully! 🚀");
                setTimeout(() => router.push(`/${handle}`), 1500);
            } else {
                toast.error(result.message || "Something went wrong");
                setLoading(false);
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error(error.message || "Unexpected error");
            setLoading(false);
        }
    };

    const isDisabled = !handle || loading;

    // --- Dynamic Theme Styles ---
    const colors = {
        bg: theme === 'dark' ? 'bg-[#020202]' : 'bg-gray-50',
        text: theme === 'dark' ? 'text-white' : 'text-slate-900',
        subtext: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
        card: theme === 'dark' ? 'bg-[#111]/80 border-white/10' : 'bg-white border-gray-200',
        tabActive: theme === 'dark' ? 'bg-teal-500/20 text-teal-400 border-teal-500/50' : 'bg-teal-50 text-teal-700 border-teal-200',
        tabInactive: theme === 'dark' ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100',
        previewBg: theme === 'dark' ? 'bg-[#050505]' : 'bg-[#F3F4F6]',
        previewCard: theme === 'dark' ? 'bg-[#1A1A1A] border-[#333] text-white' : 'bg-white border-gray-100 text-gray-900',
        previewText: theme === 'dark' ? 'text-white' : 'text-gray-900',
        previewSubtext: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    };

    return (
        <div className={`min-h-screen relative transition-colors duration-500 ${colors.bg} font-sans`}>
            <AnimationStyles />
            <ToastContainer theme={theme} position="bottom-right" />

            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[600px] h-[600px] bg-purple-900/20 top-[-10%] left-[-10%] rounded-full blur-[120px] animate-aurora"></div>
                <div className="absolute w-[600px] h-[600px] bg-teal-900/20 bottom-[-10%] right-[-10%] rounded-full blur-[120px] animate-aurora" style={{ animationDelay: '-5s' }}></div>
                {theme === 'light' && <div className="absolute inset-0 bg-white/60 z-[-1]"></div>}
            </div>

            <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className={`text-3xl md:text-5xl font-bold tracking-tight mb-4 ${colors.text}`}>
                        Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">DapLink</span>
                    </h1>
                    <p className={`text-lg ${colors.subtext}`}>Build and customize your personal link-in-bio page in minutes.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Editor Tabs */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Tab Switcher */}
                        <div className={`flex flex-wrap gap-2 p-2 rounded-2xl border backdrop-blur-xl ${colors.card}`}>
                            {[
                                { id: "Profile", icon: User, label: "Profile" },
                                { id: "Links", icon: LinkIcon, label: "Links" },
                                { id: "Mindset", icon: Brain, label: "Mindset" },
                                { id: "skilloffered", icon: Wrench, label: "Skills" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all border ${activeTab === tab.id
                                        ? `${colors.tabActive} shadow-sm`
                                        : `${colors.tabInactive} border-transparent`
                                        }`}
                                >
                                    <tab.icon size={16} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Editor Form Container */}
                        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl backdrop-blur-xl ${colors.card}`}>
                            <div className="min-h-[400px]">
                                {activeTab === "Profile" && (
                                    <Profiletab
                                        handle={handle} sethandle={setHandle}
                                        profile={profile} setprofile={setProfile}
                                        script={script} setscript={setScript}
                                        location={location} setLocation={setLocation}
                                        profession={profession} setProfession={setProfession}
                                        theme={theme}
                                    />
                                )}
                                {activeTab === "Links" && (
                                    <LinksTab
                                        links={links} setlinks={setLinks}
                                        addlink={() => setLinks([...links, { link: "", linktext: "" }])}
                                        removeLink={(index) => setLinks(links.filter((_, i) => i !== index))}
                                        theme={theme}
                                    />
                                )}
                                {activeTab === "Mindset" && (
                                    <Mindsettab
                                        Mindset={mindset} setMindset={setMindset}
                                        theme={theme}
                                    />
                                )}
                                {activeTab === "skilloffered" && (
                                    <Skillstab
                                        skilloffered={skillOffered} setskillsoffered={setSkillOffered}
                                        skillsseek={skillsSeek} setskillsseek={setSkillsSeek}
                                        newSkillOffered={newSkillOffered} setNewSkillOffered={setNewSkillOffered}
                                        newSkillSeek={newSkillSeek} setNewSkillSeek={setNewSkillSeek}
                                        theme={theme}
                                    />
                                )}
                            </div>

                            {/* Save Button */}
                            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200/10">
                                <button
                                    disabled={isDisabled}
                                    onClick={submitLink}
                                    className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${isDisabled
                                        ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white hover:scale-[1.02]'
                                        }`}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    <span>{loading ? "Publishing..." : "Save & Publish"}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Live Preview */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32">
                            <div className="flex items-center justify-center gap-2 mb-4 text-sm font-medium text-teal-500">
                                <Eye size={16} /> Live Preview
                            </div>

                            {/* Phone Mockup */}
                            <div className={`relative mx-auto w-[320px] h-[650px] rounded-[3rem] border-[8px] shadow-2xl overflow-hidden bg-white ${theme === 'dark' ? 'border-[#222] ring-1 ring-white/10' : 'border-gray-900'}`}>

                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>

                                {/* Screen Content */}
                                <div className={`h-full w-full overflow-y-auto no-scrollbar ${colors.previewBg}`}>

                                    {/* Header Banner */}
                                    <div className="h-24 w-full bg-gradient-to-r from-teal-400 to-blue-500"></div>

                                    <div className="px-5 pb-8 -mt-10 flex flex-col items-center text-center">
                                        {/* Profile Picture */}
                                        <div className="relative p-1 rounded-full bg-white shadow-sm">
                                            <img
                                                src={profile || `https://placehold.co/150x150/333/fff?text=${handle?.[0]?.toUpperCase() || 'U'}`}
                                                alt="Profile"
                                                className="w-20 h-20 rounded-full object-cover border-2 border-white"
                                            />
                                        </div>

                                        <h2 className={`mt-3 font-bold text-lg ${colors.previewText}`}>@{handle || "username"}</h2>
                                        <p className={`text-xs mt-1 line-clamp-2 ${colors.previewSubtext}`}>{script || "Digital Creator & Developer"}</p>

                                        <div className={`flex gap-2 mt-2 text-[10px] ${colors.previewSubtext}`}>
                                            <span className="flex items-center gap-1"><MapPin size={10} /> {location || "Location"}</span>
                                            <span className="flex items-center gap-1"><Briefcase size={10} /> {profession || "Profession"}</span>
                                        </div>

                                        {/* Links List with URL Preview */}
                                        <div className="w-full mt-6 space-y-3">
                                            {links.map((link, i) => (
                                                // Only show if title OR link is typed
                                                (link.linktext || link.link) && (
                                                    <div key={i} className={`w-full p-3 rounded-xl shadow-sm text-sm font-medium flex items-center justify-between border transition-all ${colors.previewCard}`}>
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            {/* Icon */}
                                                            <div className={`w-8 h-8 shrink-0 rounded-md flex items-center justify-center ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}>
                                                                <LinkIcon size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                                                            </div>

                                                            {/* Title & URL */}
                                                            <div className="flex flex-col text-left overflow-hidden">
                                                                <span className="truncate font-semibold leading-tight">{link.linktext || "Untitled Link"}</span>
                                                                <span className={`truncate text-[10px] font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                    {link.link || "https://your-link.com"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ExternalLink size={14} className="opacity-50 shrink-0 ml-2" />
                                                    </div>
                                                )
                                            ))}

                                            {/* Empty State for Links */}
                                            {(!links || links.length === 0 || (!links[0].linktext && !links[0].link)) && (
                                                <div className="text-xs text-gray-400 italic py-4 border border-dashed border-gray-300 rounded-xl">
                                                    Add links to see them here
                                                </div>
                                            )}
                                        </div>

                                        {/* Mindset Section */}
                                        {mindset && (
                                            <div className={`w-full mt-6 p-4 rounded-xl border shadow-sm text-left ${colors.previewCard}`}>
                                                <div className="flex items-center gap-1 text-teal-500 text-xs font-bold uppercase mb-2">
                                                    <Brain size={12} /> Mindset
                                                </div>
                                                <p className="text-xs italic opacity-80">"{mindset}"</p>
                                            </div>
                                        )}

                                        {/* Skills Section */}
                                        {(skillOffered.length > 0 || skillsSeek.length > 0) && (
                                            <div className={`w-full mt-4 p-4 rounded-xl border shadow-sm text-left ${colors.previewCard}`}>
                                                {skillOffered.length > 0 && (
                                                    <div className="mb-3">
                                                        <p className="text-[10px] font-bold opacity-50 uppercase mb-1.5">Offering</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {skillOffered.map((s, i) => (
                                                                <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${theme === 'dark' ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>{s}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-xs text-gray-500 mt-4">
                                Live Preview - Changes auto-save
                            </p>
                        </div>
                    </div>

                </div>
            </main>

        </div>
    );
}