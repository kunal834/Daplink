'use client'; // 1. Required because we use the useTheme hook

import React , { useState, useEffect, useRef } from 'react';
import QRGenerator from './Qrcode';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { useTheme } from '@/context/ThemeContext'; // Importing the hook

import QRCodeStyling from 'qr-code-styling'; 
import { 
  Download, Upload, RefreshCcw, Settings, Link as LinkIcon, 
  Layers, Square, Circle, Palette, Sparkles, Wand2 
} from 'lucide-react';

const Page = () => {
  // 2. Destructure the theme state directly from the hook
  // Check your ThemeContext to see if the value is named 'isDarkMode', 'theme', or 'mode'.
  // I am assuming it is 'isDarkMode' based on your previous code.

const themeData = useTheme();
   const [url, setUrl] = useState('https://Daplink.online/your-link');
    const [logo, setLogo] = useState(null);
    
    // Advanced Color & Gradient State
    const [dotColor, setDotColor] = useState('#2563eb');
    const [dotGradient, setDotGradient] = useState(true);
    const [dotColor2, setDotColor2] = useState('#7c3aed');
    const [bgColor, setBgColor] = useState('#ffffff');
    
    // Shape States
    const [qrShape, setQrShape] = useState('square'); 
    const [dotType, setDotType] = useState('extra-rounded'); 
    const [cornerType, setCornerType] = useState('extra-rounded'); 
    const [cornerDotType, setCornerDotType] = useState('dot'); 
  
    const qrCode = useRef(null);
    const ref = useRef(null);
      useEffect(() => {
        const options = {
          width: 300,
          height: 300,
          type: 'svg',
          data: url,
          image: logo,
          shape: qrShape,
          dotsOptions: {
            type: dotType,
            gradient: dotGradient ? {
              type: 'linear',
              rotation: 45,
              colorStops: [
                { offset: 0, color: dotColor },
                { offset: 1, color: dotColor2 }
              ]
            } : undefined,
            color: !dotGradient ? dotColor : undefined
          },
          backgroundOptions: { color: bgColor },
          imageOptions: { crossOrigin: 'anonymous', margin: 8, imageSize: 0.4 },
          cornersSquareOptions: { color: dotColor, type: cornerType },
          cornersDotOptions: { color: dotColor, type: cornerDotType }
        };
    
        if (!qrCode.current) {
          qrCode.current = new QRCodeStyling(options);
          qrCode.current.append(ref.current);
        } else {
          qrCode.current.update(options);
        }
      }, [url, dotColor, dotColor2, dotGradient, bgColor, logo, dotType, cornerType, cornerDotType, qrShape]);
    
      // Handle Logic
      const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => setLogo(event.target.result);
          reader.readAsDataURL(file);
        }
      };
    
      const onDownloadClick = (extension) => {
        qrCode.current?.download({ extension, name: "daplink_qr" });
      };
    
      // Advanced UI Classes
     
    
  // 2. SAFETY CHECK:
  // Sometimes contexts return { theme: 'dark' } instead of { isDarkMode: true }.
  // This line handles both cases automatically.
  const isDarkMode = themeData.isDarkMode || themeData.theme === 'dark' || themeData.mode === 'dark';
  console.log("Dark Mode State:", isDarkMode);
   const cardClass = isDarkMode ? "bg-zinc-900/50 border-zinc-800 backdrop-blur-md" : "bg-white/70 border-gray-200 backdrop-blur-md";
      const textMain = isDarkMode ? "text-white" : "text-zinc-900";
      const panelBg = isDarkMode ? "bg-black" : "bg-slate-50";
  return (
    <>
      <Navbar  />

      {/* <main
        className={`min-h-screen py-12 px-4 transition-colors duration-300 ${
          isDarkmode ? 'bg-zinc-950' : 'bg-gray-50'
        }`}
      >
        <div className={`max-w-6xl mx-auto mb-8 text-center mt-20 ${
          isDarkmode ? 'bg-zinc-950' : 'bg-gray-50'
        }`}>
        
          <h1
            className={`text-4xl font-extrabold mb-2 tracking-tight ${
              isDarkmode ? 'text-white' : 'text-gray-900'
            }`}
          >
           {` DapLink QR Creator`}
          </h1>
          
          <p
            className={`text-lg ${
              isDarkmode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
           {` Generate custom, brandable QR codes instantly.`}
          </p>
        </div>

       
        <QRGenerator isDarkMode={isDarkMode} />
      </main> */}
  <div className={`flex flex-col md:flex-row gap-8 p-4 md:p-8 max-w-7xl mx-auto min-h-screen  transition-all duration-500 ${panelBg}`}>
      
      {/* --- LEFT PANEL: Glassmorphic Controls --- */}
      <div className={`w-full md:w-5/12 space-y-8 p-8 mt-15 rounded-[32px] border shadow-2xl ${cardClass} 
        overflow-y-auto max-h-[90vh] scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
        
        <header className="flex items-center justify-between">
          <div>
            <h2 className={`text-3xl font-black tracking-tight ${textMain}`}>DapLink <span className="text-blue-600">Pro</span></h2>
            <p className="text-zinc-500 text-sm font-medium">Design your unique identity.</p>
          </div>
          <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-600">
            <Wand2 size={24} />
          </div>
        </header>

        {/* 1. URL Section */}
        <section className="space-y-3">
          <label className={`text-xs uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-2`}>
            <LinkIcon size={14} /> Link Destination
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full p-4 border rounded-2xl  focus:ring-blue-500/20 outline-none transition-all ${isDarkMode ? 'border-zinc-700 text-white' : 'border-zinc-200'}`}
          />
        </section>

        {/* 2. Shape Selector (Segmented UI) */}
        <section className="space-y-3">
          <label className="text-xs uppercase tracking-widest font-bold text-zinc-400">Frame Shape</label>
          <div className="flex p-1rounded-2xl">
            {['square', 'circle'].map((s) => (
              <button key={s} onClick={() => setQrShape(s)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${qrShape === s ? "bg-white dark:bg-zinc-700 shadow-lg text-blue-600" : "text-zinc-500"}`}>
                {s === 'circle' ? <Circle size={16} /> : <Square size={16} />} {s.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Color Master Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-widest font-bold text-zinc-400">Color Dynamics</label>
            <button onClick={() => setDotGradient(!dotGradient)} className={`text-[10px] px-2 py-1 rounded-full font-bold border ${dotGradient ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>
              GRADIENT {dotGradient ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl  border border-zinc-200 dark:border-zinc-700">
              <input type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="w-full h-8 cursor-pointer rounded-lg bg-transparent" />
              <p className="text-center text-[10px] mt-2 font-mono opacity-50">{dotColor}</p>
            </div>
            {dotGradient && (
              <div className="p-4 rounded-2xlborder border-zinc-200 dark:border-zinc-700">
                <input type="color" value={dotColor2} onChange={(e) => setDotColor2(e.target.value)} className="w-full h-8 cursor-pointer rounded-lg bg-transparent" />
                <p className="text-center text-[10px] mt-2 font-mono opacity-50">{dotColor2}</p>
              </div>
            )}
          </div>
        </section>

        {/* 4. Advanced Patterns (Grid UI) */}
        <section className="space-y-3">
          <label className="text-xs uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-2">
            <Layers size={14} /> Pattern Engine
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'].map((type) => (
              <button key={type} onClick={() => setDotType(type)}
                className={`p-3 text-[10px] border rounded-xl font-bold uppercase transition-all ${dotType === type ? "bg-blue-600 text-white border-blue-600 scale-95" : "border-zinc-200 dark:border-zinc-800 hover:border-blue-400"}`}>
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </section>

        {/* 5. Brand Identity */}
        {/* 5. Simple & Aesthetic Custom Branding Section */}
<section className="p-5 rounded-[28px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 transition-all hover:border-blue-500/30 group">
  <div className="flex items-center justify-between mb-4">
    <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-zinc-400 flex items-center gap-2">
      <Sparkles size={14} className="text-blue-500" /> Custom Branding
    </label>
    {logo && (
      <button 
        onClick={() => setLogo(null)} 
        className="text-[9px] font-bold text-red-500 hover:text-red-600 transition-colors"
      >
        REMOVE
      </button>
    )}
  </div>

  <div className="flex items-center gap-4">
    <div className="relative group/upload">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
      />
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-dashed transition-all overflow-hidden
        ${logo 
          ? 'border-blue-500/50 bg-white' 
          : 'border-zinc-200 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-800 group-hover/upload:border-blue-400 group-hover/upload:bg-blue-50/50'
        }`}
      >
        {logo ? (
          <img src={logo} alt="Preview" className="w-full h-full object-contain p-2" />
        ) : (
          <Upload size={20} className="text-zinc-400 group-hover/upload:text-blue-500 transition-colors" />
        )}
      </div>
    </div>
    
    <div className="space-y-1">
      <p className={`text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
        {logo ? "Logo Uploaded" : "Upload Center Logo"}
      </p>
      <p className="text-[10px] text-zinc-500 font-medium">
        {logo ? "Will appear in center of QR" : "SVG, PNG or JPG (Max 2MB)"}
      </p>
    </div>
  </div>
</section>  
      </div>

      {/* --- RIGHT PANEL: High-End Preview --- */}
      <div className={`w-full mt-15 md:w-7/12 flex flex-col items-center justify-center p-8 rounded-[40px] border relative overflow-hidden ${cardClass}`}>
        
        {/* Background Decor */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

        <div className="relative z-10 p-10 rounded-[48px] bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-500 hover:rotate-2">
             <div ref={ref} className="transition-all" />
        </div>

        <div className="mt-12 flex gap-4 w-full max-w-sm relative z-10">
          <button onClick={() => onDownloadClick('png')} className="flex-1 bg-zinc-900 dark:bg-white text-white dark:text-black py-5 rounded-[24px] font-black text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
            EXPORT PNG
          </button>
          <button onClick={() => onDownloadClick('svg')} className="flex-1 border-2 border-zinc-200 dark:border-zinc-800 py-5 rounded-[24px] font-black text-xs tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
            SVG
          </button>
        </div>
        
        <button onClick={() => window.location.reload()}
            className="mt-8 flex items-center gap-2 text-[10px] font-black tracking-widest text-zinc-400 hover:text-blue-600 transition-all uppercase">
            <RefreshCcw size={12} /> Reset Master Configuration
        </button>
      </div>
    </div>
      <Footer />
    </>
  );
};

export default Page;