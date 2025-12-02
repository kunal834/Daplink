'use client';
import React, { useRef, useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export default function LinksTab({ links = [], setlinks, addlink, removeLink, theme }) {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  // --- Drag & Drop Handlers ---

  const handleDragStart = (e, index) => {
    // Only allow drag if the handle was clicked (checked via class or state)
    // But simpler approach: The div is draggable, we just rely on standard behavior
    dragItem.current = index;
    setDragActive(true);
    
    // Visual effect for the ghost image (optional)
    e.dataTransfer.effectAllowed = "move";
    // Make the element being dragged look transparent
    e.currentTarget.style.opacity = "0.4";
  };

  const handleDragEnter = (e, index) => {
    // Store the index of the item we are hovering over
    dragOverItem.current = index;
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    setDragActive(false);

    // If valid drag positions
    if (dragItem.current !== null && dragOverItem.current !== null) {
      // Clone array
      const _links = [...links];
      // Get the item being dragged
      const draggedItemContent = _links[dragItem.current];
      
      // Remove from old position
      _links.splice(dragItem.current, 1);
      // Insert at new position
      _links.splice(dragOverItem.current, 0, draggedItemContent);

      // Update state
      setlinks(_links);
    }

    // Reset refs
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragOver = (e) => {
    // Necessary to allow dropping
    e.preventDefault();
  };

  // --- Input Handler ---
  const updateLink = (index, field, value) => {
    if (!links) return;
    const newLinks = links.map((link, i) => {
      if (i === index) {
        return { ...link, [field]: value };
      }
      return link;
    });
    setlinks(newLinks);
  };

  // --- Styles ---
  const inputClasses = `block w-full rounded-lg text-sm p-2.5 outline-none border transition-all ${
    theme === 'dark' 
      ? 'bg-[#1A1A1A] border-white/10 text-white focus:border-teal-500/50 placeholder-gray-600' 
      : 'bg-white border-gray-200 text-gray-900 focus:border-teal-500 placeholder-gray-400'
  }`;

  const labelClasses = `absolute -top-2 left-2 px-1 text-[10px] font-bold uppercase tracking-wider z-10 ${
    theme === 'dark' ? 'bg-[#111] text-gray-500' : 'bg-white text-gray-400'
  }`;

  return (
    <div className="space-y-6 animate-enter">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Your Links
        </h3>
        <button
          onClick={addlink}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white transition-colors shadow-lg shadow-teal-500/20 ${
            theme === 'dark' ? 'bg-teal-600 hover:bg-teal-500' : 'bg-black hover:bg-gray-800'
          }`}
        >
          <Plus size={16} className="mr-1.5" /> Add Link
        </button>
      </div>

      {/* Links List */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {Array.isArray(links) && links.map((link, index) => (
          <div 
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            className={`flex gap-3 items-start p-4 rounded-xl border group transition-all duration-200 relative cursor-move ${
              theme === 'dark' 
                ? 'bg-[#111] border-white/5 hover:border-white/10' 
                : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
            }`}
          >
            {/* Drag Handle */}
            <div 
              className={`mt-3 cursor-grab active:cursor-grabbing ${
                theme === 'dark' ? 'text-gray-600 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Drag to reorder"
            >
                <GripVertical size={20} />
            </div>
            
            <div className="flex-1 space-y-4">
              {/* Title Input (Prevent drag propagation on inputs so text is selectable) */}
              <div 
                className="relative" 
                onMouseDown={(e) => e.stopPropagation()} // Stop drag starting from input
              >
                 <label className={labelClasses}>Title</label>
                 <input
                    type="text"
                    placeholder="e.g. My Portfolio"
                    value={link.linktext || ""} 
                    onChange={(e) => updateLink(index, 'linktext', e.target.value)}
                    className={inputClasses}
                 />
              </div>

              {/* URL Input */}
              <div 
                className="relative"
                onMouseDown={(e) => e.stopPropagation()} 
              >
                 <label className={labelClasses}>URL</label>
                 <input
                    type="url"
                    placeholder="https://..."
                    value={link.link || ""} 
                    onChange={(e) => updateLink(index, 'link', e.target.value)}
                    className={inputClasses}
                 />
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeLink(index)}
              onMouseDown={(e) => e.stopPropagation()} 
              className={`p-2 mt-1 rounded-lg transition-colors ${
                  theme === 'dark' 
                  ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' 
                  : 'text-red-500 hover:bg-red-50'
              }`}
              title="Remove Link"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {(!links || links.length === 0) && (
        <div className={`flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-2xl ${
            theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className={`p-3 rounded-full mb-3 ${theme === 'dark' ? 'bg-white/5 text-gray-500' : 'bg-white text-gray-400 shadow-sm'}`}>
             <Plus size={24} />
          </div>
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No links added yet.
          </p>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
            Click "Add Link" to get started.
          </p>
        </div>
      )}
    </div>
  );
}