export const AUTH_COOKIE_NAME = "authToken";

export function getAuthTokenFromCookie() {
  if (typeof document === "undefined") return "";
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${AUTH_COOKIE_NAME}=`));
  if (!cookie) return "";
  const rawValue = cookie.split("=")[1] || "";
  return decodeURIComponent(rawValue);
}

export function buildBackendConfig(config = {}) {
  const token = getAuthTokenFromCookie();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  return {
    withCredentials: true,
    ...config,
    headers: {
      ...authHeaders,
      ...(config.headers || {}),
    },
  };
}

export function buildSocketOptions(options = {}) {
  const token = getAuthTokenFromCookie();

  return {
    withCredentials: true,
    ...options,
    auth: {
      ...(options.auth || {}),
      ...(token ? { token, authorization: `Bearer ${token}` } : {}),
    },
  };
}
