"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/Authenticate";
import React, { useState, useEffect } from "react";

export default function SettingsTab({ isDarkMode }) {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  
  // 1. Centralized Form State
  const [formData, setFormData] = useState({
    handle: "",
    profile: "",
    profession: "",
    location: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // 2. Fetch Data
  const { data: daplink, isLoading } = useQuery({
    queryKey: ['daplink', user?.daplinkID],
    queryFn: async () => {
      const res = await axios.get(`/api/getDaplink?daplinkID=${user.daplinkID}`);
      return res.data;
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
      });
    }
  }, [daplink]);

  // 4. Input Change Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 5. Mutation for Updating Profile
  const mutation = useMutation({
    mutationFn: async (newData) => {
      // Assuming your API route is at /api/updateProfile (adjust as needed)
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

  if (authLoading || isLoading) return null;

  const inputClasses = `w-full px-4 py-3 rounded-xl border font-medium sm:text-sm transition-colors focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none ${
    isDarkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-300 placeholder-zinc-600' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
  }`;

  const labelClasses = "block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-zinc-500 text-sm">Manage your account and preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className={`rounded-3xl border shadow-sm overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        
        {/* Header Section */}
        <div className={`p-8 border-b ${isDarkMode ? 'bg-zinc-800/30 border-zinc-800' : 'bg-zinc-50/30 border-zinc-100'}`}>
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl border shadow-inner overflow-hidden ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-white'}`}>
              <img 
                src={formData.profile || 'https://via.placeholder.com/150'} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">My Profile</h3>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                Customize how others see you on Daplink.
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-8 space-y-8">
          
          {/* Handle (Username) */}
          <div>
            <label className={labelClasses}>Username</label>
            <div className="flex group">
              <span className={`inline-flex items-center px-4 rounded-l-xl border border-r-0 text-sm font-medium ${isDarkMode ? 'bg-zinc-950 border-zinc-700 text-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-500'}`}>
                daplink.app/
              </span>
              <input 
                type="text" 
                name="handle"
                value={formData.handle}
                onChange={handleChange}
                className={`flex-1 min-w-0 block w-full px-4 py-3 rounded-r-xl border font-medium sm:text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'}`} 
              />
            </div>
          </div>

          {/* Grid for Profession & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Profession</label>
              <input 
                type="text" 
                name="profession"
                value={formData.profession} 
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Location</label>
              <input 
                type="text" 
                name="location"
                value={formData.location} 
                onChange={handleChange}
                placeholder="e.g. New York, USA"
                className={inputClasses} 
              />
            </div>
          </div>

          {/* Profile Image URL */}
          <div>
            <label className={labelClasses}>Profile Image URL</label>
            <input 
              type="text" 
              name="profile"
              value={formData.profile} 
              onChange={handleChange}
              placeholder="https://..."
              className={inputClasses} 
            />
          </div>

          {/* Feedback Message */}
          {message.text && (
            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'}`}>
              {message.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className={`pt-6 border-t flex items-center justify-end gap-3 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
             <button 
               type="button"
               onClick={() => setFormData({ // Reset to original data
                 handle: daplink.handle, 
                 profile: daplink.profile, 
                 profession: daplink.profession, 
                 location: daplink.location 
               })}
               className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-700'}`}
             >
               Cancel
             </button>
             <button 
               type="submit"
               disabled={mutation.isPending}
               className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
             >
               {mutation.isPending ? 'Saving...' : 'Save Changes'}
             </button>
          </div>

        </div>
      </form>
    </div>
  );
}