// Local persistence + in-memory cache for the access/refresh token pair.
//
// The store is intentionally tiny and dependency-free so it can be imported
// from both the auth layer (AuthProvider) and the network layer (api.ts)
// without creating a circular dependency.

const STORAGE_KEY = "once.auth.tokens.v1";

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
};

let cache: TokenPair | null | undefined;
type Listener = (tokens: TokenPair | null) => void;
const listeners = new Set<Listener>();

function safeParse(raw: string | null): TokenPair | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Partial<TokenPair>;
    if (
      typeof v?.accessToken === "string" &&
      typeof v?.refreshToken === "string" &&
      typeof v?.accessTokenExpiresAt === "string" &&
      typeof v?.refreshTokenExpiresAt === "string"
    ) {
      return v as TokenPair;
    }
    return null;
  } catch {
    return null;
  }
}

function load(): TokenPair | null {
  if (typeof window === "undefined") return null;
  try {
    return safeParse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function persist(tokens: TokenPair | null) {
  if (typeof window === "undefined") return;
  try {
    if (tokens) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* private mode / quota */
  }
}

function notify(tokens: TokenPair | null) {
  for (const fn of listeners) fn(tokens);
}

export const tokenStore = {
  read(): TokenPair | null {
    if (cache === undefined) cache = load();
    return cache;
  },
  write(tokens: TokenPair): void {
    cache = tokens;
    persist(tokens);
    notify(tokens);
  },
  clear(): void {
    cache = null;
    persist(null);
    notify(null);
  },
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

// Cross-tab sync — if a sibling tab logs in/out, mirror the change here.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    cache = safeParse(e.newValue);
    notify(cache);
  });
}
