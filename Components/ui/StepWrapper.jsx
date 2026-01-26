import { ArrowLeft } from "lucide-react";

const StepWrapper = ({
  step,
  title,
  subtitle,
  children,
  onContinue,
  onBack,
  continueDisabled = false,
  skipLabel
}) => {
  return (
    <div className="fixed inset-0 bg-white">
      <div className="h-full w-full max-w-[720px] mx-auto px-8 flex flex-col">


        {/* Title */}
        <div className="mt-8 mb-10 text-center">
          {/* skip and back button */}
          <div className="h-16 flex items-center justify-between">
            <button
              onClick={onBack}
              className={`p-3 rounded-2xl transition
              ${step === 0 ? "invisible" : "hover:bg-slate-100"}
            `}
            >
              <ArrowLeft size={22} className="text-slate-700" />
            </button>

            {skipLabel && (
              <button
                onClick={onContinue}
                className="text-sm font-black uppercase tracking-widest text-slate-400"
              >
                {skipLabel}
              </button>
            )}
          </div>
          <h1 className="text-4xl font-black text-slate-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-slate-500 mt-3 max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex items-start justify-center pt-4">
          {children}
        </div>

        {/* Footer */}
        <div className="pt-6 pb-8">
          <button
            disabled={continueDisabled}
            onClick={onContinue}
            className={`w-full py-5 rounded-3xl font-black text-xl transition
              ${continueDisabled
                ? "bg-slate-200 text-slate-400"
                : "bg-slate-900 text-white hover:bg-black active:scale-[0.97]"
              }
            `}
          >
            {step === 5 ? "Launch My Page" : "Continue"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default StepWrapper;
