import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { cn } from "../../lib/cn";
import { useT } from "../../i18n";
import { onAnchorClick } from "../../lib/scroll";
import { track } from "../../lib/analytics";

export function TopNav() {
  const [open, setOpen] = useState(false);
  const t = useT();
  const nav = t.nav;

  function handleAnchor(
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string,
  ) {
    setOpen(false);
    onAnchorClick(e, href);
  }

  function handlePrimary(e: React.MouseEvent<HTMLButtonElement>) {
    track("request_demo_clicked", { location: "top_nav" });
    handleAnchor(e, nav.primaryCtaHref);
  }

  return (
    <header className="sticky top-0 z-30 bg-canvas/95 backdrop-blur border-b border-hairline-soft">
      <div className="mx-auto max-w-container px-2xl h-[64px] flex items-center justify-between gap-xl">
        <div className="flex items-center gap-2xl min-w-0">
          <Logo />
          <nav className="hidden xl:flex items-center gap-xl">
            {nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleAnchor(e, l.href)}
                className="text-body-sm-medium text-charcoal hover:text-ink transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-xs">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            to="/login"
            className="ml-xs px-md py-xs text-body-sm-medium text-charcoal hover:text-ink"
          >
            {t.auth.loginLink}
          </Link>
          <Button variant="primary" onClick={handlePrimary}>
            {nav.primaryCta}
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-xs">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-hairline-strong text-ink"
            aria-label={open ? nav.closeMenu : nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              {open ? (
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              ) : (
                <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M3 5h12" />
                  <path d="M3 9h12" />
                  <path d="M3 13h12" />
                </g>
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className={cn("md:hidden border-t border-hairline-soft bg-canvas")}
      >
        <div className="px-2xl py-md flex flex-col gap-xs">
          {nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleAnchor(e, l.href)}
              className="py-xs text-body-md-medium text-charcoal hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/login"
            className="py-xs text-body-md-medium text-charcoal hover:text-ink"
          >
            {t.auth.loginLink}
          </Link>
          <Button
            variant="primary"
            className="mt-sm w-full"
            onClick={handlePrimary}
          >
            {nav.primaryCta}
          </Button>
        </div>
      </div>
    </header>
  );
}
