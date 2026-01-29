"use client";

import React from "react";
import { Instagram, Globe } from "lucide-react";
import StepWrapper from "@/Components/ui/StepWrapper";
import {
  FiFacebook,
  FiLinkedin,
  FiTwitch,
  FiTwitter,
  FiYoutube
} from "react-icons/fi";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: Instagram },
  { id: "twitter", name: "Twitter", icon: FiTwitter },
  { id: "youtube", name: "YouTube", icon: FiYoutube },
  { id: "twitch", name: "Twitch", icon: FiTwitch },
  { id: "facebook", name: "Facebook", icon: FiFacebook },
  { id: "linkedin", name: "LinkedIn", icon: FiLinkedin },
  { id: "website", name: "Website", icon: Globe }
];

const PlatformStep = ({
  step,
  selected,
  toggle,
  onNext,
  onSkip,
  isSyncing,
  onBack
}) => {
  return (
    <StepWrapper
      step={step}
      title="Where are you active?"
      subtitle="Choose up to 5 platforms."
      onContinue={onNext}
      onBack={onBack}
      isLocked={isSyncing}
      continueDisabled={selected.length === 0}
      skipLabel="Skip"
      SkipClick={onSkip}
    >
      <div className="w-full max-w-[560px] mx-auto grid grid-cols-2 gap-4">

        {PLATFORMS.map((p) => {
          const isSelected = selected.includes(p.id);

          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`flex items-center gap-4 p-5 rounded-[1.75rem] border-2 transition-all
                ${
                  isSelected
                    ? "border-slate-900 bg-white shadow-md"
                    : "border-slate-100 bg-white hover:border-slate-200"
                }
              `}
            >
              {/* Icon */}
              <div
                className={`p-3 rounded-xl transition
                  ${
                    isSelected
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600"
                  }
                `}
              >
                <p.icon size={20} />
              </div>

              {/* Name */}
              <span className="font-black text-sm text-slate-900">
                {p.name}
              </span>
            </button>
          );
        })}

      </div>
    </StepWrapper>
  );
};

export default PlatformStep;
