// Backend integration layer.
//
// Single env var to configure the API target:
//   VITE_API_BASE_URL  — e.g. "http://localhost:5000" (no trailing slash)
//
// Legacy/landing form vars (kept for the marketing demo flow only):
//   VITE_DEMO_API_URL     — full endpoint for the demo-request form
//   VITE_DEMO_API_METHOD  — HTTP method (default: POST)
//   VITE_GOOGLE_OAUTH_URL — Google OAuth init URL (default: /auth/google)
//   VITE_SSO_INIT_URL     — SSO init URL          (default: /auth/sso)
//
// Real auth (login / refresh / logout) targets `${VITE_API_BASE_URL}/api/auth/*`.

import { tokenStore, type TokenPair } from "../auth/tokenStore";

// ------------------------------ Config ----------------------------------

export const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ""
).replace(/\/+$/, "");

const DEFAULT_TIMEOUT_MS = 12_000;
const MOCK_LATENCY_MS = 350;

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

function apiUrl(path: string): string {
  if (/^https?:/i.test(path)) return path;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${suffix}`;
}

// ------------------------------ Demo form -------------------------------

export type DemoRequestPayload = {
  fullName: string;
  companyName: string;
  jobTitle: string;
  email: string;
  phone: string;
  interestedModule: string;
  message: string;
  source: "landing-page";
};

export type SubmitResult =
  | { status: "ok" }
  | { status: "timeout" }
  | { status: "duplicate" }
  | { status: "error"; message?: string };

export async function submitDemoRequest(
  payload: DemoRequestPayload,
  options: { timeoutMs?: number } = {},
): Promise<SubmitResult> {
  const configuredUrl = import.meta.env.VITE_DEMO_API_URL as string | undefined;

  if (!configuredUrl) {
    await sleep(MOCK_LATENCY_MS);
    console.info("[api] demo request (mock):", payload);
    return { status: "ok" };
  }

  const method = import.meta.env.VITE_DEMO_API_METHOD ?? "POST";
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(configuredUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (res.status === 409) return { status: "duplicate" };
    if (!res.ok) return { status: "error", message: `HTTP ${res.status}` };
    return { status: "ok" };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { status: "timeout" };
    }
    return { status: "error" };
  } finally {
    window.clearTimeout(timer);
  }
}

// ------------------------------ Auth contracts --------------------------

// Backend `LoginRequest` uses `Username`, but the field accepts an email too —
// upstream just looks up `Users.Username == request.Username`. The form lets
// the user type either; we pass through whatever they typed.
export type LoginPayload = {
  usernameOrEmail: string;
  password: string;
};

export type LoginSuccess = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
};

export type LoginResult =
  | { status: "ok"; tokens: LoginSuccess }
  | { status: "invalid_credentials" }
  | { status: "inactive" }
  | { status: "timeout" }
  | { status: "error"; message?: string };

type LoginResponseBody = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
};

// Backend ProblemDetails for auth errors look like:
//   { type: "Auth.InvalidCredentials" | "Auth.UserInactive" | ... }
type AuthErrorResult = Extract<LoginResult, { status: "inactive" | "invalid_credentials" | "error" }>;

function classifyAuthError(body: unknown): AuthErrorResult {
  if (
    body &&
    typeof body === "object" &&
    "type" in body &&
    typeof (body as { type?: unknown }).type === "string"
  ) {
    const t = (body as { type: string }).type.toLowerCase();
    if (t.includes("inactive")) return { status: "inactive" };
    if (t.includes("invalidcredentials") || t.includes("invalid_credentials")) {
      return { status: "invalid_credentials" };
    }
  }
  return { status: "error" };
}

// ------------------------------ Login -----------------------------------

export async function submitLogin(
  payload: LoginPayload,
  options: { timeoutMs?: number } = {},
): Promise<LoginResult> {
  if (!API_BASE_URL) {
    // No backend wired up — keep the page testable by short-circuiting to a
    // mock that simulates a successful login. Email/username drives the role
    // upstream (Login.tsx) since we have no real tokens here.
    await sleep(MOCK_LATENCY_MS);
    const now = Date.now();
    return {
      status: "ok",
      tokens: {
        accessToken: "mock.access.token",
        refreshToken: "mock.refresh.token",
        accessTokenExpiresAt: new Date(now + 60 * 60_000).toISOString(),
        refreshTokenExpiresAt: new Date(now + 7 * 24 * 60 * 60_000).toISOString(),
      },
    };
  }

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(apiUrl("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: payload.usernameOrEmail,
        password: payload.password,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (res.status === 401 || res.status === 403) {
        return classifyAuthError(body);
      }
      return { status: "error", message: `HTTP ${res.status}` };
    }

    const data = (await res.json()) as LoginResponseBody;
    return { status: "ok", tokens: data };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { status: "timeout" };
    }
    return { status: "error" };
  } finally {
    window.clearTimeout(timer);
  }
}

// ------------------------------ Refresh ---------------------------------

let refreshInFlight: Promise<TokenPair | null> | null = null;

export async function refreshTokens(): Promise<TokenPair | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const current = tokenStore.read();
    if (!current?.refreshToken) return null;

    try {
      if (!API_BASE_URL) return null;
      const res = await fetch(apiUrl("/api/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: current.refreshToken }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as LoginResponseBody;
      const next: TokenPair = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpiresAt: data.accessTokenExpiresAt,
        refreshTokenExpiresAt: data.refreshTokenExpiresAt,
      };
      tokenStore.write(next);
      return next;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

// ------------------------------ Logout ----------------------------------

export async function submitLogout(): Promise<void> {
  const current = tokenStore.read();
  tokenStore.clear();
  if (!API_BASE_URL || !current?.refreshToken) return;
  try {
    await fetch(apiUrl("/api/auth/logout"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: current.refreshToken }),
    });
  } catch {
    /* best-effort — local tokens are already cleared */
  }
}

// ------------------------------ authFetch -------------------------------

// Attaches the Bearer access token, and on 401 transparently refreshes and
// retries the request once. Use this for every authenticated API call so
// expired access tokens don't surface to call sites.
export async function authFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = apiUrl(path);
  const headers = new Headers(init.headers ?? {});

  const tokens = tokenStore.read();
  if (tokens?.accessToken) {
    headers.set("Authorization", `Bearer ${tokens.accessToken}`);
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...init, headers });
  if (res.status !== 401) return res;

  const refreshed = await refreshTokens();
  if (!refreshed) return res;

  const retryHeaders = new Headers(init.headers ?? {});
  retryHeaders.set("Authorization", `Bearer ${refreshed.accessToken}`);
  if (init.body && !retryHeaders.has("Content-Type")) {
    retryHeaders.set("Content-Type", "application/json");
  }
  return fetch(url, { ...init, headers: retryHeaders });
}

// ------------------------------ OAuth/SSO helpers ----------------------

export function getSsoInitUrl(identifier: string): string {
  const base = import.meta.env.VITE_SSO_INIT_URL ?? "/auth/sso";
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}identifier=${encodeURIComponent(identifier)}`;
}
