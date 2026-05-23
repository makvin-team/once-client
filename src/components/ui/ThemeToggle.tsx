import { useT } from "../../i18n";
import { useTheme } from "../../lib/theme";
import { cn } from "../../lib/cn";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const t = useT();
  const label = theme === "dark" ? t.nav.themeLabelLight : t.nav.themeLabelDark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center w-9 h-9 rounded-full",
        "border border-hairline-strong bg-canvas text-ink",
        "hover:bg-surface transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2",
        className,
      )}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M8 1.5v1.5" />
        <path d="M8 13v1.5" />
        <path d="M1.5 8H3" />
        <path d="M13 8h1.5" />
        <path d="M3.3 3.3l1 1" />
        <path d="M11.7 11.7l1 1" />
        <path d="M3.3 12.7l1-1" />
        <path d="M11.7 4.3l1-1" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13.5 9.6A5.6 5.6 0 1 1 6.4 2.5 4.4 4.4 0 0 0 13.5 9.6Z"
        fill="currentColor"
      />
    </svg>
  );
}
