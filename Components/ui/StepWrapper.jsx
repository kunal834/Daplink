import { ArrowLeft } from "lucide-react";

const StepWrapper = ({
  step,
  title,
  totalSteps = 6,
  isLocked,
  subtitle,
  children,
  onContinue,
  onBack,
  isSaving,
  continueDisabled = false,
  skipLabel,
  SkipClick
}) => {
  const currentStep = step + 1;
  const remainingSteps = totalSteps - currentStep;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  // console.log(SkipClick);
  return (

    <div className="fixed inset-0 bg-white">
      {/* LOCK OVERLAY */}
      {isLocked && (
        <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center">
          <span className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div
        className={`h-full w-full max-w-[720px] mx-auto px-8 flex flex-col ${isLocked ? "pointer-events-none" : ""
          }`}
      >
        {/* Header */}
        <div className="mt-8 mb-6 text-center">
          <div className="h-16 flex items-center justify-between">
            <button
              onClick={onBack}
              className={`p-3 rounded-2xl transition ${step === 0 ? "invisible" : "hover:bg-slate-100"
                }`}
            >
              <ArrowLeft size={22} className="text-slate-700" />
            </button>

            {skipLabel && (
              <button
                onClick={SkipClick || onContinue}
                className="text-sm font-black uppercase tracking-widest text-slate-400"
              >
                {skipLabel}
              </button>
            )}
          </div>

          <h1 className="text-4xl font-black text-slate-900">{title}</h1>

          {subtitle && (
            <p className="text-lg text-slate-500 mt-3 max-w-xl mx-auto">
              {subtitle}
            </p>
          )}

          {/* STEP INDICATOR */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${i <= step
                  ? "w-6 bg-slate-900"
                  : "w-2 bg-slate-300"
                  }`}
              />
            ))}
          </div>

        </div>

        {/* Content */}
        <div className="flex-1 flex items-start justify-center pt-4 text-black">
          {children}
        </div>

        {/* Footer */}
        <div className="pt-6 pb-8">
          <button
            disabled={continueDisabled || isLocked}
            onClick={onContinue}
            className={`w-full py-5 rounded-3xl font-black text-xl transition ${continueDisabled || isLocked
              ? "bg-slate-200 text-slate-400"
              : "bg-slate-900 text-white hover:bg-black active:scale-[0.97]"
              }`}
          >
            {step === totalSteps - 1 ? "Launch My Page" : "Continue"}

            {isSaving && (
              <span className="ml-3 inline-block w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            )}
          </button>
        </div>
      </div>
    </div>


  );
};

export default StepWrapper;
