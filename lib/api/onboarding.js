import { apiPost } from "./client";

export const checkUsername = (username) =>
  apiPost("/api/check-handle", { username });

export const saveUsername = (username) =>
  apiPost("/api/onboarding/username", { username });

export const saveProfile = ({ profile, script, profession }) =>
  apiPost("/api/onboarding/profile", { profile, script, profession });

export const saveLinks = (links) =>
  apiPost("/api/onboarding/links", { links });

export const saveTheme = (theme) =>
  apiPost("/api/onboarding/theme", { theme });

export const completeOnboarding = () =>
  apiPost("/api/onboarding/complete");
