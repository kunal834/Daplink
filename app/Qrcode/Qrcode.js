'use client';

import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Upload, RefreshCcw, Settings, Link as LinkIcon } from 'lucide-react';

export default function QRGenerator({ isDarkMode }) {
  const [url, setUrl] = useState('https://example.com');
  const [size, setSize] = useState(300);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');
  const [logoSrc, setLogoSrc] = useState(null);
  const [includeMargin, setIncludeMargin] = useState(true);

  // Handle Logo Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Download
  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'custom-qr-code.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  // Helper classes for conditional styling
  const cardClass = isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-100";
  const textMain = isDarkMode ? "text-gray-100" : "text-gray-800";
  const textSub = isDarkMode ? "text-gray-400" : "text-gray-500";
  const inputClass = isDarkMode 
    ? "bg-zinc-900 border-zinc-700 text-gray-100 focus:ring-blue-500 placeholder-gray-500" 
    : "bg-white border-gray-200 text-gray-900 focus:ring-blue-500 placeholder-gray-400";

  return (
    <div className={`flex flex-col md:flex-row gap-8 p-6 max-w-6xl mx-auto min-h-screen rounded-xl transition-colors duration-300 ${isDarkMode ? "bg-zinc-900" : "bg-gray-50"}`}>
      
      {/* LEFT: Controls Panel */}
      <div className={`w-full md:w-1/2 space-y-6 p-6 rounded-2xl shadow-sm border ${cardClass}`}>
        <div className={`border-b pb-4 ${isDarkMode ? "border-zinc-700" : "border-gray-100"}`}>
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${textMain}`}>
            <Settings className="w-6 h-6 text-blue-600" />
            Configuration
          </h2>
          <p className={`${textSub} text-sm mt-1`}>Customize your QR code details and appearance.</p>
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <label className={`text-sm font-medium flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <LinkIcon size={16} /> Content / URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${inputClass}`}
            placeholder="Enter URL or text"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Foreground Color</label>
            <div className={`flex items-center gap-3 p-2 border rounded-lg ${isDarkMode ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"}`}>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
              />
              <span className={`text-xs font-mono ${textSub}`}>{fgColor}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Background Color</label>
            <div className={`flex items-center gap-3 p-2 border rounded-lg ${isDarkMode ? "border-zinc-700 bg-zinc-900" : "border-gray-200 bg-white"}`}>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
              />
              <span className={`text-xs font-mono ${textSub}`}>{bgColor}</span>
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-2">
          <label className={`text-sm font-medium flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <Upload size={16} /> {`Logo Overlay (Optional)`}
          </label>
          <div className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${isDarkMode ? "border-zinc-600 hover:bg-zinc-700" : "border-gray-300 hover:bg-gray-50"}`}>
             <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {logoSrc ? (
              <div className="flex items-center justify-center gap-2 text-green-500">
                <span className="text-sm font-medium">Logo Uploaded</span>
                <button 
                  onClick={(e) => { e.preventDefault(); setLogoSrc(null); }}
                  className="text-xs underline text-red-500 z-10 relative"
                >
                  Remove
                </button>
              </div>
            ) : (
              <span className={`text-sm ${textSub}`}>Click to upload a logo (PNG/JPG)</span>
            )}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between">
                    <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Size (px)</label>
                    <span className={`text-xs ${textSub}`}>{size}px</span>
                </div>
                <input
                    type="range"
                    min="128"
                    max="500"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
            </div>
            
            <div className="flex items-center gap-2 mt-4">
                <input 
                    type="checkbox" 
                    id="margin"
                    checked={includeMargin}
                    onChange={(e) => setIncludeMargin(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="margin" className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Include White Margin</label>
            </div>
        </div>
      </div>

      {/* RIGHT: Preview Panel */}
      <div className={`w-full md:w-1/2 flex flex-col items-center justify-center p-6 rounded-2xl shadow-sm border relative ${cardClass}`}>
        <div className="absolute top-4 right-4">
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                Live Preview
            </div>
        </div>

        {/* The Actual QR Component */}
        <div className={`p-4 border-2 rounded-xl shadow-lg mb-8 ${isDarkMode ? "bg-white border-zinc-600" : "bg-white border-gray-100"}`}>
           {/* Note: The QR container background is intentionally kept white (or based on QR settings) 
               so the QR code remains readable regardless of the dark mode setting of the app */}
            <QRCodeCanvas
                id="qr-canvas"
                value={url}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                includeMargin={includeMargin}
                level={"H"}
                imageSettings={logoSrc ? {
                    src: logoSrc,
                    x: undefined,
                    y: undefined,
                    height: size * 0.2,
                    width: size * 0.2,
                    excavate: true,
                } : undefined}
            />
        </div>

        {/* Actions */}
        <div className="flex gap-4 w-full max-w-xs">
          <button
            onClick={downloadQR}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-lg shadow-blue-200"
          >
            <Download size={18} />
            Download PNG
          </button>
          <button
            onClick={() => {
                setUrl('https://example.com');
                setFgColor('#000000');
                setBgColor('#ffffff');
                setLogoSrc(null);
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${isDarkMode ? "bg-zinc-700 hover:bg-zinc-600 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            title="Reset"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}