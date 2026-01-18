'use client';

import React, { useState, useEffect, useRef } from 'react';
// We use the 'qr-code-styling' library for advanced shapes (dots, rounded corners, etc.)
import QRCodeStyling from 'qr-code-styling'; 
import { Download, Upload, RefreshCcw, Settings, Link as LinkIcon, Layers,  LucideIcon } from 'lucide-react';

export default function AdvancedQRGenerator({ isDarkMode = false }) {
  const [url, setUrl] = useState('https://Daplink.online/your-link');
  const [color, setColor] = useState('#2563eb'); // Default Blue
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logo, setLogo] = useState(null);
  
  // Advanced Styling State
  const [dotType, setDotType] = useState('rounded'); // 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded'
  const [cornerType, setCornerType] = useState('extra-rounded'); // 'dot' | 'square' | 'extra-rounded'
  const [cornerDotType, setCornerDotType] = useState('dot'); // 'dot' | 'square'
  
  const qrCode = useRef(null);
  const ref = useRef(null);

  // Initialize and Update QR Code
  useEffect(() => {
    // Configuration for the advanced QR code
    const options = {
      width: 300,
      height: 300,
      type: 'svg',
      data: url,
      image: logo,
      dotsOptions: {
        color: color,
        type: dotType 
      },
      backgroundOptions: {
        color: bgColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
        imageSize: 0.4
      },
      cornersSquareOptions: {
        color: color,
        type: cornerType 
      },
      cornersDotOptions: {
        color: color,
        type: cornerDotType 
      }
    };

    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling(options);
      qrCode.current.append(ref.current);
    } else {
      qrCode.current.update(options);
    }
  }, [url, color, bgColor, logo, dotType, cornerType, cornerDotType]);

  // Handle Logo Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Downloads
  const onDownloadClick = (extension) => {
    if (qrCode.current) {
      qrCode.current.download({
        extension: extension,
        name: "daplink_qr"
      });
    }
  };

  // Styles
  const cardClass = isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200";
  const textMain = isDarkMode ? "text-gray-100" : "text-gray-800";
  const textSub = isDarkMode ? "text-gray-400" : "text-gray-500";
  const inputClass = isDarkMode 
    ? "bg-zinc-900 border-zinc-700 text-gray-100 focus:ring-blue-500 placeholder-gray-500" 
    : "bg-white border-gray-200 text-gray-900 focus:ring-blue-500 placeholder-gray-400";

  return (
    <div className={`flex flex-col md:flex-row gap-8 p-6 max-w-6xl mx-auto min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-zinc-900" : "bg-gray-50"}`}>
      
      {/* --- LEFT PANEL: Controls --- */}
      <div className={`w-full md:w-5/12 space-y-6 p-6 rounded-2xl shadow-sm border ${cardClass} overflow-y-auto max-h-[90vh]`}>
        
        {/* Header */}
        <div className={`border-b pb-4 ${isDarkMode ? "border-zinc-700" : "border-gray-100"}`}>
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${textMain}`}>
            <Settings className="w-6 h-6 text-blue-600" />
            DapLink Creator
          </h2>
          <p className={`${textSub} text-sm mt-1`}>Advanced customization for your Bitly links.</p>
        </div>

        {/* 1. Content Input */}
        <div className="space-y-2">
          <label className={`text-sm font-semibold flex items-center gap-2 ${textMain}`}>
            <LinkIcon size={16} /> Destination URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full p-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${inputClass}`}
            placeholder="https://DapLink.app/your-link"
          />
        </div>

        {/* 2. Patterns (The "Advanced" part) */}
        <div className="space-y-3">
            <label className={`text-sm font-semibold flex items-center gap-2 ${textMain}`}>
                <Layers size={16} /> Pattern Style
            </label>
            <div className="grid grid-cols-3 gap-2">
                {['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setDotType(type)}
                        className={`p-2 text-xs border rounded-lg capitalize transition-all ${
                            dotType === type 
                            ? "bg-blue-600 text-white border-blue-600" 
                            : `${isDarkMode ? "bg-zinc-900 border-zinc-700 text-gray-300" : "bg-white text-gray-600 hover:bg-gray-50"}`
                        }`}
                    >
                        {type.replace('-', ' ')}
                    </button>
                ))}
            </div>
        </div>

        {/* 3. Corner Styles */}
        <div className="space-y-3">
            <label className={`text-sm font-semibold flex items-center gap-2 ${textMain}`}>
                Corner Style (Eyes)
            </label>
            <div className="grid grid-cols-3 gap-2">
                {['square', 'extra-rounded', 'dot'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setCornerType(type)}
                        className={`p-2 text-xs border rounded-lg capitalize transition-all ${
                            cornerType === type 
                            ? "bg-blue-600 text-white border-blue-600" 
                            : `${isDarkMode ? "bg-zinc-900 border-zinc-700 text-gray-300" : "bg-white text-gray-600 hover:bg-gray-50"}`
                        }`}
                    >
                        {type.replace('-', ' ')}
                    </button>
                ))}
            </div>
        </div>

        {/* 4. Colors */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className={`text-sm font-semibold ${textMain}`}>QR Color</label>
                <div className={`flex items-center gap-2 p-2 border rounded-lg ${isDarkMode ? "border-zinc-700 bg-zinc-900" : "bg-white"}`}>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 cursor-pointer bg-transparent border-none" />
                    <span className={`text-xs font-mono ${textSub}`}>{color}</span>
                </div>
            </div>
            <div className="space-y-2">
                <label className={`text-sm font-semibold ${textMain}`}>Background</label>
                <div className={`flex items-center gap-2 p-2 border rounded-lg ${isDarkMode ? "border-zinc-700 bg-zinc-900" : "bg-white"}`}>
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 cursor-pointer bg-transparent border-none" />
                    <span className={`text-xs font-mono ${textSub}`}>{bgColor}</span>
                </div>
            </div>
        </div>

        {/* 5. Logo */}
        <div className="space-y-2">
             <label className={`text-sm font-semibold flex items-center gap-2 ${textMain}`}>
                <Upload size={16} /> Brand Logo
            </label>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className={`block w-full text-sm ${textSub}
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                `}
            />
        </div>
      </div>

      {/* --- RIGHT PANEL: Preview --- */}
      <div className={`w-full md:w-7/12 flex flex-col items-center justify-center p-8 rounded-2xl border ${cardClass} relative`}>
        
        <div className={`p-8 rounded-xl shadow-lg mb-8 bg-white transition-all duration-300`}>
             {/* This div is where the library injects the canvas/svg */}
             <div ref={ref} />
        </div>

        {/* Download Actions */}
        <div className="flex gap-3 w-full max-w-sm">
            <button
                onClick={() => onDownloadClick('png')}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30"
            >
                <Download size={18} /> PNG
            </button>
             <button
                onClick={() => onDownloadClick('svg')}
                className={`flex-1 flex items-center justify-center gap-2 border py-3 px-6 rounded-xl font-bold transition-all ${isDarkMode ? "border-zinc-600 text-gray-200 hover:bg-zinc-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
            >
                <Download size={18} /> SVG
            </button>
        </div>
        
        <button
            onClick={() => {
                setUrl('https://Daplink.online');
                setColor('#2563eb');
                setDotType('rounded');
                setCornerType('extra-rounded');
                setLogo(null);
            }}
            className={`mt-6 flex items-center gap-2 text-sm ${textSub} hover:text-blue-500 transition-colors`}
        >
            <RefreshCcw size={14} /> Reset to Defaults
        </button>

      </div>
    </div>
  );
}