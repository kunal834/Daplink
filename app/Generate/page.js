"use client";

import React, { useEffect, useState } from "react";

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
import axios from "axios";
import SuccessStep from "./SuccessStep";

const STEPS = {
  GOALS: 0,
  USERNAME: 1,
  PROFILE: 2,
  PLATFORMS: 3,
  LINKS: 4,
  THEME: 5,
  PUBLISH: 6,
  SUCCESS: 7
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

  /* ---------------- HELPERS ---------------- */

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

  /* ---------------- ACTIONS ---------------- */

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

  useEffect(() => {
    const syncStep = async () => {
      const res = await axios.get("/api/onboarding/status");
      if (!res) return;

      const data = await res.data;

      if (data.completed) {
        window.location.href = "/dashboard";
        return;
      }
      setStep(data.step);
    };
    syncStep();
  }, []);

  useEffect(() => {
    if (step === STEPS.PUBLISH) {
      const t = setTimeout(() => {
        setStep(STEPS.SUCCESS);
      }, 2500);

      return () => clearTimeout(t);
    }
  }, [step]);



  return (
    <div
      className={
        step === STEPS.SUCCESS
          ? "min-h-screen bg-white"
          : "fixed inset-0 bg-white overflow-hidden"
      }
    >

      {error && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-bold text-red-600 shadow-lg">
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
          onNext={() => setStep(STEPS.PUBLISH)}
        />
      )}

      {step === STEPS.PUBLISH && (
        <PublishStep username={formData.handle} />
      )}

      {step === STEPS.SUCCESS && (
        <SuccessStep
          data={formData}
          onContinue={() => router.push("/Dashboard")}
        />
      )}

    </div>
  );
}
