import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Logo } from "../components/ui/Logo";
import { LanguageSwitcher } from "../components/ui/LanguageSwitcher";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { useAuth } from "../auth/AuthProvider";
import { isAdmin, isLearner } from "../auth/permissions";
import { useT } from "../i18n";

// 403 — shown when an authenticated user opens a route their role is not
// allowed to enter (RequireRole redirects here with `state.from` carrying the
// blocked location). For visitors who are not signed in, send them through
// /login first.
export function Forbidden() {
  const t = useT();
  const copy = t.forbidden;
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, roles, logout } = useAuth();

  useEffect(() => {
    document.title = copy.meta.title;
  }, [copy.meta.title]);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from
    ?.pathname;

  const home =
    !isAuthenticated
      ? "/login"
      : isAdmin(roles)
        ? "/admin"
        : isLearner(roles)
          ? "/learner"
          : "/";

  async function handleSignOut() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <header className="flex items-center justify-between gap-md px-2xl py-xl">
        <Logo />
        <div className="flex items-center gap-xs">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-2xl py-section">
        <div className="max-w-[560px] w-full text-center">
          <p className="text-micro-uppercase uppercase text-stone tracking-wide">
            {copy.eyebrow}
          </p>
          <h1 className="mt-sm text-display-lg font-display text-ink">403</h1>
          <h2 className="mt-md text-heading-2 font-display text-ink">
            {copy.title}
          </h2>
          <p className="mt-md text-body-md text-slate">{copy.body}</p>

          {from && (
            <p className="mt-md text-caption text-stone">
              <span className="opacity-60">{copy.attempted} </span>
              <code className="px-1 py-px rounded bg-surface text-ink">
                {from}
              </code>
            </p>
          )}

          <div className="mt-2xl inline-flex flex-wrap items-center justify-center gap-sm">
            <Link to={home}>
              <Button variant="primary" size="lg">
                {isAuthenticated ? copy.goHome : copy.signIn}
              </Button>
            </Link>
            {isAuthenticated && (
              <Button variant="ghost" size="lg" onClick={handleSignOut}>
                {copy.signOut}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
