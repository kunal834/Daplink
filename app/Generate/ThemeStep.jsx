import { Check } from "lucide-react";
import StepWrapper from "@/Components/ui/StepWrapper";

const ThemeStep = ({ step, themes, selected, setTheme, onNext, isSaving, onBack ,isSyncing}) => {
  return (
    <StepWrapper
      step={step}
      title="Pick your style."
      subtitle="Choose how your page will look."
      onContinue={onNext}
      isSaving={isSaving}
      isLocked={isSyncing}
      onBack={onBack}
    >
      <div className="w-full max-w-[640px] mx-auto grid grid-cols-2 gap-5">

        {themes.map((t) => {
          const isSelected = selected.id === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setTheme(t)}
              className={`relative h-40 rounded-[2.5rem] border-2 overflow-hidden transition-all
                ${
                  isSelected
                    ? "border-slate-900 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.25)] scale-[1.02]"
                    : "border-slate-100 hover:border-slate-300 hover:shadow-lg"
                }
              `}
            >
              {/* Theme preview */}
              <div className={`absolute inset-0 ${t.color}`} />

              {/* Fake content preview */}
              <div className="relative z-10 p-6 space-y-3 opacity-90">
                <div className="w-full h-3 rounded-full bg-white/30" />
                <div className="w-4/5 h-3 rounded-full bg-white/30" />
                <div className="w-3/5 h-3 rounded-full bg-white/30" />
              </div>

              {/* Selected overlay */}
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                  <div className="bg-white p-4 rounded-[1.5rem] shadow-xl animate-in zoom-in">
                    <Check size={24} strokeWidth={3} className="text-slate-900" />
                  </div>
                </div>
              )}

              {/* Theme name */}
              <div
                className={`absolute bottom-5 left-0 right-0 text-center text-[10px] font-black uppercase tracking-[0.25em]
                  ${
                    isSelected ? "text-slate-900" : "text-slate-300"
                  }
                `}
              >
                {t.id}
              </div>
            </button>
          );
        })}

      </div>
    </StepWrapper>
  );
};

export default ThemeStep;
