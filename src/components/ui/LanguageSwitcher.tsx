import { useEffect, useRef, useState } from "react";
import { LOCALES, useLocale, useT } from "../../i18n";
import { cn } from "../../lib/cn";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();
  const t = useT();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.nav.languageLabel}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-xs h-9 px-sm rounded-full",
          "border border-hairline-strong bg-canvas text-ink text-body-sm-medium",
          "hover:bg-surface transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2",
        )}
      >
        <GlobeIcon />
        <span>{current.short}</span>
        <ChevronIcon className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.nav.languageLabel}
          className={cn(
            "absolute right-0 top-full mt-xs min-w-[180px]",
            "rounded-md border border-hairline bg-canvas shadow-elev-2",
            "py-xs z-40",
          )}
        >
          {LOCALES.map((l) => {
            const selected = l.code === locale;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setLocale(l.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-md px-md py-xs text-left",
                    "text-body-sm-medium text-ink hover:bg-surface",
                  )}
                >
                  <span>
                    <span className="text-stone mr-xs">{l.short}</span>
                    {l.label}
                  </span>
                  {selected && <CheckIcon />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M7 1.5C9 4 9 10 7 12.5M7 1.5C5 4 5 10 7 12.5M1.5 7h11"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M2 3.5L5 6.5L8 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6.5L5 9L9.5 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
