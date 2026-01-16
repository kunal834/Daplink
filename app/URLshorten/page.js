"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import UrlShortenerTab from './shorten' // Make sure this path is correct!
import { useTheme } from '@/context/ThemeContext'
import { toast } from 'react-toastify'
import Navbar from '@/Components/Navbar'
import Footer from '@/Components/Footer'
const Page = () => {
  // 1. Get Theme
  const { isDarkmode } = useTheme();
  const themeData = useTheme();
    console.log("theme ka data" ,themeData)
    // 2. SAFETY CHECK:
    // Sometimes contexts return { theme: 'dark' } instead of { isDarkMode: true }.
    // This line handles both cases automatically.

  
  // 2. Initialize State properly (Removed 'second')
  // Using a hardcoded ID for now so you can test. Replace with real auth logic later.
  const [userID, setUserID] = useState("") 

  const [links, setLinks] = useState([])

  console.log("Darkmode active:", isDarkmode)

  // 4. Clean useEffect (Removed 'third')
  useEffect(() => {
    async function  fetchuserID(){

      try{
        const id = await axios.get("/api/auth/me");
    console.log("id" ,id.data.user._id)
    if(id){
      setUserID(id.data.user._id)
    }
    if(!id){
   toast.error("user not authorized")
    }
      }catch(error){
        console.log(error)
      }
 
    }

    fetchuserID()
  }, [])
  
useEffect(() =>{
  async function fetchlinks(){
  try{
  const linkdata = await axios.get("/api/getLinks");
    console.log(linkdata?linkdata : "no data present")
    if(linkdata){
      setLinks(linkdata.data)
    } 
   
  }catch(error){
    console.log(error)
  }
   

  }

  fetchlinks()
} , [])

  return (
   <>
  <Navbar className="fixed w-full z-50" /> {/* Ensure z-index is high so it stays on top */}

  {/* Added pt-28 (padding top) to push content down below the fixed navbar */}
  {/* Added min-h-screen to ensure footer stays at bottom if content is short */}
  <div className="pt-28 px-4 min-h-screen">
    <UrlShortenerTab 
      isDarkMode={isDarkmode}
      userID={userID}
      links={links}
      setLinks={setLinks}
    />
  </div>

  <Footer/>
</>
   
  )
}

export default Page