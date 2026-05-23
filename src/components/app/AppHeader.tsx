import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { isAdmin } from "../../auth/permissions";
import { useT } from "../../i18n";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Icon } from "./icons";
import { cn } from "../../lib/cn";

type AppHeaderProps = {
  onMenuClick?: () => void;
  title?: string;
  children?: ReactNode;
};

export function AppHeader({ onMenuClick, title, children }: AppHeaderProps) {
  const t = useT();

  return (
    <header className="sticky top-0 z-20 h-[64px] flex items-center gap-md px-md md:px-xl border-b border-hairline-soft bg-canvas/95 backdrop-blur">
      {onMenuClick && (
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md text-ink hover:bg-surface"
          aria-label={t.nav.openMenu}
          onClick={onMenuClick}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
            <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M3 5h12" />
              <path d="M3 9h12" />
              <path d="M3 13h12" />
            </g>
          </svg>
        </button>
      )}

      {title && (
        <h2 className="text-body-md-medium text-ink truncate">{title}</h2>
      )}

      {children && <div className="flex-1 min-w-0">{children}</div>}

      <div className="ml-auto flex items-center gap-xs">
        <LanguageSwitcher />
        <ThemeToggle />
        <ProfileMenu />
      </div>
    </header>
  );
}

// Profile button + dropdown. Hosts Notifications + Settings (which used to
// live in the sidebar) plus a Logout entry. Routes resolve to the matching
// app section (/learner or /admin) based on the current URL.
function ProfileMenu() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, roles, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(location.pathname);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Close the menu whenever the route changes. Adjusting state during render
  // (instead of in an effect) avoids a cascading re-render — see
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setOpen(false);
  }

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

  if (!user) return null;

  // Which app section to route into. Falls back to admin when the user has
  // any admin-flavored role and isn't currently on /learner.
  const onAdminSurface = location.pathname.startsWith("/admin");
  const onLearnerSurface = location.pathname.startsWith("/learner");
  const sectionPrefix = onAdminSurface
    ? "/admin"
    : onLearnerSurface
      ? "/learner"
      : isAdmin(roles)
        ? "/admin"
        : "/learner";

  const labels = onAdminSurface ? t.app.admin : t.app.learner;
  const roleLabel = roles[0]?.replace("_", " ") ?? "";

  function go(path: string) {
    navigate(path);
  }

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-xs h-9 pl-1 pr-sm rounded-full",
          "border border-hairline-strong bg-canvas text-ink text-body-sm-medium",
          "hover:bg-surface transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2",
        )}
        title={user.email}
      >
        <Avatar name={user.fullName} />
        <span className="hidden md:inline max-w-[140px] truncate">
          {user.fullName.split(" ")[0]}
        </span>
        <ChevronIcon className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 top-full mt-xs min-w-[240px]",
            "rounded-lg border border-hairline bg-canvas shadow-elev-2",
            "py-xs z-40",
          )}
        >
          <div className="px-md py-xs border-b border-hairline-soft mb-xs">
            <p className="text-body-sm-medium text-ink truncate">
              {user.fullName}
            </p>
            <p className="text-caption text-stone truncate capitalize">
              {roleLabel}
            </p>
          </div>

          <MenuItem
            icon={<Icon.Bell />}
            label={labels.notifications}
            onClick={() => go(`${sectionPrefix}/notifications`)}
          />
          <MenuItem
            icon={<Icon.Cog />}
            label={labels.settings}
            onClick={() => go(`${sectionPrefix}/settings`)}
          />

          <div className="my-xs border-t border-hairline-soft" />

          <MenuItem
            icon={<LogoutIcon />}
            label={t.app.common.logout}
            tone="danger"
            onClick={handleLogout}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  tone,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  tone?: "danger";
}) {
  return (
    <button
      role="menuitem"
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-sm px-md py-xs text-left text-body-sm-medium",
        "hover:bg-surface focus:bg-surface focus:outline-none transition-colors",
        tone === "danger" ? "text-coral-dark" : "text-ink",
      )}
    >
      <span className="w-5 h-5 inline-flex items-center justify-center text-current">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span className="w-7 h-7 rounded-full bg-brand-yellow text-primary text-caption-bold inline-flex items-center justify-center pastel">
      {initials}
    </span>
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

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M10 12V13.5H3V2.5H10V4M7 8H14M14 8L12 6M14 8L12 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
