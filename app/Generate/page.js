"use client";

import React, { useState } from "react";

import GoalStep from "./GoalStep";
import UsernameStep from "./UsernameStep";
import ProfileStep from "./ProfileStep";
import PlatformStep from "./PlatformStep";
import LinksStep from "./LinkStep";
import ThemeStep from "./ThemeStep";
import PublishStep from "./PublishStep";

import {
  checkUsername,
  saveUsername,
  saveProfile,
  saveLinks,
  saveTheme,
  completeOnboarding
} from "@/lib/api/onboarding";

const STEPS = {
  GOALS: 0,
  USERNAME: 1,
  PROFILE: 2,
  PLATFORMS: 3,
  LINKS: 4,
  THEME: 5,
  PUBLISH: 6
};

export default function OnboardingPage() {
  const [step, setStep] = useState(STEPS.GOALS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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


  // USERNAME
  const handleUsernameNext = async () => {
    try {
      setLoading(true);
      setError("");

      const { available } = await checkUsername(formData.username);
      if (!available) {
        setError("Username already taken");
        return;
      }

      await saveUsername(formData.username);
      setStep(STEPS.PROFILE);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // PROFILE
  const handleProfileNext = async () => {
    try {
      setLoading(true);
      setError("");

      await saveProfile({
        profile: formData.avatar,
        script: formData.bio,
        profession: formData.goal
      });

      setStep(STEPS.PLATFORMS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // LINKS
  const handleLinksNext = async () => {
    try {
      setLoading(true);
      setError("");

      const formattedLinks = Object.entries(formData.links).map(
        ([platform, url]) => ({
          link: url,
          linktext: platform
        })
      );

      await saveLinks(formattedLinks);
      setStep(STEPS.THEME);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // THEME
  const handleThemeNext = async () => {
    try {
      setLoading(true);
      setError("");

      await saveTheme(formData.theme.id);
      setStep(STEPS.PUBLISH);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // FINAL PUBLISH
  const handlePublish = async () => {
    try {
      setLoading(true);
      setError("");

      await completeOnboarding();
      window.location.href = "/Dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const CheckUsername = async (username) => {
    try {
      setLoading(true);
      setError("");
      const { available } = await checkUsername(username);
      return available;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <main className="min-h-screen max-w-md mx-auto px-6 pt-12 pb-24">
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

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
          // isValid={CheckUsername}
          isChecking={loading}
          onBack={() => setStep(STEPS.GOALS)}
          onNext={handleUsernameNext}
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
          onNext={handleProfileNext}
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
          onNext={handleLinksNext}
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
          onNext={handleThemeNext}
        />
      )}

      {step === STEPS.PUBLISH && (
        <PublishStep
          username={formData.username}
          theme={formData.theme}
          loading={loading}
          onBack={() => setStep(STEPS.THEME)}
          onComplete={handlePublish}
        />
      )}
    </main>
  );
}
