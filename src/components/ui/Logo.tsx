import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/cn";
import { scrollToId } from "../../lib/scroll";
import { useT } from "../../i18n";
import { useTheme } from "../../lib/theme";

type LogoProps = {
  className?: string;
  /**
   * - "default" (nav, login) — follow the current theme.
   * - "dark"    (footer)     — always render the light-on-dark variant,
   *                            regardless of the active theme, because the
   *                            surface is always dark.
   */
  variant?: "default" | "dark";
};

// Tracks whether the viewport is below Tailwind's `md` (768px). Initial value
// is read synchronously so the first paint already picks the correct asset.
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export function Logo({ className, variant = "default" }: LogoProps) {
  const t = useT();
  const location = useLocation();
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // The "dark" variant + dark theme both call for the light-on-dark logo
  // (white wordmark / white-square icon).
  const onDark = variant === "dark" || theme === "dark";

  const src = isMobile
    ? onDark
      ? "/once-dark-mini.png"
      : "/once-light-mini.png"
    : onDark
      ? "/once-dark.png"
      : "/once-light.png";

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // On the home page, just scroll to top (no full nav).
    if (location.pathname === "/") {
      e.preventDefault();
      scrollToId("top");
    }
  }

  return (
    <Link
      to="/"
      onClick={handleClick}
      aria-label={t.brand.name}
      className={cn(
        "inline-flex items-center select-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 rounded-md",
        className,
      )}
    >
      <img
        src={src}
        alt={t.brand.name}
        className={isMobile ? "h-9 w-auto" : "h-7 w-auto"}
        draggable={false}
      />
    </Link>
  );
}
