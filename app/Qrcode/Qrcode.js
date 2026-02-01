'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling'; 
import { 
  Download, Upload, RefreshCcw, Settings, Link as LinkIcon, 
  Layers, Square, Circle, Palette, Sparkles, Wand2 
} from 'lucide-react';

export default function AdvancedQRGenerator({ isDarkMode = false }) {
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
  const cardClass = isDarkMode ? "bg-zinc-900/50 border-zinc-800 backdrop-blur-md" : "bg-white/70 border-gray-200 backdrop-blur-md";
  const textMain = isDarkMode ? "text-white" : "text-zinc-900";
  const panelBg = isDarkMode ? "bg-black" : "bg-slate-50";

  return (
    <div className={`flex flex-col md:flex-row gap-8 p-4 md:p-8 max-w-7xl mx-auto min-h-screen transition-all duration-500 ${panelBg}`}>
      
      {/* --- LEFT PANEL: Glassmorphic Controls --- */}
      <div className={`w-full md:w-5/12 space-y-8 p-8 rounded-[32px] border shadow-2xl ${cardClass} 
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
            className={`w-full p-4 border rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/50 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all ${isDarkMode ? 'border-zinc-700 text-white' : 'border-zinc-200'}`}
          />
        </section>

        {/* 2. Shape Selector (Segmented UI) */}
        <section className="space-y-3">
          <label className="text-xs uppercase tracking-widest font-bold text-zinc-400">Frame Shape</label>
          <div className="flex p-1 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-2xl">
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
            <div className="p-4 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <input type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="w-full h-8 cursor-pointer rounded-lg bg-transparent" />
              <p className="text-center text-[10px] mt-2 font-mono opacity-50">{dotColor}</p>
            </div>
            {dotGradient && (
              <div className="p-4 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
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
        <section className="p-6 rounded-[24px] bg-gradient-to-br from-blue-600 to-purple-600 text-white space-y-4">
           <label className="text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
            <Sparkles size={14} /> Custom Branding
           </label>
           <div className="flex items-center gap-4">
             <div className="relative group">
               <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
               <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-white/40 transition-all">
                 <Upload size={24} />
               </div>
             </div>
             <div>
               <p className="text-sm font-bold">Upload Center Logo</p>
               <p className="text-[10px] opacity-70">PNG, SVG or JPG supported</p>
             </div>
           </div>
        </section>
      </div>

      {/* --- RIGHT PANEL: High-End Preview --- */}
      <div className={`w-full md:w-7/12 flex flex-col items-center justify-center p-8 rounded-[40px] border relative overflow-hidden ${cardClass}`}>
        
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
  );
}