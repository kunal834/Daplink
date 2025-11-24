"use client"
// import Image from 'next/image'
// import Link from 'next/link';
// import { ToastContainer, toast } from 'react-toastify';
// import { useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/navigation';


import React from 'react'

const IconPortfolio = () => <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h5m-5 0v-2a1 1 0 011-1h2a1 1 0 011 1v2m-3 0h3" /></svg>;
const IconTrash = () => <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const LinksTab = ({links , setlinks }) => {

 

    // --- State Management ---


        // --- Link Handlers ---

    const addlink = () => {
        setlinks(links.concat([{ link: "", linktext: "" }]))
    }

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



    // New handler to remove a link item
    const removeLink = (indexToRemove) => {
        setlinks(links.filter((_, index) => index !== indexToRemove));
    };
  return (
<>
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
</>
  )
}

export default LinksTab
