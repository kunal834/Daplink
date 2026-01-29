import { apiPost } from "./client";

export const checkUsername = (username) =>
  apiPost("/api/check-handle", { username });

export const saveUsername = ({ username, profession }) =>
  apiPost("/api/onboarding/username", { username, profession });

export const saveProfile = ({ profile, script }) =>
  apiPost("/api/onboarding/profile", { profile, script });

export const saveLinks = (links) =>
  apiPost("/api/onboarding/links", { links });

export const saveTheme = (theme) =>
  apiPost("/api/onboarding/theme", { theme });

export const completeOnboarding = () =>
  apiPost("/api/onboarding/complete");
