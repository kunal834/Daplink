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
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${
            step === 0 ? "invisible" : ""
          }`}
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>

        {skipLabel && (
          <button
            onClick={onContinue}
            className="text-sm font-black text-purple-600 px-2 py-1 hover:bg-purple-50 rounded-lg"
          >
            {skipLabel}
          </button>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-black text-slate-900 mb-2">
        {title}
      </h1>
      <p className="text-slate-500 mb-8 font-medium">
        {subtitle}
      </p>

      {/* Content */}
      <div className="flex-grow">{children}</div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white py-6 border-t">
        <button
          disabled={continueDisabled}
          onClick={onContinue}
          className={`w-full py-4 rounded-full font-black text-white transition-all active:scale-95
            ${
              continueDisabled
                ? "bg-slate-200 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 shadow-lg"
            }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StepWrapper;
