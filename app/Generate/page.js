"use client";

import React, { useCallback, useEffect, useState } from "react";
import GoalStep from "./GoalStep";
import UsernameStep from "./UsernameStep";
import ProfileStep from "./ProfileStep";
import PlatformStep from "./PlatformStep";
import LinksStep from "./LinkStep";
import ThemeStep from "./ThemeStep";
import PublishStep from "./PublishStep";
import { useRouter } from "next/navigation";

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
import { useAuth } from "@/context/Authenticate";

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
  const [userData, setUserData] = useState(null);
  const [isSyncing, setIsSyncing] = useState(true);

  const router = useRouter();
  const { refreshAuth ,loading:authLoading,user} = useAuth();

  if(!user && !authLoading){
    router.replace("/login");
    return null;
  }

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

      await saveUsername({ username: formData.username, profession: formData.goal });
      setStep(STEPS.PROFILE);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // profile step
  const handleProfileNext = async () => {
    try {
      setLoading(true);
      setError("");

      await saveProfile({
        profile: formData.avatar,
        script: formData.bio,
        // profession: formData.goal
      });

      setStep(STEPS.PLATFORMS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // links step
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

  // theme step
  const handleThemeNext = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await saveTheme(formData.theme.id);
      console.log("Theme saved:", data.data);
      setUserData(data.data);
      setStep(STEPS.PUBLISH);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // publish step
  const handlePublish = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      await completeOnboarding();
      await refreshAuth();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [refreshAuth]);

  const handleContinueToDashboard = useCallback(async () => {
    await refreshAuth();
    router.replace("/Dashboard");
  }, [refreshAuth, router]);

  // console.log("userData:", userData);
  /* ---------------- USE EFFECTS ---------------- */

  // Sync onboarding step with server
  useEffect(() => {
    let cancelled = false;

    const syncStep = async () => {
      try {
        setIsSyncing(true);

        const res = await axios.get("/api/onboarding/status");
        if (!res?.data || cancelled) return;

        const data = res.data;

        if (data.completed) {
          window.location.replace("/Dashboard");
          return;
        }

        setStep(data.step);
      } catch (err) {
        console.error("Onboarding status sync failed:", err);
      } finally {
        if (!cancelled) setIsSyncing(false);
      }
    };

    syncStep();

    return () => {
      cancelled = true;
    };
  }, []);


  useEffect(() => {
    if (step !== STEPS.PUBLISH) return;

    let cancelled = false;

    const runPublish = async () => {
      try {
        await handlePublish();

        if (cancelled) return;

        setStep(STEPS.SUCCESS);
      } catch (err) {
        console.error("Publish failed:", err);
      }
    };
    runPublish();
    return () => {
      cancelled = true;
    };
  }, [step, handlePublish]);


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
          isSyncing={isSyncing}
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
          isSyncing={isSyncing}
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
          isSyncing={isSyncing}
          setAvatar={(v) => update("avatar", v)}
          isSaving={loading}
          onBack={() => setStep(STEPS.USERNAME)}
          onNext={handleProfileNext}
        />
      )}

      {step === STEPS.PLATFORMS && (
        <PlatformStep
          step={step}
          isSyncing={isSyncing}
          selected={formData.platforms}
          toggle={togglePlatform}
          onSkip={() => setStep(STEPS.THEME)}
          onBack={() => setStep(STEPS.PROFILE)}
          onNext={() => setStep(STEPS.LINKS)}
        />
      )}

      {step === STEPS.LINKS && (
        <LinksStep
          step={step}
          isSyncing={isSyncing}
          platforms={formData.platforms}
          links={formData.links}
          setLink={setLink}
          isSaving={loading}
          onBack={() => setStep(STEPS.PLATFORMS)}
          onNext={handleLinksNext}
        />
      )}

      {step === STEPS.THEME && (
        // console.log(formData.platforms,formData.links),
        <ThemeStep
          step={step}
          isSyncing={isSyncing}
          themes={[
            { id: "classic", color: "bg-white" },
            { id: "dark", color: "bg-slate-900" }
          ]}
          selected={formData.theme}
          isSaving={loading}
          setTheme={(t) => update("theme", t)}
          onBack={formData.platforms.length === 0 ? () => setStep(STEPS.PLATFORMS) : () => setStep(STEPS.LINKS)}
          onNext={handleThemeNext}
        />
      )}

      {step === STEPS.PUBLISH && (
        <PublishStep username={userData?.handle || formData.username} />
      )}

      {step === STEPS.SUCCESS && (
        <SuccessStep
          data={userData}
          onContinue={handleContinueToDashboard}
        />
      )}

    </div>
  );
}
