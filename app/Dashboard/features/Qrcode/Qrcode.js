'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import QRCodeStyling from 'qr-code-styling'; 
import { 
  Upload, RefreshCcw, Link as LinkIcon,
  Layers, Square, Circle, Sparkles, Wand2,
  History, Trash2, Edit3, Download, Type,
  PlusCircle, FolderOpen
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

// --- Helper Component to Render Gallery Previews ---
const QRThumb = ({ options }) => {
  const thumbRef = useRef(null);
  const qrThumb = useRef(null);

  useEffect(() => {
    qrThumb.current = new QRCodeStyling({
      ...options,
      width: 150,
      height: 150,
    });
    
    if (thumbRef.current) {
      thumbRef.current.innerHTML = "";
      qrThumb.current.append(thumbRef.current);
    }
  }, []);

  useEffect(() => {
    if (qrThumb.current) {
      qrThumb.current.update({ ...options, width: 150, height: 150 });
    }
  }, [options]);

  return <div ref={thumbRef} className="scale-75 origin-center" />;
};

export default function AdvancedQRGenerator({ isDarkMode = false }) {
  const [title, setTitle] = useState('My Awesome QR');
  const [url, setUrl] = useState('https://Daplink.online/your-link');
  const [logo, setLogo] = useState(null);
  const [dotColor, setDotColor] = useState('#2563eb');
  const [dotGradient, setDotGradient] = useState(true);
  const [dotColor2, setDotColor2] = useState('#7c3aed');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrShape, setQrShape] = useState('square'); 
  const [dotType, setDotType] = useState('extra-rounded'); 
  const [cornerType, setCornerType] = useState('extra-rounded'); 
  const [cornerDotType, setCornerDotType] = useState('dot'); 

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  const qrCode = useRef(null);
  const ref = useRef(null);

  const options = useMemo(() => ({
    width: 300,
    height: 300,
    type: 'svg',
    data: url,
    image: logo,
    shape: qrShape,
    dotsOptions: {
      type: dotType,
      gradient: dotGradient ? {
        type: 'linear', rotation: 45,
        colorStops: [{ offset: 0, color: dotColor }, { offset: 1, color: dotColor2 }]
      } : undefined,
      color: !dotGradient ? dotColor : undefined
    },
    backgroundOptions: { color: bgColor },
    imageOptions: { crossOrigin: 'anonymous', margin: 8, imageSize: 0.4 },
    cornersSquareOptions: { color: dotColor, type: cornerType },
    cornersDotOptions: { color: dotColor, type: cornerDotType }
  }), [url, logo, qrShape, dotType, dotGradient, dotColor, dotColor2, bgColor, cornerType, cornerDotType]);

  // Fetch History from Backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/getQrcode');
        if (response.data.success) {
          setHistory(response.data.qrs);
        }
      } catch (error) {
        console.error("Failed to fetch QR history", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  // Update QR Styling Instance
  useEffect(() => {
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling(options);
      qrCode.current.append(ref.current);
    } else {
      qrCode.current.update(options);
    }
  }, [options]);

  const saveToHistory = async () => {
    const payload = {
      title, url,
      config: { dotColor, dotColor2, dotGradient, bgColor, qrShape, dotType, cornerType, cornerDotType, logo }
    };
   console.log("Saving QR code with payload:", payload);
    try {
      const response = await axios.post('/api/qrcode', payload);
      console.log("Save response:", response);
      if (response.data.success) {
        setHistory([response.data.qr, ...history]);
        toast.success("Design saved to cloud gallery!");
      }
    } catch (error) {
      // Logic for Free Limit hit (Backend sends 403)
      if (error.response?.status === 403) {
        toast.error("Free limit reached! Upgrade to Pro to save more QR codes.");
      } else {
        toast.error(error.response?.data?.error || "Error saving design.");
      }
    }
  };

  const deleteFromHistory = async (id) => {
    if (!window.confirm("Delete this QR code?")) return;
    try {
      const response = await axios.delete(`/api/qrcode?id=${id}`);
      if (response.data.success) {
        setHistory(history.filter(item => item._id !== id));
        toast.success("Removed from gallery");
      }
    } catch (error) {
      toast.error("Failed to delete.");
    }
  };

  const loadFromHistory = (item) => {
    const cfg = item.config;
    setTitle(item.title || "Untitled QR");
    setUrl(item.url);
    setDotColor(cfg.dotColor);
    setDotColor2(cfg.dotColor2 || cfg.dotColor);
    setDotGradient(cfg.dotGradient);
    setBgColor(cfg.bgColor);
    setQrShape(cfg.qrShape);
    setDotType(cfg.dotType);
    setCornerType(cfg.cornerType);
    setCornerDotType(cfg.cornerDotType);
    setLogo(cfg.logo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDownloadClick = (extension) => {
    qrCode.current?.download({ extension, name: title || "daplink_qr" });
  };

  const cardClass = isDarkMode ? "bg-zinc-900/50 border-zinc-800 backdrop-blur-md" : "bg-white/70 border-gray-200 backdrop-blur-md";
  const textMain = isDarkMode ? "text-white" : "text-zinc-900";

  return (
    <div className="h-full flex flex-col gap-6 p-4 transition-all duration-500 overflow-x-hidden overflow-y-auto scrollbar-hide">
      
      <style jsx global>{` .scrollbar-hide::-webkit-scrollbar { display: none; } `}</style>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* --- LEFT PANEL: CONTROLS --- */}
        <div className={`w-full lg:w-5/12 space-y-6 p-6 md:p-8 rounded-[32px] border shadow-2xl transition-all ${cardClass}`}>
          <header className="flex items-center justify-between">
            <h2 className={`text-3xl font-black tracking-tight ${textMain}`}>QR <span className="text-blue-600">Studio</span></h2>
            <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-600"><Wand2 size={24} /></div>
          </header>

          <section className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-2"><Type size={14} /> Design Title</label>
            <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className={`w-full p-3 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`} 
                placeholder="Enter title..." 
            />
          </section>

          <section className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-2"><LinkIcon size={14} /> Destination Link</label>
            <input 
                type="text" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                className={`w-full p-3 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`} 
                placeholder="https://..."
            />
          </section>

          {/* Pattern Engine */}
          <section className="space-y-3">
            <label className="text-xs uppercase tracking-widest font-bold text-zinc-400">Pattern Engine</label>
            <div className="grid grid-cols-3 gap-2">
              {['square', 'dots', 'rounded', 'extra-rounded', 'classy'].map((type) => (
                <button 
                    key={type} 
                    onClick={() => setDotType(type)} 
                    className={`py-2 text-[10px] border rounded-lg font-bold uppercase transition-all ${dotType === type ? 'bg-blue-600 text-white border-blue-600' : 'text-zinc-500 border-zinc-200 hover:border-blue-400'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          <section className="p-5 rounded-[24px] bg-gradient-to-br from-blue-600 to-purple-600 text-white relative overflow-hidden shadow-lg">
            <label className="text-[10px] uppercase font-black flex items-center gap-2 mb-3"><Sparkles size={14} /> Branding</label>
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 cursor-pointer hover:bg-white/30 transition-all">
                <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setLogo(ev.target.result);
                        reader.readAsDataURL(file);
                    }
                }} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Upload size={20} />
              </div>
              <p className="text-xs font-bold">Logo Overlay</p>
            </div>
          </section>
        </div>

        {/* --- RIGHT PANEL: PREVIEW --- */}
        <div className={`w-full lg:w-7/12 flex flex-col items-center justify-center p-8 rounded-[40px] border relative ${cardClass}`}>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 blur-[80px]" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500 blur-[80px]" />
          </div>

          <div className="relative group">
            <div className="relative z-10 p-6 rounded-[32px] shadow-2xl bg-white transition-all duration-500 hover:scale-[1.02]">
              <div ref={ref} />
            </div>
          </div>

          <div className="mt-8 flex gap-3 w-full max-w-md relative z-10">
            <button 
                onClick={() => onDownloadClick('png')} 
                className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-xs tracking-widest hover:shadow-lg active:scale-95 transition-all"
            >
              DOWNLOAD PNG
            </button>
            <button 
                onClick={saveToHistory} 
                className="flex-1 py-4 border-2 border-blue-600 text-blue-600 rounded-2xl font-bold text-xs tracking-widest hover:bg-blue-50 active:scale-95 transition-all"
            >
              SAVE TO GALLERY
            </button>
          </div>
        </div>
      </div>

      {/* --- GALLERY SECTION --- */}
      <section className={`w-full p-8 rounded-[32px] border mb-10 ${cardClass}`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className={`text-2xl font-black flex items-center gap-3 ${textMain}`}>
              <History className="text-blue-600" /> Stored QR Library
            </h3>
            <p className="text-zinc-500 text-sm mt-1">Manage your cloud-saved designs</p>
          </div>
          <span className="px-4 py-1 bg-blue-600/10 text-blue-600 rounded-full text-xs font-bold">
            {history?.length || 0} Items Saved
          </span>
        </div>

        {loadingHistory ? (
          <div className="py-20 flex justify-center"><RefreshCcw className="animate-spin text-blue-600" size={32} /></div>
        ) : !history || history.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[32px]">
            <FolderOpen size={48} className="text-zinc-300 mb-4" />
            <h4 className={`text-xl font-bold ${textMain}`}>No saved codes</h4>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-4 text-blue-600 font-bold flex items-center gap-2 hover:underline">
              <PlusCircle size={18} /> Create your first design
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {history.map((item) => (
              <div key={item._id} className={`group relative p-4 rounded-[28px] border transition-all hover:shadow-2xl ${isDarkMode ? 'bg-zinc-800/40 border-zinc-700' : 'bg-white border-zinc-100'}`}>
                <div className="aspect-square bg-white rounded-2xl mb-4 flex items-center justify-center overflow-hidden border border-zinc-100">
                   <QRThumb options={{
                     ...options, data: item.url, image: item.config.logo,
                     dotsOptions: { ...options.dotsOptions, type: item.config.dotType, color: item.config.dotColor }
                   }} />
                </div>
                <div className="space-y-1 px-1">
                  <p className={`text-sm font-black truncate ${textMain}`}>{item.title || "Untitled"}</p>
                  <p className="text-[10px] text-blue-600 font-bold truncate">{item.url}</p>
                </div>
                <div className="absolute inset-0 bg-blue-600/90 rounded-[28px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button onClick={() => loadFromHistory(item)} className="p-3 bg-white text-blue-600 rounded-xl hover:scale-110 shadow-lg"><Edit3 size={18} /></button>
                  <button onClick={() => deleteFromHistory(item._id)} className="p-3 bg-white text-red-600 rounded-xl hover:scale-110 shadow-lg"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}