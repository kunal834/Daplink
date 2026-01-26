import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Check, Star, ChevronRight } from "lucide-react";

const SuccessStep = ({ data, onContinue }) => {
  useEffect(() => {
    // Subtle premium confetti burst
    confetti({
      particleCount: 120,
      spread: 70,
      startVelocity: 35,
      gravity: 0.9,
      scalar: 0.9,
      ticks: 200,
      origin: { y: 0.3 },
      colors: ["#0f172a", "#334155", "#64748b", "#94a3b8"]
    });
  }, []);
console.log(data);
  return (
    <div className="w-full min-h-screen bg-white">

      <div className="max-w-xl mx-auto px-6 pt-24 pb-16">

        {/* Success Icon */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl ring-8 ring-slate-50">
              <Check size={64} strokeWidth={4} />
            </div>
            <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-xl">
              <Star size={24} className="text-amber-400 fill-amber-400" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tight mb-4 text-slate-900">
            It’s ready.
          </h1>
          <p className="text-lg text-slate-500 font-bold uppercase tracking-widest">
            daplink.online/{data.username}
          </p>
        </div>

        {/* Phone Preview */}
        <div className="flex justify-center mb-20">
          <div
            className={`w-full max-w-[300px] aspect-[9/18.5] rounded-[3.5rem] p-10
            shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)]
            border-[12px] border-black
            ${data.theme.color} ${data.theme.text}
            relative overflow-hidden`}
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-3xl z-10" />

            <div className="space-y-10 mt-6">
              <div className="flex flex-col items-center gap-6">
                <div className="w-24 h-24 rounded-[2.5rem] bg-white/10 flex items-center justify-center overflow-hidden">
                  {data.avatar ? (
                    <img
                      src={data.profile}
                      className="w-full h-full object-cover rounded-[2rem]"
                    />
                  ) : (
                    <span className="text-4xl font-black">
                      {data.displayName?.[0] || data.username[0]}
                    </span>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-80">
                    @{data.handle}
                  </p>
                  <p className="text-[11px] opacity-60 mt-3 font-bold max-w-[140px] leading-relaxed line-clamp-2">
                    {data.script || "Professional Bio"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {data.platforms.slice(0, 3).map((p) => (
                  <div
                    key={p}
                    className={`w-full py-4 rounded-2xl border ${data.theme.border}
                    bg-white/5 backdrop-blur-md text-[10px]
                    font-black uppercase tracking-[0.2em] text-center`}
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={onContinue}
            className="w-full py-6 bg-slate-900 text-white rounded-[2rem]
            font-black text-2xl shadow-2xl hover:bg-black transition-all
            flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default SuccessStep;
