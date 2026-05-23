import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LandingContent } from "./types";
import { en } from "./en";
import { uz } from "./uz";
import { uzCyrl } from "./uz-Cyrl";
import { ru } from "./ru";

export type Locale = "en" | "uz" | "uz-Cyrl" | "ru";

// eslint-disable-next-line react-refresh/only-export-components
export const LOCALES: ReadonlyArray<{
  code: Locale;
  short: string;
  label: string;
  htmlLang: string;
}> = [
  { code: "en", short: "EN", label: "English", htmlLang: "en" },
  { code: "uz", short: "UZ", label: "O'zbekcha", htmlLang: "uz" },
  { code: "uz-Cyrl", short: "ЎЗ", label: "Ўзбекча", htmlLang: "uz-Cyrl" },
  { code: "ru", short: "RU", label: "Русский", htmlLang: "ru" },
];

const dictionaries: Record<Locale, LandingContent> = {
  en,
  uz,
  "uz-Cyrl": uzCyrl,
  ru,
};

const STORAGE_KEY = "once.locale";

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in dictionaries) return stored as Locale;
  } catch {
    /* localStorage unavailable */
  }
  const nav = navigator.language?.toLowerCase() ?? "";
  if (nav.startsWith("ru")) return "ru";
  if (nav.startsWith("uz")) return "uz";
  return "en";
}

type I18nContextValue = {
  locale: Locale;
  t: LandingContent;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale);

  useEffect(() => {
    const meta = LOCALES.find((l) => l.code === locale);
    if (meta) document.documentElement.lang = meta.htmlLang;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* private mode */
    }
    document.title = dictionaries[locale].meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", dictionaries[locale].meta.description);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, t: dictionaries[locale], setLocale }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useT(): LandingContent {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used inside <I18nProvider>");
  return ctx.t;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLocale() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLocale must be used inside <I18nProvider>");
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}
