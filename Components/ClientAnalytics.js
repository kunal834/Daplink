'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect } from "react";
import posthog from "posthog-js";
import { useAuth } from "@/context/Authenticate";

export default function ClientAnalytics() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id) return;
    if (!posthog?.__loaded) return;

    posthog.identify(user._id, {
      email: user.email || "",
      name: user.name || "",
      plan: user.plan || "free",
    });
  }, [user?._id, user?.email, user?.name, user?.plan]);

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
