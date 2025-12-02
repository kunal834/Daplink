'use client';
import React from 'react';
import { X, Plus, Wrench, Search } from 'lucide-react';

export default function Skillstab({ 
  skilloffered, setskillsoffered, 
  skillsseek, setskillsseek, 
  newSkillOffered, setNewSkillOffered, 
  newSkillSeek, setNewSkillSeek, 
  theme 
}) {

  // Dynamic Styles
  const colors = {
    label: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    subtext: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
    input: theme === 'dark' 
      ? 'bg-[#1A1A1A] border-white/10 text-white focus:border-teal-500/50 placeholder-gray-600' 
      : 'bg-white border-gray-200 text-gray-900 focus:border-teal-500 placeholder-gray-400',
    btn: theme === 'dark'
      ? 'bg-teal-600 hover:bg-teal-500 text-white border-teal-600'
      : 'bg-black hover:bg-gray-800 text-white border-black',
    badgeOffer: theme === 'dark'
      ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
      : 'bg-teal-50 text-teal-700 border-teal-200',
    badgeSeek: theme === 'dark'
      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      : 'bg-purple-50 text-purple-700 border-purple-200'
  };

  // Add Skill Logic
  const addSkill = (type) => {
    if (type === 'offer' && newSkillOffered.trim()) {
      if (!skilloffered.includes(newSkillOffered.trim())) {
        setskillsoffered([...skilloffered, newSkillOffered.trim()]);
      }
      setNewSkillOffered('');
    } else if (type === 'seek' && newSkillSeek.trim()) {
      if (!skillsseek.includes(newSkillSeek.trim())) {
        setskillsseek([...skillsseek, newSkillSeek.trim()]);
      }
      setNewSkillSeek('');
    }
  };

  // Remove Skill Logic
  const removeSkill = (type, index) => {
    if (type === 'offer') {
      setskillsoffered(skilloffered.filter((_, i) => i !== index));
    } else {
      setskillsseek(skillsseek.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-10 animate-enter">
      
      {/* --- Skills Offered Section --- */}
      <div>
        <div className="flex items-center gap-2 mb-3">
            <div className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-600'}`}>
                <Wrench size={16} />
            </div>
            <label className={`text-sm font-semibold ${colors.label}`}>
                Skills You Offer
            </label>
        </div>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSkillOffered}
            onChange={(e) => setNewSkillOffered(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill('offer')}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm outline-none border transition-all ${colors.input}`}
            placeholder="e.g. Web Design, React, Writing..."
          />
          <button 
            onClick={() => addSkill('offer')} 
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm flex items-center gap-1 ${colors.btn}`}
          >
            <Plus size={18} /> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {skilloffered.map((skill, index) => (
            <span key={`offer-${index}`} className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all animate-enter ${colors.badgeOffer}`}>
              {skill}
              <button
                onClick={() => removeSkill('offer', index)}
                className="ml-2 hover:bg-black/10 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {skilloffered.length === 0 && (
            <p className={`text-xs italic ${colors.subtext}`}>No skills added yet.</p>
          )}
        </div>
      </div>

      {/* --- Skills Seeking Section --- */}
      <div>
        <div className="flex items-center gap-2 mb-3">
            <div className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                <Search size={16} />
            </div>
            <label className={`text-sm font-semibold ${colors.label}`}>
                Skills You Are Seeking
            </label>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSkillSeek}
            onChange={(e) => setNewSkillSeek(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill('seek')}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm outline-none border transition-all ${colors.input}`}
            placeholder="e.g. Marketing, SEO, Funding..."
          />
          <button 
            onClick={() => addSkill('seek')} 
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm flex items-center gap-1 ${colors.btn}`}
          >
            <Plus size={18} /> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {skillsseek.map((skill, index) => (
            <span key={`seek-${index}`} className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all animate-enter ${colors.badgeSeek}`}>
              {skill}
              <button
                onClick={() => removeSkill('seek', index)}
                className="ml-2 hover:bg-black/10 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
           {skillsseek.length === 0 && (
            <p className={`text-xs italic ${colors.subtext}`}>No skills added yet.</p>
          )}
        </div>
      </div>

    </div>
  );
}