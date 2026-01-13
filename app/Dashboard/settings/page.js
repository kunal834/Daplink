"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/Authenticate";
import React, { useState, useEffect } from "react";
import { 
  Upload, X, Plus, Trash2, Link as LinkIcon, 
  MapPin, Briefcase, User, Layout, Save, Loader2 
} from 'lucide-react';

export default function SettingsTab({ isDarkMode }) {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  
  // 1. Centralized Form State
  const [formData, setFormData] = useState({
    handle: "",
    profile: "",
    profession: "",
    location: "",
    bio: "",        // Added Bio
    links: [],      // Added Links Array
    // Default link structure: { title: "", url: "", isActive: true }
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // 2. Fetch Data
  const { data: daplink, isLoading } = useQuery({
    queryKey: ['daplink', user?.daplinkID],
    queryFn: async () => {
      // Ensure we are fetching the populated data
      const res = await axios.get(`/api/getDaplink?daplinkID=${user.daplinkID}`);
      return res.data?.data || res.data; // Handle potential response wrapping
    },
    enabled: !authLoading && !!user?.daplinkID,
    staleTime: 10 * 60 * 1000,
  });

  // 3. Sync fetched data to Form State
  useEffect(() => {
    if (daplink) {
      setFormData({
        handle: daplink.handle || "",
        profile: daplink.profile || "",
        profession: daplink.profession || "",
        location: daplink.location || "",
        bio: daplink.bio || "", 
        links: daplink.links || [], 
      });
    }
  }, [daplink]);

  // Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update formData state correctly
        setFormData(prev => ({ ...prev, profile: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Generic Input Change Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Link Management Logic ---
  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { title: "", url: "", _id: Date.now() }] // temp ID for key
    }));
  };

  const removeLink = (index) => {
    const newLinks = [...formData.links];
    newLinks.splice(index, 1);
    setFormData(prev => ({ ...prev, links: newLinks }));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData(prev => ({ ...prev, links: newLinks }));
  };

  // 5. Mutation for Updating Profile
  const mutation = useMutation({
    mutationFn: async (newData) => {
      return axios.put("/api/Updatedetails", newData); 
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['daplink', user?.daplinkID]);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    },
    onError: (error) => {
      setMessage({ type: "error", text: error.response?.data?.message || "Something went wrong" });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // Styles
  const cardBase = `rounded-3xl border shadow-sm overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`;
  const inputBase = `w-full px-4 py-3 rounded-xl border font-medium sm:text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300 placeholder-zinc-600' : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
  }`;
  const labelBase = "block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div>
        <h2 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Edit Profile</h2>
        <p className="text-zinc-500 mt-1">Manage your public appearance and content.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* --- SECTION 1: Identity (Avatar & Handle) --- */}
        <div className={cardBase}>
          <div className={`p-8 border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              <User size={20} className="text-indigo-500" />
              Identity
            </h3>
          </div>
          
          <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Upload */}
            <div className="flex-shrink-0 group relative">
              <div className={`w-32 h-32 rounded-2xl flex items-center justify-center overflow-hidden border-2 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-white shadow-lg'}`}>
                <img 
                  src={formData.profile || 'https://via.placeholder.com/150'} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer rounded-2xl">
                   <Upload size={24} className="mb-1" />
                   <span className="text-xs font-bold">Change</span>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </div>
            </div>

            {/* Handle & Profession */}
            <div className="flex-1 w-full space-y-6">
              <div>
                <label className={labelBase}>Username / Handle</label>
                <div className="flex">
                  <span className={`inline-flex items-center px-4 rounded-l-xl border border-r-0 text-sm font-medium ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-500'}`}>
                    daplink.app/
                  </span>
                  <input 
                    type="text" 
                    name="handle"
                    value={formData.handle}
                    onChange={handleChange}
                    className={`flex-1 min-w-0 block w-full px-4 py-3 rounded-r-xl border font-medium sm:text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all ${isDarkMode ? 'bg-zinc-950 border-zinc-700 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'}`} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className={labelBase}>Profession</label>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-4 top-4 text-zinc-500" />
                      <input 
                        type="text" 
                        name="profession"
                        value={formData.profession} 
                        onChange={handleChange}
                        className={`${inputBase} pl-10`}
                      />
                    </div>
                 </div>
                 <div>
                    <label className={labelBase}>Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-4 text-zinc-500" />
                      <input 
                        type="text" 
                        name="location"
                        value={formData.location} 
                        onChange={handleChange}
                        className={`${inputBase} pl-10`}
                      />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: Bio --- */}
        <div className={cardBase}>
          <div className={`p-6 border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              <Layout size={20} className="text-pink-500" />
              Bio & About
            </h3>
          </div>
          <div className="p-6">
            <label className={labelBase}>About You</label>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell your audience who you are..."
              className={`${inputBase} resize-none`}
            />
            <p className="text-right text-xs text-zinc-500 mt-2">
              {formData.bio.length} chars
            </p>
          </div>
        </div>

        {/* --- SECTION 3: Links --- */}
        <div className={cardBase}>
          <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
            <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              <LinkIcon size={20} className="text-teal-500" />
              Your Links
            </h3>
            <button
              type="button"
              onClick={addLink}
              className="flex items-center gap-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={14} /> Add New Link
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            {formData.links.length === 0 ? (
               <div className="text-center py-10 opacity-50">
                  <LinkIcon size={40} className="mx-auto mb-3 text-zinc-500"/>
                  <p>No links added yet. Click "Add New Link" to start.</p>
               </div>
            ) : (
              formData.links.map((link, index) => (
                <div key={index} className={`group flex flex-col md:flex-row gap-3 p-4 rounded-xl border relative transition-all ${isDarkMode ? 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'}`}>
                  
                  {/* Link Inputs */}
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      placeholder="Link Title (e.g. My Portfolio)"
                      value={link.title}
                      onChange={(e) => handleLinkChange(index, "title", e.target.value)}
                      className={`w-full bg-transparent text-sm font-bold outline-none ${isDarkMode ? 'text-white placeholder-zinc-600' : 'text-zinc-900 placeholder-zinc-400'}`}
                    />
                    <div className="flex items-center gap-2">
                      <LinkIcon size={12} className="text-zinc-500 shrink-0" />
                      <input
                        type="text"
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                        className={`w-full bg-transparent text-xs outline-none ${isDarkMode ? 'text-zinc-400 placeholder-zinc-700' : 'text-zinc-600 placeholder-zinc-400'}`}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end md:border-l md:pl-4 border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Remove Link"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- Sticky Footer Action --- */}
        <div className={`sticky bottom-4 z-10 p-4 rounded-2xl border shadow-2xl flex justify-between items-center backdrop-blur-md ${isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-zinc-200'}`}>
           <div className="text-sm">
             {message.text && (
                <span className={`font-bold ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {message.text}
                </span>
             )}
           </div>
           
           <div className="flex gap-3">
             <button 
                type="button"
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}
             >
                Discard
             </button>
             <button 
                type="submit"
                disabled={mutation.isPending}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
             >
                {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
             </button>
           </div>
        </div>

      </form>
    </div>
  );
}