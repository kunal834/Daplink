import { Check } from "lucide-react";
import StepWrapper from "@/Components/ui/StepWrapper";

const ThemeStep = ({ step, themes, selected, setTheme, onNext, onBack }) => {
  return (
    <StepWrapper
      step={step}
      title="Choose a theme"
      subtitle="You can change this later."
      onContinue={onNext}
      onBack={onBack}
    >
      <div className="grid grid-cols-2 gap-3">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t)}
            className={`h-24 rounded-2xl border-2 relative ${
              selected.id === t.id ? "border-purple-600" : "border-slate-100"
            }`}
          >
            <div className={`w-full h-full ${t.color}`} />
            {selected.id === t.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="text-white bg-purple-600 rounded-full p-1" />
              </div>
            )}
          </button>
        ))}
      </div>
    </StepWrapper>
  );
};

export default ThemeStep;
