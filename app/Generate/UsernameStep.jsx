import { AtSign, Check } from "lucide-react";
import StepWrapper from "@/Components/ui/StepWrapper";

const UsernameStep = ({
  step,
  username,
  setUsername,
  isValid,
  isChecking,
  onNext,
  onBack
}) => {
  return (
    <StepWrapper
      step={step}
      title="Claim your username"
      subtitle="This will be your public DapLink URL."
      onContinue={onNext}
      onBack={onBack}
      continueDisabled={!isValid || isChecking}
    >
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black flex items-center gap-1">
          <AtSign size={16} />
          <span className="text-sm">daplink.bio/</span>
        </div>

        <input
          autoFocus
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
            )
          }
          placeholder="username"
          className={`w-full pl-[110px] pr-12 py-5 rounded-2xl border-2 font-black outline-none transition-all
            ${
              isValid
                ? "border-green-500 bg-green-50"
                : "border-slate-100 focus:border-purple-600"
            }`}
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isChecking && (
            <div className="w-5 h-5 border-2 border-slate-200 border-t-purple-600 rounded-full animate-spin" />
          )}
          {isValid && !isChecking && (
            <div className="bg-green-500 text-white p-1 rounded-full">
              <Check size={12} />
            </div>
          )}
        </div>
      </div>
    </StepWrapper>
  );
};

export default UsernameStep;
