import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";
import { Logo } from "../components/ui/Logo";
import { LanguageSwitcher } from "../components/ui/LanguageSwitcher";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { cn } from "../lib/cn";
import { useT } from "../i18n";
import { track } from "../lib/analytics";
import { getSsoInitUrl } from "../lib/api";
import { useAuth } from "../auth/AuthProvider";
import { isAdmin, isLearner } from "../auth/permissions";

type FormErrors = { identifier?: string; password?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status =
  | "idle"
  | "submitting"
  | "success"
  | "invalid_credentials"
  | "inactive"
  | "error"
  | "timeout";

// Treat the field as an email only if it looks like one; otherwise it's just
// a username and shouldn't be email-validated.
function looksLikeEmail(v: string): boolean {
  return v.includes("@");
}

export function Login() {
  const t = useT();
  const copy = t.auth;
  const navigate = useNavigate();
  const location = useLocation();
  const { login, roles, isAuthenticated } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const [ssoOpen, setSsoOpen] = useState(false);
  const [ssoId, setSsoId] = useState("");
  const [ssoError, setSsoError] = useState<string | null>(null);

  const submittingRef = useRef(false);

  useEffect(() => {
    document.title = copy.meta.title;
    track("login_page_viewed");
  }, [copy.meta.title]);

  // If the user is already authenticated (e.g. opened /login with a live
  // session in localStorage), kick them straight into the right app instead
  // of showing the form. Also redirects post-login once roles populate.
  useEffect(() => {
    if (!isAuthenticated || roles.length === 0) return;
    const fromState = (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname;
    const dest =
      fromState && fromState !== "/login"
        ? fromState
        : isLearner(roles) && !isAdmin(roles)
          ? "/learner"
          : "/admin";
    navigate(dest, { replace: true });
  }, [isAuthenticated, roles, navigate, location.state]);

  function validate(): FormErrors {
    const e: FormErrors = {};
    const id = identifier.trim();
    if (!id) e.identifier = copy.signIn.errors.required;
    else if (looksLikeEmail(id) && !EMAIL_RE.test(id))
      e.identifier = copy.signIn.errors.email;
    if (!password) e.password = copy.signIn.errors.required;
    else if (password.length < 8) e.password = copy.signIn.errors.password;
    return e;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      document.getElementById(`login-${Object.keys(v)[0]}`)?.focus();
      return;
    }

    submittingRef.current = true;
    setErrors({});
    setServerError(null);
    setStatus("submitting");

    const res = await login({
      usernameOrEmail: identifier.trim(),
      password,
    });
    submittingRef.current = false;

    if (res.status === "ok") {
      setStatus("success");
      track("login_submitted", { method: "password" });
      // The redirect happens in the effect above once the JWT-derived roles
      // hydrate into AuthProvider state.
      return;
    }
    if (res.status === "invalid_credentials") {
      setStatus("invalid_credentials");
      setServerError(copy.signIn.errors.invalidCredentials);
      track("login_failed", { reason: "invalid_credentials" });
      return;
    }
    if (res.status === "inactive") {
      setStatus("inactive");
      setServerError(copy.signIn.errors.invalidCredentials);
      track("login_failed", { reason: "inactive" });
      return;
    }
    if (res.status === "timeout") {
      setStatus("timeout");
      setServerError(copy.signIn.errors.timeout);
      track("login_failed", { reason: "timeout" });
      return;
    }
    setStatus("error");
    setServerError(copy.signIn.errors.submit);
    track("login_failed", { reason: "server" });
  }

  function onSsoStart() {
    track("login_with_sso_clicked");
    setSsoOpen(true);
  }

  function onSsoContinue(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = ssoId.trim();
    if (!id) {
      setSsoError(copy.signIn.errors.required);
      return;
    }
    // Looks like email? must be email. Else accept any non-empty domain-ish string.
    if (id.includes("@") && !EMAIL_RE.test(id)) {
      setSsoError(copy.signIn.errors.email);
      return;
    }
    setSsoError(null);
    window.location.assign(getSsoInitUrl(id));
  }

  const submitting = status === "submitting";
  const success = status === "success";

  return (
    <div className="min-h-screen bg-canvas text-ink grid lg:grid-cols-[1fr_1.1fr]">
      {/* ---------------- Form panel ---------------- */}
      <section className="relative flex flex-col px-2xl py-xl lg:p-section">
        <header className="flex items-center justify-between gap-md">
          <Logo />
          <div className="flex items-center gap-xs">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <div className="flex-1 flex items-center">
          <div className="mx-auto w-full max-w-[440px] py-section">
            <Link
              to="/"
              className={cn(
                "group inline-flex items-center gap-xs text-body-sm-medium text-steel mb-xl",
                "transition-colors duration-200 ease-out hover:text-ink",
              )}
            >
              <span className="inline-block transition-transform duration-200 ease-out group-hover:-translate-x-0.5">
                <BackIcon />
              </span>
              {copy.back}
            </Link>

            <div
              key={success ? "success" : "form"}
              className="animate-fade-in"
            >
            {success ? (
              <SuccessState />
            ) : (
              <>
                <h1 className="text-heading-1 font-display text-ink">
                  {copy.signIn.title}
                </h1>
                <p className="mt-sm text-body-md text-slate">
                  {copy.signIn.subtitle}
                </p>

                <div className="mt-2xl flex flex-col gap-sm">
                  <ProviderButton
                    onClick={onSsoStart}
                    icon={<SsoIcon />}
                    label={copy.signIn.sso}
                  />
                </div>

                <Collapsible open={ssoOpen}>
                  <SsoPanel
                    title={copy.signIn.ssoTitle}
                    subtitle={copy.signIn.ssoSubtitle}
                    placeholder={copy.signIn.ssoPlaceholder}
                    continueLabel={copy.signIn.ssoContinue}
                    cancelLabel={copy.signIn.ssoCancel}
                    value={ssoId}
                    error={ssoError}
                    onChange={(v) => {
                      setSsoId(v);
                      if (ssoError) setSsoError(null);
                    }}
                    onSubmit={onSsoContinue}
                    onCancel={() => {
                      setSsoOpen(false);
                      setSsoId("");
                      setSsoError(null);
                    }}
                  />
                </Collapsible>

                <Divider label={copy.signIn.divider} className="my-xl" />

                <form
                  onSubmit={onSubmit}
                  noValidate
                  aria-busy={submitting}
                  className="flex flex-col gap-md"
                >
                  <Field
                    label={copy.signIn.fields.email.label}
                    htmlFor="login-identifier"
                    required
                    error={errors.identifier}
                  >
                    <Input
                      id="login-identifier"
                      name="identifier"
                      type="text"
                      autoComplete="username"
                      inputMode="email"
                      placeholder={copy.signIn.fields.email.placeholder}
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (errors.identifier)
                          setErrors((p) => ({ ...p, identifier: undefined }));
                      }}
                      aria-invalid={!!errors.identifier}
                      aria-describedby={
                        errors.identifier ? "login-identifier-error" : undefined
                      }
                    />
                  </Field>

                  <Field
                    label={copy.signIn.fields.password.label}
                    htmlFor="login-password"
                    required
                    error={errors.password}
                  >
                    <div className="relative">
                      <Input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder={copy.signIn.fields.password.placeholder}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password)
                            setErrors((p) => ({ ...p, password: undefined }));
                        }}
                        aria-invalid={!!errors.password}
                        aria-describedby={
                          errors.password ? "login-password-error" : undefined
                        }
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className={cn(
                          "absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-md text-stone",
                          "transition-colors duration-200 ease-out hover:text-ink hover:bg-surface",
                        )}
                        aria-label={
                          showPassword
                            ? copy.signIn.hidePassword
                            : copy.signIn.showPassword
                        }
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </Field>

                  <div className="flex justify-end -mt-xs">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        track("forgot_password_clicked");
                      }}
                      className={cn(
                        "text-body-sm-medium text-brand-blue",
                        "transition-opacity duration-200 ease-out hover:opacity-80 hover:underline",
                      )}
                    >
                      {copy.signIn.forgotPassword}
                    </a>
                  </div>

                  <Collapsible open={!!serverError}>
                    <div
                      role="alert"
                      className={cn(
                        "rounded-md border px-md py-sm text-body-sm",
                        "bg-coral-light border-brand-red-dark text-coral-dark pastel",
                      )}
                    >
                      {serverError}
                    </div>
                  </Collapsible>

                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={submitting}
                    className="mt-xs"
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-xs">
                        <Spinner /> {copy.signIn.submitting}
                      </span>
                    ) : (
                      copy.signIn.submit
                    )}
                  </Button>
                </form>

                <p className="mt-xl text-body-sm text-slate text-center">
                  {copy.signIn.noAccount}{" "}
                  <Link
                    to="/#demo"
                    className="text-body-sm-medium text-brand-blue hover:underline"
                  >
                    {copy.signIn.signupCta} →
                  </Link>
                </p>
              </>
            )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Brand panel ---------------- */}
      <BrandPanel />
    </div>
  );
}

function ProviderButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full inline-flex items-center justify-center gap-sm h-12 px-md rounded-full",
        "bg-canvas text-ink text-body-md-medium",
        "border border-hairline-strong",
        "transition-all duration-200 ease-out",
        "hover:bg-surface hover:border-ink/30 hover:-translate-y-0.5 hover:shadow-elev-2",
        "active:translate-y-0 active:shadow-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2",
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function Collapsible({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={!open}
      className={cn(
        "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
        open
          ? "grid-rows-[1fr] opacity-100 mt-md"
          : "grid-rows-[0fr] opacity-0 mt-0 pointer-events-none",
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

function Divider({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-md", className)}>
      <span className="flex-1 h-px bg-hairline" />
      <span className="text-caption text-stone uppercase">{label}</span>
      <span className="flex-1 h-px bg-hairline" />
    </div>
  );
}

function SsoPanel({
  title,
  subtitle,
  placeholder,
  continueLabel,
  cancelLabel,
  value,
  error,
  onChange,
  onSubmit,
  onCancel,
}: {
  title: string;
  subtitle: string;
  placeholder: string;
  continueLabel: string;
  cancelLabel: string;
  value: string;
  error: string | null;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-md rounded-xl border border-hairline-soft bg-surface p-md flex flex-col gap-sm"
    >
      <div>
        <p className="text-body-sm-medium text-ink">{title}</p>
        <p className="mt-xxs text-caption text-slate">{subtitle}</p>
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        autoFocus
      />
      {error && (
        <p role="alert" className="text-caption text-coral-dark">
          {error}
        </p>
      )}
      <div className="flex items-center gap-xs">
        <Button variant="primary" size="md" type="submit">
          {continueLabel}
        </Button>
        <Button variant="ghost" size="md" type="button" onClick={onCancel}>
          {cancelLabel}
        </Button>
      </div>
    </form>
  );
}

function SuccessState() {
  const t = useT();
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-md text-center py-section"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success-accent text-on-primary text-heading-5">
        ✓
      </div>
      <h2 className="text-heading-3 font-display text-ink">
        {t.auth.signIn.successTitle}
      </h2>
      <p className="text-body-md text-slate max-w-[360px]">
        {t.auth.signIn.successBody}
      </p>
      <Spinner />
    </div>
  );
}

function BrandPanel() {
  const t = useT();
  const b = t.auth.brand;
  const notes = t.hero.mockup.stickyNotes;

  const panelRef = useRef<HTMLElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [bump, setBump] = useState(0);
  const [topZ, setTopZ] = useState(10);

  function onPanelMove(e: React.PointerEvent<HTMLElement>) {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    setParallax({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  }

  function onPanelLeave() {
    setParallax({ x: 0, y: 0 });
  }

  function bringToFront() {
    const next = topZ + 1;
    setTopZ(next);
    return next;
  }

  return (
    <aside
      ref={panelRef}
      onPointerMove={onPanelMove}
      onPointerLeave={onPanelLeave}
      className={cn(
        "hidden lg:flex relative overflow-hidden",
        "bg-brand-yellow text-primary pastel select-none",
      )}
    >
      <div
        className="absolute inset-0 bg-grid-yellow opacity-30 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallax.x * -16}px, ${parallax.y * -16}px, 0)`,
        }}
      />

      <button
        type="button"
        onClick={() => setBump((b) => b + 1)}
        className={cn(
          "absolute z-20 top-md right-md inline-flex items-center gap-xs",
          "px-sm h-8 rounded-full bg-canvas/70 backdrop-blur",
          "text-caption-bold uppercase tracking-wide text-primary/80",
          "hover:bg-canvas transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        )}
        aria-label="Shuffle sticky notes"
      >
        <ShuffleIcon /> Shuffle
      </button>

      {notes.map((note, i) => (
        <DraggableSticky
          key={`${bump}-${i}`}
          index={i}
          total={notes.length}
          tone={note.tone}
          lines={[...note.lines]}
          onPick={bringToFront}
        />
      ))}

      <div
        className="relative z-10 m-auto max-w-[520px] px-2xl py-section pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallax.x * 10}px, ${parallax.y * 10}px, 0)`,
        }}
      >
        <p className="text-micro-uppercase uppercase text-primary/60 mb-md">
          {b.eyebrow}
        </p>
        <h2 className="text-display-lg font-display text-primary">{b.title}</h2>
        <p className="mt-md text-subtitle text-primary/80">{b.body}</p>
        <p className="mt-xl text-caption text-primary/50">
          ✦ Drag the sticky notes
        </p>
      </div>
    </aside>
  );
}

const stickyToneClass = {
  yellow: "bg-brand-yellow-deep",
  coral: "bg-coral-light",
  teal: "bg-teal-light",
  rose: "bg-rose-light",
  orange: "bg-brand-orange-light",
} as const;

// Percentage-based slots spread around the panel so 6–8 notes don't overlap.
const stickySlots: ReadonlyArray<{ x: number; y: number; rotate: number }> = [
  { x: 0.06, y: 0.08, rotate: -6 },
  { x: 0.72, y: 0.06, rotate: 5 },
  { x: 0.10, y: 0.70, rotate: -3 },
  { x: 0.74, y: 0.74, rotate: 4 },
  { x: 0.42, y: 0.04, rotate: 3 },
  { x: 0.04, y: 0.40, rotate: -8 },
  { x: 0.78, y: 0.38, rotate: 7 },
  { x: 0.40, y: 0.78, rotate: -4 },
];

type StickyPos = { x: number; y: number };

function DraggableSticky({
  index,
  total,
  tone,
  lines,
  onPick,
}: {
  index: number;
  total: number;
  tone: keyof typeof stickyToneClass;
  lines: string[];
  onPick: () => number;
}) {
  const slot = stickySlots[index % stickySlots.length];
  const ref = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const [pos, setPos] = useState<StickyPos | null>(null);
  const [dragging, setDragging] = useState(false);
  const [z, setZ] = useState(index + 1);

  // Resolve initial pixel position from the slot ratio after first paint.
  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const r = parent.getBoundingClientRect();
    setPos({ x: slot.x * r.width, y: slot.y * r.height });
  }, [slot.x, slot.y, total]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDragging(true);
    setZ(onPick());
    ref.current.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || !ref.current) return;
    const parent = ref.current.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const maxX = parentRect.width - ref.current.offsetWidth;
    const maxY = parentRect.height - ref.current.offsetHeight;
    const nx = Math.max(0, Math.min(maxX, e.clientX - parentRect.left - offsetRef.current.x));
    const ny = Math.max(0, Math.min(maxY, e.clientY - parentRect.top - offsetRef.current.y));
    setPos({ x: nx, y: ny });
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    setDragging(false);
    ref.current?.releasePointerCapture(e.pointerId);
  }

  const ready = pos !== null;

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        left: pos?.x ?? 0,
        top: pos?.y ?? 0,
        zIndex: z,
        transform: `rotate(${dragging ? 0 : slot.rotate}deg) scale(${dragging ? 1.06 : 1})`,
        opacity: ready ? 1 : 0,
        cursor: dragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
      className={cn(
        "absolute w-[140px] h-[110px] p-md rounded-sm text-primary",
        "transition-[transform,box-shadow,opacity] duration-150 ease-out",
        "hover:scale-[1.06] hover:shadow-elev-3",
        dragging ? "shadow-elev-4" : "shadow-elev-2",
        stickyToneClass[tone],
      )}
      role="button"
      tabIndex={0}
      aria-label={`Sticky note: ${lines.join(" — ")}`}
    >
      <div className="text-heading-5 pointer-events-none">{lines[0]}</div>
      {lines[1] && (
        <div className="mt-1 text-body-sm-medium pointer-events-none">
          {lines[1]}
        </div>
      )}
    </div>
  );
}

function ShuffleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 4h2.5l7 8H14M2 12h2.5l2-2.3M9.5 6.3L11.5 4H14M12 2l2 2-2 2M12 10l2 2-2 2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ----------------------------- Icons -----------------------------

function SsoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 1l6.5 2.5v5C15.5 12.5 12.7 15.7 9 17c-3.7-1.3-6.5-4.5-6.5-8.5v-5L9 1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 9.2L8.2 11l3.3-3.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M7 2L3 6L7 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 8s2.5-4.5 6-4.5c1.2 0 2.3.4 3.2 1M14 8s-.6 1-1.6 2M2 2l12 12M7 7.2A2 2 0 0 0 8.8 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className="animate-spin"
      aria-hidden
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.25"
        fill="none"
      />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
