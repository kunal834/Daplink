"use client"
import React from 'react'



const Mindsettab = ({Mindset , setMindset}) => {
  
  return (
  <>
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
  </>
  )
}

export default Mindsettab
