'use client';
import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function Profiletab({ handle, sethandle, profile, setprofile, script, setscript, location, setLocation, profession, setProfession, theme }) {
  const [dragActive, setDragActive] = useState(false);

  // Dynamic Colors based on theme
  const colors = {
    label: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    input: theme === 'dark' 
      ? 'bg-[#1A1A1A] border-white/10 text-white focus:border-teal-500/50 placeholder-gray-600' 
      : 'bg-white border-gray-200 text-gray-900 focus:border-teal-500 placeholder-gray-400',
    addon: theme === 'dark' 
      ? 'bg-[#111] border-white/10 text-gray-500 border-r-0' 
      : 'bg-gray-50 border-gray-200 text-gray-500 border-r-0',
    subtext: theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
  };

  // Handle File Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setprofile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       const file = e.dataTransfer.files[0];
       const reader = new FileReader();
       reader.onloadend = () => {
         setprofile(reader.result);
       };
       reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-enter">
      
      {/* --- Profile Image Section --- */}
      <div>
        <label className={`block text-sm font-medium mb-3 ${colors.label}`}>Profile Picture</label>
        
        {/* Drag & Drop Area */}
        <div 
          className={`relative group flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden ${
            dragActive 
              ? 'border-teal-500 bg-teal-500/10' 
              : theme === 'dark' 
                ? 'border-white/10 bg-white/5 hover:border-teal-500/50 hover:bg-white/10' 
                : 'border-gray-300 bg-gray-50 hover:border-teal-500 hover:bg-white'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
            {profile ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black/50">
                    <img src={profile} alt="Preview" className="h-full object-contain" />
                    <button 
                        onClick={(e) => { e.preventDefault(); setprofile(''); }}
                        className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg z-10"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                    <div className={`p-3 rounded-full mb-3 ${theme === 'dark' ? 'bg-white/10 text-teal-400' : 'bg-white text-teal-600 shadow-sm'}`}>
                        <Upload size={24} />
                    </div>
                    <p className={`mb-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="font-bold text-teal-500">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                </div>
            )}
            <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageUpload}
                accept="image/*"
            />
        </div>
        
        <div className="mt-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ImageIcon size={14} className="text-gray-500" />
            </div>
            <input
                type="url"
                value={profile}
                onChange={e => setprofile(e.target.value)}
                placeholder="Or paste image URL..."
                className={`pl-9 ${colors.input} w-full py-2.5 px-3 rounded-lg text-sm outline-none border transition-all`}
            />
        </div>
      </div>

      {/* --- Handle Input --- */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${colors.label}`}>Handle</label>
        <div className="flex shadow-sm rounded-xl overflow-hidden">
          <span className={`inline-flex items-center px-4 text-sm border ${colors.addon}`}>
            daplink.app/
          </span>
          <input
            type="text"
            value={handle}
            onChange={e => sethandle(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
            className={`flex-1 px-4 py-3 text-sm outline-none border border-l-0 rounded-none rounded-r-xl transition-all ${colors.input}`}
            placeholder="username"
          />
        </div>
      </div>

      {/* --- Details Row (Location & Profession) --- */}
      <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${colors.label}`}>Profession</label>
            <input
                type="text"
                value={profession || ""}
                onChange={e => setProfession(e.target.value)}
                className={colors.input.replace('w-full', '') + " w-full px-4 py-3 rounded-xl text-sm outline-none border"}
                placeholder="e.g. Designer"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${colors.label}`}>Location</label>
            <input
                type="text"
                value={location || ""}
                onChange={e => setLocation(e.target.value)}
                className={colors.input.replace('w-full', '') + " w-full px-4 py-3 rounded-xl text-sm outline-none border"}
                placeholder="e.g. New York"
            />
          </div>
      </div>

      {/* --- Bio Input --- */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${colors.label}`}>Bio / Description</label>
        <textarea
          rows={4}
          value={script}
          onChange={e => setscript(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all resize-none ${colors.input}`}
          placeholder="Write a short bio about yourself..."
          maxLength={150}
        />
        <div className={`mt-1 text-xs text-right ${script.length >= 150 ? 'text-red-500 font-bold' : colors.subtext}`}>
            {script.length}/150 characters
        </div>
      </div>

    </div>
  );
}