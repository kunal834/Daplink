"use client";

import { Check, X } from "lucide-react";
import StepWrapper from "@/Components/ui/StepWrapper";
import { checkUsername } from "@/lib/api/onboarding";
import { useEffect, useState } from "react";

const UsernameStep = ({
  step,
  username,
  setUsername,
  isChecking,
  isSyncing,
  onNext,
  onBack
}) => {
  const [status, setStatus] = useState("idle");
  // idle | checking | available | taken

  useEffect(() => {
    if (username.length < 3) {
      setStatus("idle");
      return;
    }

    setStatus("checking");

    const timeout = setTimeout(async () => {
      try {
        const { available } = await checkUsername(username);
        setStatus(available ? "available" : "taken");
      } catch {
        setStatus("taken");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [username]);

  const canContinue = status === "available" && !isChecking;

  return (
    <StepWrapper
      step={step}
      title="Claim your username"
      subtitle="This will be your public DapLink URL."
      isLocked={isSyncing}
      onContinue={onNext}
      onBack={onBack}
      continueDisabled={!canContinue}
    >
      {/* Content wrapper keeps things compact */}
      <div className="w-full max-w-[520px] mx-auto">

        {/* Input */}
        <div className="relative">
          {/* Prefix */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black pointer-events-none text-md">
            daplink.online/
          </div>

          <input
            autoFocus
            value={username}
            disabled={isChecking}
            onChange={(e) =>
              setUsername(
                e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && canContinue) {
                onNext();
              }
            }}
            placeholder="username"
            className={`w-full pl-[155px] pr-14 py-6 rounded-3xl border-2 font-black text-lg outline-none transition-all
              ${
                status === "available"
                  ? "border-green-500 bg-green-50"
                  : status === "taken"
                  ? "border-red-500 bg-red-50"
                  : "border-slate-200 focus:border-slate-900 bg-white"
              }
            `}
          />

          {/* Status icon */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            {status === "checking" && (
              <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
            )}
            {status === "available" && (
              <Check size={22} className="text-green-600" />
            )}
            {status === "taken" && (
              <X size={22} className="text-red-600" />
            )}
          </div>
        </div>

        {/* Helper text (tight spacing) */}
        {status === "available" && (
          <p className="mt-4 text-base font-semibold text-green-600 text-center">
            Username is available
          </p>
        )}
        {status === "taken" && (
          <p className="mt-4 text-base font-semibold text-red-600 text-center">
            Username is already taken
          </p>
        )}

      </div>
    </StepWrapper>
  );
};

export default UsernameStep;
