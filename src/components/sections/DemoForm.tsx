import { useRef, useState } from "react";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { SectionHeader } from "../ui/SectionHeader";
import { cn } from "../../lib/cn";
import { useT } from "../../i18n";
import { submitDemoRequest, type DemoRequestPayload } from "../../lib/api";
import { track } from "../../lib/analytics";

type FormState = {
  fullName: string;
  companyName: string;
  jobTitle: string;
  email: string;
  phone: string;
  interestedModule: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Loose international phone: digits, spaces, +, -, (), at least 7 digits total.
const PHONE_RE = /^[+\d][\d\s().-]{6,}$/;

export function DemoForm() {
  const t = useT();
  const copy = t.demo;

  const [values, setValues] = useState<FormState>(() => ({
    fullName: "",
    companyName: "",
    jobTitle: "",
    email: "",
    phone: "",
    interestedModule: copy.fields.interestedModule.options[0],
    message: "",
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "duplicate" | "timeout"
  >("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const startedRef = useRef(false);
  const submittingRef = useRef(false);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    if (!startedRef.current) {
      startedRef.current = true;
      track("form_started");
    }
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(state: FormState): FormErrors {
    const e: FormErrors = {};
    (["fullName", "companyName", "jobTitle", "email", "phone"] as const).forEach(
      (k) => {
        if (!state[k].trim()) e[k] = copy.errors.required;
      },
    );
    if (state.email && !EMAIL_RE.test(state.email.trim())) {
      e.email = copy.errors.email;
    }
    if (state.phone && !PHONE_RE.test(state.phone.trim())) {
      e.phone = copy.errors.phone;
    }
    return e;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;

    const v: FormErrors = validate(values);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      const first = Object.keys(v)[0];
      const el = document.getElementById(`demo-${first}`);
      el?.focus();
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");
    setServerError(null);

    const payload: DemoRequestPayload = {
      ...values,
      source: "landing-page",
    };

    const res = await submitDemoRequest(payload);
    submittingRef.current = false;

    if (res.status === "ok") {
      setStatus("success");
      track("form_submitted", { module: values.interestedModule });
      return;
    }
    if (res.status === "duplicate") {
      setStatus("duplicate");
      track("form_submit_failed", { reason: "duplicate" });
      return;
    }
    if (res.status === "timeout") {
      setStatus("timeout");
      setServerError(copy.errors.timeout);
      track("form_submit_failed", { reason: "timeout" });
      return;
    }
    setStatus("error");
    setServerError(copy.errors.submit);
    track("form_submit_failed", { reason: "server" });
  }

  const submitting = status === "submitting";

  return (
    <section id="demo" className="bg-canvas scroll-mt-[80px]">
      <div className="mx-auto max-w-container px-2xl py-section-lg">
        <div className="grid gap-section lg:grid-cols-[1fr_1.1fr] items-start">
          <SectionHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            subtitle={copy.subtitle}
          />

          <div className="relative z-10 rounded-3xl border border-hairline-soft bg-surface-soft p-2xl">
            {status === "success" || status === "duplicate" ? (
              <SuccessState
                duplicate={status === "duplicate"}
                onReset={() => {
                  setStatus("idle");
                  startedRef.current = false;
                  setValues((v) => ({ ...v, message: "" }));
                }}
              />
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                aria-busy={submitting}
                className="grid gap-md md:grid-cols-2"
              >
                <Field
                  label={copy.fields.fullName.label}
                  htmlFor="demo-fullName"
                  required
                  error={errors.fullName}
                >
                  <Input
                    id="demo-fullName"
                    name="fullName"
                    autoComplete="name"
                    placeholder={copy.fields.fullName.placeholder}
                    value={values.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={
                      errors.fullName ? "demo-fullName-error" : undefined
                    }
                  />
                </Field>

                <Field
                  label={copy.fields.companyName.label}
                  htmlFor="demo-companyName"
                  required
                  error={errors.companyName}
                >
                  <Input
                    id="demo-companyName"
                    name="companyName"
                    autoComplete="organization"
                    placeholder={copy.fields.companyName.placeholder}
                    value={values.companyName}
                    onChange={(e) => setField("companyName", e.target.value)}
                    aria-invalid={!!errors.companyName}
                    aria-describedby={
                      errors.companyName ? "demo-companyName-error" : undefined
                    }
                  />
                </Field>

                <Field
                  label={copy.fields.jobTitle.label}
                  htmlFor="demo-jobTitle"
                  required
                  error={errors.jobTitle}
                >
                  <Input
                    id="demo-jobTitle"
                    name="jobTitle"
                    autoComplete="organization-title"
                    placeholder={copy.fields.jobTitle.placeholder}
                    value={values.jobTitle}
                    onChange={(e) => setField("jobTitle", e.target.value)}
                    aria-invalid={!!errors.jobTitle}
                    aria-describedby={
                      errors.jobTitle ? "demo-jobTitle-error" : undefined
                    }
                  />
                </Field>

                <Field
                  label={copy.fields.email.label}
                  htmlFor="demo-email"
                  required
                  error={errors.email}
                >
                  <Input
                    id="demo-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder={copy.fields.email.placeholder}
                    value={values.email}
                    onChange={(e) => setField("email", e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? "demo-email-error" : undefined
                    }
                  />
                </Field>

                <Field
                  label={copy.fields.phone.label}
                  htmlFor="demo-phone"
                  required
                  error={errors.phone}
                >
                  <Input
                    id="demo-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder={copy.fields.phone.placeholder}
                    value={values.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    aria-invalid={!!errors.phone}
                    aria-describedby={
                      errors.phone ? "demo-phone-error" : undefined
                    }
                  />
                </Field>

                <Field
                  label={copy.fields.interestedModule.label}
                  htmlFor="demo-interestedModule"
                  required
                >
                  <Select
                    id="demo-interestedModule"
                    name="interestedModule"
                    options={copy.fields.interestedModule.options}
                    value={values.interestedModule}
                    onChange={(e) =>
                      setField("interestedModule", e.target.value)
                    }
                  />
                </Field>

                <Field
                  label={copy.fields.message.label}
                  htmlFor="demo-message"
                  className="md:col-span-2"
                >
                  <Textarea
                    id="demo-message"
                    name="message"
                    placeholder={copy.fields.message.placeholder}
                    value={values.message}
                    onChange={(e) => setField("message", e.target.value)}
                  />
                </Field>

                {serverError && (
                  <div
                    role="alert"
                    className={cn(
                      "md:col-span-2 rounded-md border px-md py-sm text-body-sm",
                      "bg-coral-light border-brand-red-dark text-coral-dark pastel",
                    )}
                  >
                    {serverError}
                  </div>
                )}

                <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-md mt-xs">
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={submitting}
                    className="sm:flex-none"
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-xs">
                        <Spinner /> {copy.submitting}
                      </span>
                    ) : (
                      copy.submit
                    )}
                  </Button>
                  <p className="text-caption text-stone">{copy.consent}</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
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

function SuccessState({
  duplicate,
  onReset,
}: {
  duplicate: boolean;
  onReset: () => void;
}) {
  const t = useT();
  return (
    <div
      role="status"
      aria-live="polite"
      className="text-center flex flex-col items-center gap-md py-xl"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success-accent text-on-primary text-heading-5">
        ✓
      </div>
      <h3 className="text-heading-3 text-ink font-display">
        {duplicate ? t.demo.errors.duplicate : t.demo.successTitle}
      </h3>
      <p className="text-body-md text-slate max-w-[440px]">{t.demo.success}</p>
      <Button variant="secondary" size="md" onClick={onReset}>
        {t.demo.sendAnother}
      </Button>
    </div>
  );
}
