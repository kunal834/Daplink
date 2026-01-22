"use client";

import { useState, useEffect } from "react";

import GoalStep from "./GoalStep";
import UsernameStep from "./UsernameStep";
import ProfileStep from "./ProfileStep";
import PlatformStep from "./PlatformStep";
import ThemeStep from "./ThemeStep";
import PublishStep from "./PublishStep";
import LinksStep from "./LinkStep";

const STEPS = {
  GOALS: 0,
  USERNAME: 1,
  PROFILE: 2,
  PLATFORMS: 3,
  LINKS: 4,
  THEME: 5,
  PUBLISH: 6,
  PRICING: 7
};

export default function OnboardingPage() {
  const [step, setStep] = useState(STEPS.GOALS);

  const [formData, setFormData] = useState({
    goal: null,
    username: "",
    displayName: "",
    bio: "",
    avatar: null,
    platforms: [],
    links: {},
    theme: { id: "classic", color: "bg-white" }
  });

  const update = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const togglePlatform = (id) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(id)
        ? prev.platforms.filter((p) => p !== id)
        : [...prev.platforms, id]
    }));
  };

  const setLink = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      links: { ...prev.links, [id]: value }
    }));
  };

  return (
    <main className="min-h-screen max-w-md mx-auto px-6 pt-12 pb-24">
      {step === STEPS.GOALS && (
        <GoalStep
          step={step}
          goal={formData.goal}
          setGoal={(v) => update("goal", v)}
          onNext={() => setStep(STEPS.USERNAME)}
        />
      )}

      {step === STEPS.USERNAME && (
        <UsernameStep
          step={step}
          username={formData.username}
          setUsername={(v) => update("username", v)}
          isValid={formData.username.length > 2}
          isChecking={false}
          onBack={() => setStep(STEPS.GOALS)}
          onNext={() => setStep(STEPS.PROFILE)}
        />
      )}

      {step === STEPS.PROFILE && (
        <ProfileStep
          step={step}
          displayName={formData.displayName}
          bio={formData.bio}
          avatar={formData.avatar}
          setDisplayName={(v) => update("displayName", v)}
          setBio={(v) => update("bio", v)}
          setAvatar={(v) => update("avatar", v)}
          onBack={() => setStep(STEPS.USERNAME)}
          onNext={() => setStep(STEPS.PLATFORMS)}
        />
      )}

      {step === STEPS.PLATFORMS && (
        <PlatformStep
          step={step}
          selected={formData.platforms}
          toggle={togglePlatform}
          onBack={() => setStep(STEPS.PROFILE)}
          onNext={() => setStep(STEPS.LINKS)}
        />
      )}

      {step === STEPS.LINKS && (
        <LinksStep
          step={step}
          platforms={formData.platforms}
          links={formData.links}
          setLink={setLink}
          onBack={() => setStep(STEPS.PLATFORMS)}
          onNext={() => setStep(STEPS.THEME)}
        />
      )}

      {step === STEPS.THEME && (
        <ThemeStep
          step={step}
          themes={[
            { id: "classic", color: "bg-white" },
            { id: "dark", color: "bg-slate-900" }
          ]}
          selected={formData.theme}
          setTheme={(t) => update("theme", t)}
          onBack={() => setStep(STEPS.LINKS)}
          onNext={() => setStep(STEPS.PUBLISH)}
        />
      )}

      {step === STEPS.PUBLISH && (
        <PublishStep
          username={formData.username}
          theme={formData.theme}
          onBack={() => setStep(STEPS.THEME)}
          // onNext={() => setStep(STEPS.PRICING)}
          onComplete={() => window.location.href = "/Dashboard"}
        />
      )}

    </main>
  );
}
