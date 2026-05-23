// Real auth state, backed by the backend (POST /api/auth/login, /refresh,
// /logout). Tokens live in the `tokenStore` (localStorage + memory cache);
// user identity is decoded from the JWT access token claims.
//
//   useAuth().user           — current user (or null)
//   useAuth().roles          — RoleCode[]
//   useAuth().permissions    — Set<Permission>
//   useAuth().tokens         — current TokenPair (or null)
//   useAuth().login(payload) — Promise<LoginResult>
//   useAuth().logout()       — Promise<void>
//   useAuth().can(perm)      — boolean
//
// A silent refresh timer fires ~60s before the access token expires, so a
// signed-in tab keeps a fresh token without any user-visible round trip.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Permission, RoleCode, User } from "../data/entities";
import { parseRoleClaim, permissionsFor } from "./permissions";
import { tokenStore, type TokenPair } from "./tokenStore";
import {
  refreshTokens,
  submitLogin,
  submitLogout,
  type LoginPayload,
  type LoginResult,
} from "../lib/api";

type AuthContextValue = {
  user: User | null;
  roles: RoleCode[];
  permissions: Set<Permission>;
  isAuthenticated: boolean;
  tokens: TokenPair | null;
  login: (payload: LoginPayload) => Promise<LoginResult>;
  logout: () => Promise<void>;
  can: (permission: Permission) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// ----------------------------- JWT decode -------------------------------

type JwtPayload = Record<string, unknown> & {
  exp?: number;
  iat?: number;
};

function base64UrlDecode(input: string): string {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  try {
    const binary = atob(b64);
    return decodeURIComponent(
      Array.from(binary, (c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`).join(""),
    );
  } catch {
    return "";
  }
}

function decodeJwt(token: string): JwtPayload | null {
  const [, payload] = token.split(".");
  if (!payload) return null;
  try {
    return JSON.parse(base64UrlDecode(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

// CustomClaims from the backend JWT (see Once.Infrastructure.Authentication.
// CustomClaims): id, role, plus the standard ClaimTypes.Role mirror.
const ID_CLAIMS = ["id", "sub", "user_id"];
const ROLE_CLAIMS = [
  "role",
  "Role",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
];
const NAME_CLAIMS = [
  "name",
  "fullName",
  "given_name",
  "preferred_username",
  "username",
];
const EMAIL_CLAIMS = [
  "email",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
];

function pick(payload: JwtPayload, keys: string[]): unknown {
  for (const k of keys) {
    if (payload[k] !== undefined && payload[k] !== null) return payload[k];
  }
  return undefined;
}

function userFromToken(token: string): {
  user: User;
  roles: RoleCode[];
} | null {
  const payload = decodeJwt(token);
  if (!payload) return null;

  const role = parseRoleClaim(pick(payload, ROLE_CLAIMS));
  if (!role) return null;

  const id = String(pick(payload, ID_CLAIMS) ?? "");
  const name = String(pick(payload, NAME_CLAIMS) ?? "");
  const email = String(pick(payload, EMAIL_CLAIMS) ?? "");

  return {
    user: {
      id,
      fullName: name || email || id || "User",
      email: email || "",
      roles: [role],
      status: "active",
      joinedAt: "",
    },
    roles: [role],
  };
}

// ----------------------------- Refresh scheduler ------------------------

// Fire a silent refresh this many ms before the access token expires.
const REFRESH_LEAD_MS = 60_000;

function scheduleRefresh(
  tokens: TokenPair | null,
  onRefreshed: (next: TokenPair | null) => void,
): () => void {
  if (!tokens) return () => {};
  const expiresAt = new Date(tokens.accessTokenExpiresAt).getTime();
  if (!Number.isFinite(expiresAt)) return () => {};

  const delay = Math.max(1_000, expiresAt - Date.now() - REFRESH_LEAD_MS);
  const handle = window.setTimeout(async () => {
    const next = await refreshTokens();
    onRefreshed(next);
  }, delay);

  return () => window.clearTimeout(handle);
}

// ----------------------------- Provider ---------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<TokenPair | null>(() => tokenStore.read());

  // Subscribe to cross-tab and api.ts-driven token changes (e.g. silent
  // refresh inside an authFetch) so the React state stays aligned.
  useEffect(() => {
    return tokenStore.subscribe((next) => {
      setTokens((prev) => {
        if (prev === next) return prev;
        if (
          prev &&
          next &&
          prev.accessToken === next.accessToken &&
          prev.refreshToken === next.refreshToken
        ) {
          return prev;
        }
        return next;
      });
    });
  }, []);

  // Recover from an access token that already expired on first load (e.g.
  // the user reopens the app the next day). Refresh once; if it fails, the
  // expired token will surface as 401 on the first authFetch and clean up.
  useEffect(() => {
    const t = tokenStore.read();
    if (!t) return;
    const expiresAt = new Date(t.accessTokenExpiresAt).getTime();
    if (Number.isFinite(expiresAt) && expiresAt - Date.now() < REFRESH_LEAD_MS) {
      refreshTokens();
    }
  }, []);

  // Silent refresh loop — re-scheduled whenever `tokens` changes.
  useEffect(() => {
    return scheduleRefresh(tokens, () => {
      /* tokenStore.subscribe already updates `tokens` */
    });
  }, [tokens]);

  const identity = useMemo(() => {
    if (!tokens?.accessToken) return null;
    return userFromToken(tokens.accessToken);
  }, [tokens]);

  const user = identity?.user ?? null;
  const roles = useMemo(() => identity?.roles ?? [], [identity]);
  const permissions = useMemo(() => permissionsFor(roles), [roles]);

  const login = useCallback(
    async (payload: LoginPayload): Promise<LoginResult> => {
      const res = await submitLogin(payload);
      if (res.status === "ok") {
        tokenStore.write(res.tokens);
      }
      return res;
    },
    [],
  );

  const logout = useCallback(async () => {
    await submitLogout();
    /* tokenStore.clear() ran inside submitLogout */
  }, []);

  const can = useCallback(
    (permission: Permission) => permissions.has(permission),
    [permissions],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      roles,
      permissions,
      isAuthenticated: !!user,
      tokens,
      login,
      logout,
      can,
    }),
    [user, roles, permissions, tokens, login, logout, can],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
